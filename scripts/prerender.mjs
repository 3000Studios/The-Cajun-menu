// Prerenders the public routes of the SPA into static HTML inside dist/ at
// build time, using the built SPA shell (dist/index.html) as the template.
// Crawlers and no-JS visitors get the real page content (full menu, guides,
// about/contact, policies) in raw HTML; the React app still boots from the
// same shell and replaces #root on render, so the interactive experience is
// unchanged. Content is derived at build time from the app's own sources:
// MENU_ITEMS in src/newConstants.ts and the view components in
// src/NewApp.tsx — no copy is invented here.
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'esbuild'

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = path.join(repoRoot, 'dist')
const SITE_URL = 'https://thecajunmenu.site'
const SITE_NAME = 'The Cajun Menu'

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

async function loadModule(entry) {
  const tmp = path.join(
    os.tmpdir(),
    `prerender-${path.basename(entry, path.extname(entry))}-${process.pid}.mjs`,
  )
  await build({
    entryPoints: [entry],
    bundle: true,
    format: 'esm',
    platform: 'node',
    outfile: tmp,
    logLevel: 'silent',
  })
  try {
    return await import(pathToFileURL(tmp).href)
  } finally {
    fs.rmSync(tmp, { force: true })
  }
}

// ---------- JSX visible-text extraction ----------
// Pulls the human-readable text out of a component's JSX: text nodes keep
// their nearest heading level; {expressions} are dropped except plain string
// literals. Good enough to mirror the page's real copy for crawlers.

function stripExpressions(src) {
  let out = ''
  let i = 0
  while (i < src.length) {
    const ch = src[i]
    if (ch === '{') {
      // find balanced close
      let depth = 0
      let j = i
      let str = null
      for (; j < src.length; j++) {
        const c = src[j]
        if (str) {
          if (c === '\\') j++
          else if (c === str) str = null
          continue
        }
        if (c === '"' || c === "'" || c === '`') str = c
        else if (c === '{') depth++
        else if (c === '}') {
          depth--
          if (depth === 0) break
        }
      }
      const inner = src.slice(i + 1, j).trim()
      const lit = inner.match(/^(['"])((?:\\.|(?!\1)[\s\S])*)\1$/)
      if (lit) out += lit[2].replace(/\\(['"])/g, '$1')
      else if (/^`[^`]*`$/.test(inner) && !inner.includes('${')) out += inner.slice(1, -1)
      else if (inner.includes('<')) {
        // Conditional JSX ({cond && <p>…</p>} / ternaries): keep the markup
        // between the first tag and the last tag; the JS scaffolding around
        // it is dropped later by the block filters.
        const first = inner.indexOf('<')
        const last = inner.lastIndexOf('>')
        if (last > first) out += stripExpressions(inner.slice(first, last + 1))
      }
      out += ' '
      i = j + 1
    } else {
      out += ch
      i++
    }
  }
  return out
}

function decodeEntities(t) {
  return t
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&apos;', "'")
    .replaceAll('&nbsp;', ' ')
}

const BLOCK_TAGS = new Set([
  'p', 'li', 'div', 'section', 'article', 'blockquote', 'tr', 'label',
  'button', 'header', 'footer', 'main', 'td', 'th', 'option', 'figcaption',
])

function jsxBlocks(src) {
  const cleaned = stripExpressions(
    src
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
      .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<style[\s\S]*?<\/style>/g, ' '),
  )
  const tokens = cleaned.split(/(<[^>]+>)/g)
  const blocks = []
  let level = 0
  let cur = ''
  const flush = () => {
    const t = decodeEntities(cur).replace(/\s+/g, ' ').trim()
    cur = ''
    if (t.length < 2) return
    if (!/[A-Za-z0-9]{2,}/.test(t)) return
    if (/^(import|export|const|let|var|function|return)\b/.test(t)) return
    if (t.includes('className') || t.includes('=>')) return
    if (blocks.length && blocks[blocks.length - 1].text === t) return
    blocks.push({ level, text: t })
  }
  for (const tok of tokens) {
    if (tok.startsWith('<')) {
      const m = tok.match(/^<\/?\s*([a-zA-Z][a-zA-Z0-9.]*)/)
      const tag = (m?.[1] ?? '').toLowerCase()
      const closing = tok.startsWith('</')
      if (/^h[1-6]$/.test(tag)) {
        flush()
        level = closing ? 0 : Number(tag[1])
        if (closing) level = 0
      } else if (tag === 'br') {
        cur += ' '
      } else if (BLOCK_TAGS.has(tag)) {
        flush()
      }
    } else {
      cur += tok
    }
  }
  flush()
  return blocks
}

function componentSpan(src, name, allSpans) {
  const span = allSpans.find((s) => s.name === name)
  if (!span) return ''
  const body = src.slice(span.start, span.end)
  let pos = body.indexOf('return')
  if (pos < 0) pos = body.indexOf('=>')
  const jsx = pos >= 0 ? body.slice(pos) : body
  const firstTag = jsx.indexOf('<')
  return firstTag >= 0 ? jsx.slice(firstTag) : jsx
}

function allComponentSpans(src) {
  const re = /\nconst ([A-Z]\w+)[\s:=]/g
  const spans = []
  let m
  while ((m = re.exec(src))) spans.push({ name: m[1], start: m.index + 1 })
  spans.sort((a, b) => a.start - b.start)
  spans.forEach((s, i) => {
    s.end = i + 1 < spans.length ? spans[i + 1].start : src.length
  })
  return spans
}

function renderBlocks(blocks) {
  let seenH1 = false
  return blocks
    .map((b) => {
      if (b.level > 0) {
        let lvl = b.level
        if (lvl === 1) {
          if (seenH1) lvl = 2
          else seenH1 = true
        }
        return `        <h${lvl}>${esc(b.text)}</h${lvl}>`
      }
      return `        <p>${esc(b.text)}</p>`
    })
    .join('\n')
}

// ---------- shell templating (fleet pattern) ----------

function renderPage(shell, { title, description, canonical, inner }) {
  let html = shell
  const swap = (regex, replacement) => {
    if (regex.test(html)) html = html.replace(regex, replacement)
    else html = html.replace('</head>', `${replacement}\n</head>`)
  }
  swap(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`)
  swap(
    /<meta[^>]*name="description"[^>]*>/i,
    `<meta name="description" content="${esc(description)}" />`,
  )
  swap(/<link[^>]*rel="canonical"[^>]*>/i, `<link rel="canonical" href="${esc(canonical)}" />`)
  swap(/<meta[^>]*property="og:title"[^>]*>/i, `<meta property="og:title" content="${esc(title)}" />`)
  swap(
    /<meta[^>]*property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${esc(description)}" />`,
  )
  swap(/<meta[^>]*property="og:url"[^>]*>/i, `<meta property="og:url" content="${esc(canonical)}" />`)
  swap(/<meta[^>]*name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${esc(title)}" />`)
  swap(
    /<meta[^>]*name="twitter:description"[^>]*>/i,
    `<meta name="twitter:description" content="${esc(description)}" />`,
  )
  if (/<div id="root">\s*<\/div>/.test(html)) {
    html = html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${inner}</div>`)
  } else {
    html = html.replace('<div id="root">', `<div id="root">${inner}`)
  }
  return html
}

function writeRoute(route, html) {
  const dir = route === '/' ? distRoot : path.join(distRoot, route)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
  console.log(`prerendered ${route}`)
}

function firstParagraph(blocks, fallback) {
  const p = blocks.find((b) => b.level === 0 && b.text.length > 40)
  const t = p ? p.text : fallback
  return t.length > 158 ? `${t.slice(0, 155).trimEnd()}…` : t
}

// ---------- build ----------

const shell = fs.readFileSync(path.join(distRoot, 'index.html'), 'utf8')
const appSrc = fs.readFileSync(path.join(repoRoot, 'src', 'NewApp.tsx'), 'utf8')
const spans = allComponentSpans(appSrc)
const blocksFor = (names) =>
  names.flatMap((n) => jsxBlocks(componentSpan(appSrc, n, spans)))

const { MENU_ITEMS } = await loadModule(path.join(repoRoot, 'src', 'newConstants.ts'))

// Restaurant facts straight from the JSON-LD block in index.html.
const indexSrc = fs.readFileSync(path.join(repoRoot, 'index.html'), 'utf8')
const ldMatch = indexSrc.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
const ld = ldMatch ? JSON.parse(ldMatch[1]) : {}
const addr = ld.address ?? {}
const addressLine = [addr.streetAddress, addr.addressLocality, addr.addressRegion, addr.postalCode]
  .filter(Boolean)
  .join(', ')
const hours = (ld.openingHoursSpecification ?? [])
  .map((h) => {
    const days = Array.isArray(h.dayOfWeek) ? h.dayOfWeek.join('–') : h.dayOfWeek
    return `${days}: ${h.opens}–${h.closes}`
  })
  .join(' · ')

const factsBlock = `
      <section>
        <h2>Visit us in Canton, GA</h2>
        <p>${esc(ld.name ?? SITE_NAME)} — ${esc(addressLine)}. Call ${esc(ld.telephone ?? '')} or email ${esc(ld.email ?? '')}.</p>
        <p>Hours: ${esc(hours)}. Price range ${esc(ld.priceRange ?? '$$')} · Serves ${esc((ld.servesCuisine ?? []).join(', '))} cuisine.</p>
      </section>`

// Home — hero/sections copy from the app's own components + signature dishes.
{
  const blocks = blocksFor(['Hero', 'HeroCopy', 'WhyLoveUs', 'ReviewsSection', 'LocationSection', 'FinalCTA'])
  const signature = MENU_ITEMS.filter((i) => i.isSignature)
  const sigHtml = signature
    .map(
      (i) => `        <article>
          <h3>${esc(i.name)} — ${esc(i.price)}</h3>
          <p>${esc(i.description)}</p>
        </article>`,
    )
    .join('\n')
  const inner = `<main>
${renderBlocks(blocks)}
      <section>
        <h2>Signature favorites</h2>
${sigHtml}
        <p><a href="/menu">See the full menu</a> · <a href="/reservations">Reserve a table</a> · <a href="/order">Order online</a></p>
      </section>${factsBlock}
    </main>`
  writeRoute(
    '/',
    renderPage(shell, {
      title: 'The Cajun Menu | Authentic Cajun Cuisine in Canton, GA',
      description:
        'Big Cajun flavor with a warm Southern welcome. Fresh seafood, slow-simmered classics, and bold Louisiana comfort in Canton, GA.',
      canonical: `${SITE_URL}/`,
      inner,
    }),
  )
}

// Menu — the full menu, grouped by category, from MENU_ITEMS.
{
  const categories = [...new Set(MENU_ITEMS.map((i) => i.category))]
  const groups = categories
    .map((cat) => {
      const items = MENU_ITEMS.filter((i) => i.category === cat)
        .map(
          (i) => `        <article>
          <h3>${esc(i.name)} — ${esc(i.price)}${i.isSignature ? ' (Popular)' : ''}</h3>
          <p>${esc(i.description)}</p>
        </article>`,
        )
        .join('\n')
      return `      <section>
        <h2>${esc(cat)}</h2>
${items}
      </section>`
    })
    .join('\n')
  const inner = `<main>
      <h1>The Menu</h1>
      <p>Made fresh. Bold seasoning. Real comfort. The full menu at ${esc(SITE_NAME)}, Canton, GA — appetizers, salads, main courses, po-boys, baskets, kids menu, desserts, sides and drinks, with prices.</p>
${groups}
      <p>Ask about allergies and gluten-free options.</p>${factsBlock}
    </main>`
  writeRoute(
    '/menu',
    renderPage(shell, {
      title: 'Menu | The Cajun Menu — Cajun Restaurant in Canton, GA',
      description: `Full menu with prices: ${MENU_ITEMS.slice(0, 4).map((i) => i.name).join(', ')} and more — Cajun classics, seafood boils, po-boys and desserts in Canton, GA.`,
      canonical: `${SITE_URL}/menu`,
      inner,
    }),
  )
}

// Component-driven pages.
const PAGES = [
  { route: '/about', components: ['AboutView'], title: 'About Us' },
  { route: '/contact', components: ['ContactView'], title: 'Contact Us' },
  { route: '/reservations', components: ['ReservationsView'], title: 'Reservations' },
  { route: '/order', components: ['OrderView'], title: 'Order Online' },
  { route: '/catering', components: ['CateringView'], title: 'Catering' },
  { route: '/guides/gumbo', components: ['GumboGuideView'], title: 'How to Make Real Cajun Gumbo' },
  { route: '/guides/holy-trinity', components: ['HolyTrinityGuideView'], title: 'The Holy Trinity of Cajun Cooking' },
  { route: '/guides/crawfish-boil', components: ['CrawfishBoilGuideView'], title: 'Crawfish Boil Guide' },
  { route: '/privacy', components: ['PrivacyView'], title: 'Privacy Policy' },
  { route: '/terms', components: ['TermsView'], title: 'Terms of Service' },
]

for (const page of PAGES) {
  const blocks = blocksFor(page.components)
  const hasH1 = blocks.some((b) => b.level === 1)
  const inner = `<main>
${hasH1 ? '' : `      <h1>${esc(page.title)}</h1>\n`}${renderBlocks(blocks)}${['/contact', '/about', '/reservations', '/order', '/catering'].includes(page.route) ? factsBlock : ''}
    </main>`
  writeRoute(
    page.route,
    renderPage(shell, {
      title: `${page.title} | The Cajun Menu`,
      description: firstParagraph(blocks, `${page.title} — ${SITE_NAME}, authentic Cajun cuisine in Canton, GA.`),
      canonical: `${SITE_URL}${page.route}`,
      inner,
    }),
  )
}

console.log(`prerender complete: ${2 + PAGES.length} routes`)
