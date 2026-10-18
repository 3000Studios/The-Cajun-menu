import React, { useMemo, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Calendar,
  ChevronRight,
  Clock,
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Menu as MenuIcon,
  Phone,
  X,
} from 'lucide-react';
import { MENU_ITEMS } from './newConstants';
import ErrorBoundary from './components/ErrorBoundary';
const GatorBobWidget = React.lazy(() => import('./components/GatorBobWidget'));

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Menu', to: '/menu' },
  { label: 'Reservations', to: '/reservations' },
  { label: 'Order', to: '/order' },
  { label: 'Catering', to: '/catering' },
  { label: 'Gumbo Guide', to: '/guides/gumbo' },
  { label: 'Holy Trinity', to: '/guides/holy-trinity' },
  { label: 'Crawfish Boil', to: '/guides/crawfish-boil' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'Planner', to: '/planner', external: true },
];

const scrollReveal = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const useHeaderSolid = () => {
  const [solid, setSolid] = useState(false);
  React.useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return solid;
};

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const solid = useHeaderSolid();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[1000] h-16 md:h-[72px] transition-colors ${solid ? 'wallpaper-panel shadow-sm border-b border-[color:var(--border)]' : 'bg-transparent'
        }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-left"
        >
          <span className="logo">
            THE CAJUN MENU
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            link.external ? (
              <a
                key={link.to}
                href={link.to}
                className="text-sm font-medium transition-colors nav-link-shimmer text-[color:var(--text)]"
              >
                {link.label}
              </a>
            ) : (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors nav-link-shimmer ${isActive ? 'text-[color:var(--accent)]' : 'text-[color:var(--text)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            )
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => navigate('/order')}
            className="text-sm font-semibold text-[color:var(--secondary)] hover:text-[color:var(--primary)]"
          >
            Order Online
          </button>
          <button
            onClick={() => navigate('/reservations')}
            className="h-11 md:h-12 px-5 rounded-full bg-[color:var(--secondary)] text-white text-sm font-semibold shadow-sm hover:shadow-[0_0_20px_rgba(178,148,94,0.55)] transition"
          >
            Reserve
          </button>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="lg:hidden text-[color:var(--text)]"
          aria-label="Open menu"
        >
          <MenuIcon />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1200] wallpaper-panel"
          >
            <div className="mx-auto max-w-6xl px-6 py-8 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <span className="text-[color:var(--primary)] font-serif text-xl font-semibold logo-shimmer">
                  THE CAJUN MENU
                </span>
                <button onClick={() => setOpen(false)} aria-label="Close menu">
                  <X />
                </button>
              </div>

              <div className="mt-10 flex-1 flex flex-col gap-6">
                {NAV_LINKS.map((link) => (
                  link.external ? (
                    <a
                      key={link.to}
                      href={link.to}
                      onClick={() => setOpen(false)}
                      className="text-2xl font-semibold text-[color:var(--text)]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className="text-2xl font-semibold text-[color:var(--text)]"
                    >
                      {link.label}
                    </NavLink>
                  )
                ))}

                <div className="mt-6 space-y-4 text-sm text-[color:var(--muted)]">
                  <div className="flex items-center gap-2">
                    <Phone size={16} /> (678) 899-7404
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> Wed–Sat 11AM–8PM, Sun 12PM–5PM
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    onClick={() => { setOpen(false); navigate('/reservations'); }}
                    className="h-12 rounded-full bg-[color:var(--secondary)] text-white font-semibold hover:shadow-[0_0_20px_rgba(178,148,94,0.55)] transition"
                  >
                    Reserve
                  </button>
                  <button
                    onClick={() => { setOpen(false); navigate('/order'); }}
                    className="h-12 rounded-full border border-[color:var(--border)] text-[color:var(--text)] font-semibold"
                  >
                    Order Online
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="hero relative pt-20 md:pt-24 min-h-[72vh] md:min-h-[80vh] bg-transparent">
      <div className="absolute inset-0 overflow-hidden">
        {/* @ts-expect-error: Web component not in JSX types */}
        <wistia-player media-id="14ushhwlms" className="hero-wistia" aspect="1.7777777777777777" muted autoPlay loop playsInline />
        <style>
          {`wistia-player[media-id='14ushhwlms']:not(:defined) {
              background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/14ushhwlms/swatch');
              display: block;
              filter: blur(5px);
              width: 100%;
              height: 100%;
            }`}
        </style>
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(115deg, rgba(19,10,31,0.88) 0%, rgba(19,10,31,0.72) 42%, rgba(11,7,19,0.0) 72%)',
        }}
        aria-hidden
      />
    </section>
  );
};

const HeroCopy: React.FC = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={scrollReveal}
          initial={reduceMotion ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
          className="max-w-xl"
        >
          <p className="text-sm uppercase tracking-widest text-[color:var(--accent)] font-semibold">
            Authentic Cajun Cuisine • Canton, GA
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-serif font-semibold leading-tight text-[color:var(--text)]">
            Big Cajun Flavor. Warm Southern Welcome.
          </h1>
          <p className="mt-4 text-base md:text-lg text-[color:var(--text)]/90 leading-relaxed">
            Fresh seafood, slow-simmered classics, and bold Louisiana comfort—served with Mardi Gras spirit.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/reservations')}
              className="h-11 md:h-12 px-6 rounded-full bg-[color:var(--secondary)] text-white font-semibold shadow-sm hover:shadow-[0_0_20px_rgba(178,148,94,0.55)] transition"
            >
              Reserve a Table
            </button>
            <button
              onClick={() => navigate('/order')}
              className="h-11 md:h-12 px-6 rounded-full border border-[color:var(--border)] text-[color:var(--text)] font-semibold"
            >
              Order Online
            </button>
          </div>
          <p className="mt-4 text-sm text-[color:var(--muted)]">Open Today • See Hours ↓</p>
        </motion.div>
      </div>
    </section>
  );
};

const QuickActions: React.FC = () => (
  <section className="py-12">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Call Now', icon: <Phone size={18} />, href: 'tel:6788997404' },
          { label: 'Directions', icon: <MapPin size={18} />, href: 'https://maps.google.com/?q=140+Keith+Dr,+Canton,+GA+30114' },
          { label: 'Hours', icon: <Clock size={18} />, href: '/contact' },
          { label: 'View Menu', icon: <ChevronRight size={18} />, href: '/menu' },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 rounded-full border border-[color:var(--accent)] bg-[color:var(--secondary)] px-4 py-3 text-sm font-semibold text-white shadow-[0_0_18px_rgba(0,0,0,0.15)] hover:shadow-[0_0_22px_rgba(178,148,94,0.45)] transition"
          >
            <span className="text-current">{action.icon}</span>
            {action.label}
          </a>
        ))}
      </div>
    </div>
  </section>
);
const SignatureFavorites: React.FC = () => {
  const highlights = MENU_ITEMS.filter((item) => item.isSignature).slice(0, 6);
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <p className="text-sm uppercase tracking-widest text-[color:var(--emerald)] font-semibold">Signature Favorites</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-serif text-[color:var(--primary)] leading-tight">Crave-worthy Cajun Classics</h2>
          </div>
          <a href="/menu" className="text-sm font-semibold text-[color:var(--accent)] flex items-center gap-2">
            View Menu <ChevronRight size={16} />
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl border border-[color:var(--accent)] bg-[color:var(--card)] p-5 md:p-7 shadow-[0_0_24px_rgba(178,148,94,0.25)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_36px_rgba(178,148,94,0.45)]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[color:var(--border)] transition-transform duration-300 group-hover:scale-[1.03]">
                {item.image?.endsWith('.mp4') ? (
                  <video className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.08]" src={item.image} muted autoPlay loop playsInline />
                ) : (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.08]" loading="lazy" />
                )}
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl dish-title">{item.name}</h3>
                  <p className="text-sm text-[color:var(--accent)]">{item.description}</p>
                </div>
                <span className="text-sm font-semibold price-lime">{item.price}</span>
              </div>
              <div className="mt-3">
                <span className="inline-flex items-center rounded-full bg-[color:var(--secondary)] px-3 py-1 text-xs text-white">
                  Popular
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyLoveUs: React.FC = () => (
  <section className="py-12 md:py-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-8">
      <div className="md:col-span-6 space-y-4">
        <h2 className="text-3xl md:text-4xl font-serif text-[color:var(--primary)]">Why People Love Us</h2>
        <ul className="space-y-3 text-[color:var(--text)]">
          <li className="flex items-start gap-3"><span className="text-[color:var(--accent)]">●</span> Made-to-order Cajun classics</li>
          <li className="flex items-start gap-3"><span className="text-[color:var(--accent)]">●</span> Family-friendly, welcoming vibe</li>
          <li className="flex items-start gap-3"><span className="text-[color:var(--accent)]">●</span> Great for groups + events</li>
        </ul>
      </div>
      <div className="md:col-span-6">
        <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 text-[color:var(--text)]">
          <p>
            We’re proud to bring Louisiana comfort to Canton—slow-simmered roux, sizzling seafood boils,
            and a warm table for every celebration.
          </p>
        </div>
      </div>
    </div>
  </section>
);

const ReservationsPreview: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-6">
          <h2 className="text-3xl md:text-4xl font-serif text-[color:var(--primary)]">Reserve in Seconds</h2>
          <p className="mt-3 text-[color:var(--text)]">
            Choose your time. Get instant confirmation. We’ll see you soon.
          </p>
          <p className="mt-2 text-sm text-[color:var(--muted)]">For parties of 8+, call us.</p>
        </div>
        <div className="md:col-span-6">
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[color:var(--text)]">
                <Calendar size={18} className="text-[color:var(--accent)]" /> Quick reservation form
              </div>
              <button
                onClick={() => navigate('/reservations')}
                className="h-11 md:h-12 w-full rounded-full bg-[color:var(--secondary)] text-white font-semibold hover:shadow-[0_0_20px_rgba(178,148,94,0.55)] transition"
              >
                Reserve a Table
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
const ReviewsSection: React.FC = () => (
  <section className="py-12 md:py-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl md:text-4xl font-serif text-[color:var(--primary)]">Reviews & Social Proof</h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {['“Flavor-packed and so welcoming.”', '“Best seafood boil in Canton.”', '“Perfect for family night.”'].map((quote) => (
          <div key={quote} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 text-[color:var(--text)]">
            {quote}
          </div>
        ))}
      </div>
      <button className="mt-6 text-sm font-semibold text-[color:var(--accent)]">Read More Reviews</button>
    </div>
  </section>
);

const YelpReviewsSection: React.FC = () => (
  <section className="py-12 md:py-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif text-[color:var(--primary)]">Official Yelp Reviews</h2>
          <p className="mt-2 text-[color:var(--text)]">See what guests are saying on Yelp.</p>
        </div>
        <a
          href="https://www.yelp.com/biz/the-cajun-menu-canton"
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-[color:var(--accent)] flex items-center gap-2"
        >
          View on Yelp <ExternalLink size={14} />
        </a>
      </div>
      <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
        <iframe
          title="The Cajun Menu Yelp Reviews"
          src="https://www.yelp.com/biz/the-cajun-menu-canton"
          className="w-full h-[420px] rounded-xl border border-[color:var(--border)]"
        />
      </div>
    </div>
  </section>
);
const LocationSection: React.FC = () => (
  <section className="py-12 md:py-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-8">
      <div className="md:col-span-4 space-y-4">
        <h3 className="text-xl md:text-2xl font-serif text-[color:var(--primary)]">Find Us</h3>
        <p className="text-[color:var(--text)]">140 Keith Dr, Canton, GA 30114</p>
        <a className="text-sm font-semibold text-[color:var(--accent)]" href="https://maps.google.com/?q=140+Keith+Dr,+Canton,+GA+30114">
          Get Directions <ExternalLink size={14} className="inline" />
        </a>
      </div>
      <div className="md:col-span-4">
        <h3 className="text-xl md:text-2xl font-serif text-[color:var(--primary)]">Hours</h3>
        <div className="mt-3 text-sm text-[color:var(--text)] space-y-1">
          <div>Sunday: 12PM–5PM</div>
          <div>Monday: Closed</div>
          <div>Tuesday: Closed</div>
          <div>Wednesday/Thursday: 11AM–8PM</div>
          <div>Friday/Saturday: 11AM–8PM</div>
        </div>
      </div>
      <div className="md:col-span-4">
        <iframe
          title="The Cajun Menu"
          src="https://www.google.com/maps?q=140+Keith+Dr,+Canton,+GA+30114&output=embed&t=k"
          className="w-full h-72 rounded-2xl border border-[color:var(--border)]"
          loading="lazy"
        />
      </div>
    </div>
  </section>
);

const FinalCTA: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="py-12 md:py-16 wallpaper-panel text-[color:var(--text)]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto w-16 h-[2px] bg-[color:var(--accent)] mb-6" />
        <h2 className="text-3xl md:text-4xl font-serif">Ready for real Cajun comfort?</h2>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate('/reservations')}
            className="h-11 md:h-12 px-6 rounded-full bg-[color:var(--secondary)] text-white font-semibold"
          >
            Reserve
          </button>
          <button
            onClick={() => navigate('/order')}
            className="h-11 md:h-12 px-6 rounded-full border border-[color:var(--accent)] text-[color:var(--text)] font-semibold"
          >
            Order
          </button>
        </div>
      </div>
    </section>
  );
};

const HomeView: React.FC = () => (
  <main className="space-y-10 md:space-y-14">
    <Hero />
    <HeroCopy />
    <QuickActions />
    <SignatureFavorites />
    <WhyLoveUs />
    <ReservationsPreview />
    <ReviewsSection />
    <YelpReviewsSection />
    <LocationSection />
    <FinalCTA />
  </main>
);

const MenuView: React.FC = () => {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const reduceMotion = useReducedMotion();

  const categories = ['All', 'Appetizers', 'Salads', 'Signature', 'Seafood', 'Po-Boys', 'Desserts', 'Drinks'];

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return MENU_ITEMS.filter((item) => {
      if (category === 'Signature' && !item.isSignature) return false;
      if (category === 'Appetizers' && item.category !== 'Appetizers') return false;
      if (category === 'Salads' && item.category !== 'Salads') return false;
      if (category === 'Po-Boys' && item.category !== 'Po-Boys') return false;
      if (category === 'Desserts' && item.category !== 'Desserts') return false;
      if (category === 'Drinks' && item.category !== 'Drinks') return false;
      if (category === 'Seafood') {
        const seafoodRegex = /(shrimp|crab|crawfish|oyster|seafood|boil|gumbo)/i;
        if (!seafoodRegex.test(`${item.name} ${item.description}`)) return false;
      }
      if (category !== 'All' && category !== 'Signature' && category !== 'Seafood' && !['Appetizers', 'Salads', 'Desserts', 'Drinks', 'Po-Boys'].includes(category)) {
        return false;
      }
      if (q && !`${item.name} ${item.description}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [category, query]);

  return (
    <section className="pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif text-[color:var(--primary)]">The Menu</h1>
          <p className="mt-3 text-[color:var(--text)]">Made fresh. Bold seasoning. Real comfort.</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3 justify-center sticky top-16 md:top-[72px] wallpaper-panel py-4 z-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm border transition ${category === cat
                ? 'bg-[color:var(--primary)] text-[color:var(--bg)] border-[color:var(--primary)]'
                : 'border-[color:var(--border)] text-[color:var(--text)]'
                }`}
            >
              {cat}
            </button>
          ))}
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes…"
            className="ml-auto w-full md:w-64 border border-[color:var(--border)] rounded-full px-4 py-2 text-sm"
          />
        </div>

        <motion.div
          variants={scrollReveal}
          initial={reduceMotion ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: 'easeOut' }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl border border-[color:var(--accent)] bg-[color:var(--card)] p-5 md:p-7 flex flex-col shadow-[0_0_24px_rgba(178,148,94,0.25)] transition-transform duration-300 hover:-translate-y-2 hover:shadow-[0_0_36px_rgba(178,148,94,0.45)]"
            >
              <div className="aspect-[4/3] w-full overflow-hidden rounded-xl bg-[color:var(--border)] transition-transform duration-300 group-hover:scale-[1.03]">
                {item.image?.endsWith('.mp4') ? (
                  <video className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.08]" src={item.image} muted autoPlay loop playsInline />
                ) : (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.08]" loading="lazy" />
                )}
              </div>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl dish-title">{item.name}</h3>
                  <p className="text-sm text-[color:var(--accent)] line-clamp-2">{item.description}</p>
                </div>
                <span className="text-sm font-semibold price-lime">{item.price}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                {item.isSignature && (
                  <span className="px-2 py-1 rounded-full bg-[color:var(--secondary)] text-white">Popular</span>
                )}
                <span className="px-2 py-1 rounded-full border border-[color:var(--border)] text-[color:var(--muted)]">Ask about allergies</span>
              </div>
            </article>
          ))}
        </motion.div>

        <p className="mt-8 text-sm text-[color:var(--muted)]">Ask about allergies and gluten-free options.</p>
      </div>
    </section>
  );
};

const ReservationsView: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [calendarLink, setCalendarLink] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      date: formData.get('date'),
      time: formData.get('time'),
      guests: formData.get('guests'),
      notes: formData.get('notes'),
    };

    setStatus('loading');
    setMessage('');
    setCalendarLink('');

    try {
      const response = await fetch('/api/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Reservation could not be processed.');
      }

      const startDate = `${payload.date}T${payload.time}`;
      const dtStart = new Date(startDate).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const dtEnd = new Date(new Date(startDate).getTime() + 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      const ics = `BEGIN:VCALENDAR\\nVERSION:2.0\\nPRODID:-//The Cajun Menu//Reservations//EN\\nBEGIN:VEVENT\\nDTSTART:${dtStart}\\nDTEND:${dtEnd}\\nSUMMARY:Reservation for ${payload.name}\\nLOCATION:The Cajun Menu, 140 Keith Dr, Canton, GA 30114\\nEND:VEVENT\\nEND:VCALENDAR`;
      setCalendarLink(`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`);

      setStatus('success');
      setMessage('Reservation confirmed! Check your email for confirmation.');
      form.reset();
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'We could not complete the reservation. Please try again.');
    }
  };

  return (
    <section className="pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-8">
        <div className="md:col-span-6 space-y-4">
          <h1 className="text-4xl md:text-6xl font-serif text-[color:var(--primary)]">Reserve in Seconds</h1>
          <p className="text-[color:var(--text)]">Choose your time. Get instant confirmation. We’ll see you soon.</p>
          <p className="text-sm text-[color:var(--muted)]">For parties of 8+, call us.</p>
        </div>
        <div className="md:col-span-6">
          <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <input name="name" placeholder="Name" className="w-full rounded-full border border-[color:var(--border)] px-4 py-3" required />
              <input name="email" placeholder="Email" className="w-full rounded-full border border-[color:var(--border)] px-4 py-3" required />
              <input name="phone" placeholder="Phone" className="w-full rounded-full border border-[color:var(--border)] px-4 py-3" required />
              <div className="grid grid-cols-2 gap-3">
                <input name="date" type="date" className="rounded-full border border-[color:var(--border)] px-4 py-3" required />
                <input name="time" type="time" className="rounded-full border border-[color:var(--border)] px-4 py-3" required />
              </div>
              <input name="guests" placeholder="Party size" className="w-full rounded-full border border-[color:var(--border)] px-4 py-3" required />
              <textarea name="notes" placeholder="Notes" className="w-full rounded-2xl border border-[color:var(--border)] px-4 py-3" />
              {message && (
                <div className={`rounded-xl px-4 py-3 text-sm ${status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}
              {calendarLink && (
                <a href={calendarLink} download="reservation.ics" className="text-sm font-semibold text-[color:var(--accent)]">
                  Add to Calendar
                </a>
              )}
              <button
                type="submit"
                disabled={status === 'loading'}
                className="h-11 md:h-12 w-full rounded-full bg-[color:var(--secondary)] text-white font-semibold disabled:opacity-60 hover:shadow-[0_0_20px_rgba(178,148,94,0.55)] transition"
              >
                {status === 'loading' ? 'Submitting...' : 'Confirm Reservation'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const OrderView: React.FC = () => (
  <section className="pt-24 md:pt-28 pb-12 md:pb-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl md:text-6xl font-serif text-[color:var(--primary)]">Order Online</h1>
      <p className="mt-3 text-[color:var(--text)]">Order pickup or delivery from your favorite platform.</p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        {['Order Pickup', 'Order Delivery'].map((label) => (
          <div key={label} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
            <h3 className="text-xl font-serif text-[color:var(--primary)]">{label}</h3>
            <button className="mt-4 h-11 px-6 rounded-full bg-[color:var(--secondary)] text-white font-semibold hover:shadow-[0_0_20px_rgba(178,148,94,0.55)] transition">
              Start Order
            </button>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const CateringView: React.FC = () => (
  <section className="pt-24 md:pt-28 pb-12 md:pb-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl md:text-6xl font-serif text-[color:var(--primary)]">Catering & Events</h1>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Starter', 'Classic', 'Feast'].map((tier) => (
          <div key={tier} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
            <h3 className="text-xl font-serif text-[color:var(--primary)]">{tier} Package</h3>
            <p className="mt-2 text-[color:var(--text)]">Built for gatherings with bold Cajun flavor.</p>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
        <h3 className="text-xl font-serif text-[color:var(--primary)]">Request a Quote</h3>
        <form className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {['Name', 'Email', 'Phone', 'Date', 'Guest Count'].map((label) => (
            <input key={label} placeholder={label} className="rounded-full border border-[color:var(--border)] px-4 py-3" />
          ))}
          <textarea placeholder="Notes" className="md:col-span-2 rounded-2xl border border-[color:var(--border)] px-4 py-3" />
          <button className="md:col-span-2 h-11 md:h-12 rounded-full bg-[color:var(--secondary)] text-white font-semibold hover:shadow-[0_0_20px_rgba(178,148,94,0.55)] transition">
            Request a Quote
          </button>
        </form>
      </div>
    </div>
  </section>
);

const GumboGuideView: React.FC = () => (
  <section className="pt-24 md:pt-28 pb-12 md:pb-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
      <div>
        <p className="text-mgGold font-black uppercase tracking-[0.35em] text-[11px]">Guide</p>
        <h1 className="text-4xl md:text-6xl font-serif text-[color:var(--primary)]">Gumbo, Start to Finish</h1>
        <p className="mt-3 text-[color:var(--text)]">
          Gumbo is less a recipe than a method: a roux, the holy trinity, a good stock, and the patience to let
          them become something bigger than the sum of their parts. Here is the whole arc, the way it is taught
          in Louisiana home kitchens.
        </p>
      </div>
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 space-y-4">
        <h3 className="text-xl font-serif text-[color:var(--primary)]">It starts with the roux — and only the roux</h3>
        <p className="text-[color:var(--text)]">
          A roux is equal parts flour and fat, cooked together until the flour toasts. That is the entire
          ingredient list, and it still manages to be the most argued-over step in Cajun cooking. The fat can be
          oil, butter, lard, or rendered poultry fat; the flour is plain all-purpose. What matters is the color
          you take it to, because color is flavor. A blond roux, cooked a few minutes, thickens well and tastes
          mild. A peanut-butter roux brings nuttiness. A dark roux — the color of an old copper penny or milk
          chocolate — is the soul of a classic chicken-and-sausage gumbo: deeply toasty, almost smoky, and
          noticeably thinner as a thickener, because the longer flour cooks, the less thickening power it keeps.
        </p>
        <p className="text-[color:var(--text)]">
          The discipline is simple and non-negotiable: stir constantly, scrape the corners, and never walk away.
          A dark roux can take anywhere from twenty minutes to the better part of an hour depending on heat, and
          it can burn in the time it takes to answer a text. Specks of black mean it is scorched, and a scorched
          roux cannot be saved — throw it out and start again. Every Louisiana cook has done this. It is tuition.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">The trinity goes in, and the sizzle settles it</h3>
        <p className="text-[color:var(--text)]">
          When the roux reaches your color, the chopped holy trinity — onion, bell pepper, and celery — goes
          straight in. This does two jobs at once: it stops the roux from cooking further by cooling the pot,
          and it starts building the aromatic base. Cook the vegetables in the roux until the onions soften and
          the raw edge comes off, then add garlic for the last minute or so; garlic burns fast and bitter, which
          is why it never goes in first.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">Stock, slowly</h3>
        <p className="text-[color:var(--text)]">
          Add warm stock a ladle at a time, stirring as you go, so the roux absorbs the liquid smoothly instead
          of seizing into lumps. Chicken stock for a chicken-and-sausage gumbo; seafood stock for a seafood
          gumbo. Once it is all in and simmering, skim the fat that rises if you want a cleaner finish. Then
          season in layers: salt, black pepper, cayenne, bay leaves, thyme. A gumbo should taste slightly
          under-seasoned at this stage, because it is about to simmer down and concentrate.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">Proteins, timing, and the long simmer</h3>
        <p className="text-[color:var(--text)]">
          Brown your sausage and chicken before they ever meet the pot — that fond is flavor the gumbo cannot
          get any other way — and add them after the stock. Then let it simmer low and slow, at least an hour,
          longer if you have it. Seafood gumbo plays by different rules: shrimp and crab go in near the very end,
          because seafood overcooks in minutes while the base needs the hour. Okra, when you use it, is both an
          ingredient and a thickener; some cooks sauté it separately first to tame its texture. Filé powder —
          ground sassafras leaves — is the other traditional thickener, and it belongs at the table, stirred into
          individual bowls off the heat, never boiled, which turns it stringy.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">Serving and second-day truth</h3>
        <p className="text-[color:var(--text)]">
          Serve over a scoop of white rice — in the bowl first or alongside, depending on family law — with
          green onions on top and hot sauce on the table. And know this: gumbo is famously better the next day,
          after a night in the refrigerator lets the flavors marry. Make more than you need. Everybody does.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">Three mistakes that flatten a gumbo</h3>
        <p className="text-[color:var(--text)]">
          The first is impatience at the simmer. A gumbo pulled off the heat after twenty minutes tastes like
          seasoned stock with things in it; the roux has not yet married the broth, and the whole pot reads thin
          and separate. Give it the hour. The second is seasoning only at the end. Salt and pepper added in
          layers — a little with the trinity, a little after the stock, a correction at the finish — build a
          depth that a final heavy hand cannot imitate, because late seasoning sits on top of the dish instead
          of inside it. The third is boiling the filé. Filé goes in off the heat, at the table, bowl by bowl;
          boiled, it turns a proud gumbo ropey and stringy, which is the one texture nobody at the table asked
          for. None of these mistakes requires talent to avoid. They require only that the cook respect what
          gumbo is: a slow dish that rewards the patient and politely exposes everyone else.
        </p>
      </div>
    </div>
  </section>
);

const HolyTrinityGuideView: React.FC = () => (
  <section className="pt-24 md:pt-28 pb-12 md:pb-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
      <div>
        <p className="text-mgGold font-black uppercase tracking-[0.35em] text-[11px]">Guide</p>
        <h1 className="text-4xl md:text-6xl font-serif text-[color:var(--primary)]">The Holy Trinity of Cajun Cooking</h1>
        <p className="mt-3 text-[color:var(--text)]">
          Before the roux darkens, before the stock simmers, almost every savory Cajun dish begins the same way:
          onion, bell pepper, and celery, chopped and sweated in fat. This trio is the holy trinity, and
          understanding it means understanding the flavor foundation of the whole cuisine.
        </p>
      </div>
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 space-y-4">
        <h3 className="text-xl font-serif text-[color:var(--primary)]">Three vegetables, one job</h3>
        <p className="text-[color:var(--text)]">
          The trinity is Cajun cooking's answer to the French mirepoix — onion, carrot, and celery — adapted to
          what grew in Louisiana. Carrots, which sweeten a base, gave up their seat to bell pepper, which brings
          a grassy, slightly bitter depth that stands up to cayenne, smoke, and long simmers. The classic working
          ratio is roughly two parts onion to one part bell pepper and one part celery, though plenty of cooks
          go equal parts and nobody is wrong. What matters is the balance of roles: onion for sweetness and body,
          bell pepper for the signature Cajun backbone, celery for a clean, herbal finish that keeps rich dishes
          from tasting flat.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">Why the name — and who the pope is</h3>
        <p className="text-[color:var(--text)]">
          The name is a Louisiana wink at the Catholic heritage of the region: three-in-one, like the doctrine.
          And the tradition has a fourth figure — garlic, so often added to the trio that cooks call it "the
          pope." Green onions and parsley, scattered over finished dishes, round out the supporting cast. Once
          you see the pattern, you see it everywhere: jambalaya starts with the trinity, étouffée starts with
          the trinity, gumbo's trinity goes straight into the roux, and a pot of red beans is unthinkable
          without it.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">Technique: the chop and the sweat</h3>
        <p className="text-[color:var(--text)]">
          Chop the three vegetables to a similar, fairly fine dice so they cook at the same rate and melt into
          the dish rather than announcing themselves as chunks. Then cook them low and slow in fat — oil, butter,
          bacon drippings, or a fresh roux — until the onions go translucent and sweet and the pepper and celery
          surrender their crunch. This step, called sweating, is not browning: you are coaxing out moisture and
          sugars, not searing. Rushing it over high heat leaves the base raw-tasting no matter how long the
          dish simmers afterward. Budget ten unhurried minutes here; it is the cheapest flavor in the whole pot.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">Variations worth knowing</h3>
        <p className="text-[color:var(--text)]">
          Green bell pepper is traditional, but red and yellow peppers sneak sweetness in when a dish wants it,
          and poblano brings a deeper, earthier note some modern cooks love. Celery leaves, too often thrown
          away, are concentrated celery flavor — chop them in with the stalks. If you are cooking for someone
          who swears they hate celery, dice it finer; cooked down in the trinity it disappears as an ingredient
          and remains only as depth. And if your pepper is enormous or your onions are small, trust the ratio by
          volume in the cutting board pile rather than a count of vegetables — the trinity is a proportion, not
          a headcount.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">The freezer trick every Louisiana kitchen knows</h3>
        <p className="text-[color:var(--text)]">
          Trinity freezes beautifully. Chop a big batch, freeze it flat in bags, and weeknight cooking changes:
          a gumbo, a pot of beans, or a shrimp creole can start in the time it takes the vegetables to hit hot
          fat. Many Louisiana grocery stores sell the mix pre-chopped, fresh and frozen, which tells you
          everything about how foundational it is — it is not a garnish or a variation. It is square one.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">How the trinity shifts from dish to dish</h3>
        <p className="text-[color:var(--text)]">
          The trio stays constant; its handling doesn't. In gumbo, the trinity goes into a hot roux and takes on
          that toasted depth — the vegetables nearly dissolve over the long simmer and become body as much as
          flavor. In étouffée, where the sauce is butter-based and the cooking is shorter, the dice is finer and
          the vegetables stay distinct enough to give the finished dish its texture. Jambalaya cooks its trinity
          with the sausage and then the rice in the same pot, so the vegetables season the grains from inside as
          everything steams together. Red beans get their trinity sweated in drippings before the beans and
          ham go in, and by the end of the long cook the vegetables have vanished into the creaminess entirely.
          Same three vegetables, four different jobs — which is exactly why Louisiana cooks treat the trinity as
          a technique to learn once and apply forever, rather than an ingredient line to measure and forget.
        </p>
        <p className="text-[color:var(--text)]">
          One last practical note: prep the trinity before anything else touches heat. Cajun cooking moves in
          stages — roux darkening, meat browning, stock coming up — and several of those stages punish a cook
          who has to stop and chop. A bowl of trinity, cut and waiting beside the stove, is the difference
          between a calm pot and a scorched one. Mise en place sounds French and fancy; in a Louisiana kitchen
          it's just called being ready.
        </p>
      </div>
    </div>
  </section>
);

const CrawfishBoilGuideView: React.FC = () => (
  <section className="pt-24 md:pt-28 pb-12 md:pb-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
      <div>
        <p className="text-mgGold font-black uppercase tracking-[0.35em] text-[11px]">Guide</p>
        <h1 className="text-4xl md:text-6xl font-serif text-[color:var(--primary)]">How a Crawfish Boil Actually Works</h1>
        <p className="mt-3 text-[color:var(--text)]">
          A crawfish boil is part recipe, part social institution: one pot, a table covered in newspaper, and a
          crowd that peels, eats, and argues about seasoning for hours. If you have never run one, here is the
          honest sequence — including the step most of the flavor actually comes from.
        </p>
      </div>
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 space-y-4">
        <h3 className="text-xl font-serif text-[color:var(--primary)]">Start with live crawfish, and purge them</h3>
        <p className="text-[color:var(--text)]">
          Crawfish are bought live, by the sack, during the season that runs roughly from late winter through
          early summer. Before cooking, they get purged: rinsed in clean water, with the water changed until it
          runs reasonably clear, so the mud and grit from the ponds wash out. Keep them cool and damp while they
          wait, never sealed in an airtight container, and cook them the day you buy them. Any that are dead
          before the pot — the ones whose tails stay straight and limp — get tossed, not cooked.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">The pot, the basket, and the seasoned water</h3>
        <p className="text-[color:var(--text)]">
          A boil runs in a big outdoor pot — commonly 60 to 100 quarts — over a propane burner, with a strainer
          basket that lifts the food out of the water. The water is the seasoning delivery system: a generous
          dose of crab boil seasoning (dry, liquid, or both), salt, lemons halved and squeezed in, heads of
          garlic cut in half, and onions. The water should taste aggressively seasoned — saltier and spicier
          than you think it should — because the crawfish spend only a short time in it and carry just a film of
          it into the shell. Season the water like you mean it; you can always serve seasoning on the side, but
          you cannot season a crawfish that has already been peeled.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">The fixings go in by cooking time, not all at once</h3>
        <p className="text-[color:var(--text)]">
          Everything in the pot cooks on its own clock. Small red potatoes and corn on the cob take the longest
          and go in early; smoked sausage joins them; mushrooms and other sturdy additions follow. The crawfish
          themselves go in last, into water at a rolling boil, and they cook fast — a few minutes at the boil is
          all they need before the heat comes off. Overcooked crawfish are rubbery and their tails tear when you
          peel them; timing the additions so everything finishes together is the boil-master's real skill.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">The soak: where the flavor actually happens</h3>
        <p className="text-[color:var(--text)]">
          Here is the step outsiders miss. When the crawfish have had their brief boil, the burner goes off and
          the pot sits — the soak. For the next stretch, commonly fifteen to thirty minutes, the crawfish rest in
          the hot, seasoned water and drink it in as they cool slightly. This soak, far more than the boil
          itself, decides how flavorful and juicy the tails are and how much spice the shells carry to your
          fingers. Some cooks chill the pot's exterior or add ice to stop the cooking while extending the soak.
          However it is managed, do not skip it: a dumped-too-early boil tastes like it was seasoned by rumor.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">The dump, the peel, and the etiquette</h3>
        <p className="text-[color:var(--text)]">
          The basket drains, then the whole boil is dumped straight onto a newspaper- or paper-covered table —
          no plates required, though trays help. Peeling is its own small craft: pinch the tail, twist it from
          the head, peel the first ring or two of shell, and pull the meat out in one piece. Sucking the head,
          where the seasoned fat lives, is traditional and entirely up to you. Pace yourself, keep a drink
          within reach, and know that the second batch out of the pot — seasoned by a soak in water the first
          batch already enriched — is often the best one. That is not an accident. That is the institution
          working as designed.
        </p>
        <h3 className="text-xl font-serif text-[color:var(--primary)]">Leftovers: the boil's second act</h3>
        <p className="text-[color:var(--text)]">
          An experienced boil host cooks more than the table can eat on purpose, because leftover crawfish are
          an ingredient, not a problem. Peeled tails become tomorrow's étouffée, crawfish pie, or a cream sauce
          over pasta; the shells and heads simmer into a rich stock that freezes well and upgrades the next
          pot of gumbo or bisque. Leftover corn and potatoes from the boil — already saturated with seasoning —
          fry up into a breakfast hash that regulars quietly consider the best meal of the whole weekend. Peel
          what you can the same night, refrigerate the tails promptly, and freeze anything you won't use within
          a couple of days. The boil feeds people twice. That, too, is the institution working as designed.
        </p>
        <p className="text-[color:var(--text)]">
          If you're hosting your first boil, borrow confidence from the format itself: one pot, one table,
          paper down, drinks cold, and nowhere for anyone to be but present. The boil forgives beginners
          because its pleasures are structural — hot food, shared work, and time around a table. Get the purge
          right, season the water boldly, respect the soak, and the rest takes care of itself.
        </p>
      </div>
    </div>
  </section>
);

const AboutView: React.FC = () => (
  <section className="pt-24 md:pt-28 pb-12 md:pb-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
      <div>
        <h1 className="text-4xl md:text-6xl font-serif text-[color:var(--primary)]">Our Story</h1>
        <p className="mt-3 text-[color:var(--text)]">
          We're a family-run kitchen bringing the soul of Louisiana to Canton — bold flavors, warm hospitality,
          and a table ready for your next celebration.
        </p>
        <p className="mt-3 text-[color:var(--text)]">
          The Cajun Menu exists for a simple reason: the food we grew up on deserves to be cooked the slow way
          and shared generously. Cajun cooking is working-people's food from the bayous and prairies of
          Louisiana — one-pot, deeply seasoned, built on a roux, the holy trinity of onion, bell pepper, and
          celery, and whatever the season and the water provided. It is not fancy food. It is food with a memory,
          and we cook it that way on purpose.
        </p>
      </div>
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
        <h3 className="text-xl font-serif text-[color:var(--primary)]">Chef Spotlight</h3>
        <p className="mt-2 text-[color:var(--text)]">
          Hand-stirred roux, slow-simmered classics, and modern Cajun flair. Our kitchen treats the roux with
          the respect it demands — stirred constantly, taken to its proper color, never rushed and never walked
          away from — because everything downstream of it, from gumbo to étouffée, is only as good as that
          foundation. From there it is patience: stocks that simmer, beans that take their time, and seasoning
          built in layers instead of dumped in at the end.
        </p>
      </div>
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
        <h3 className="text-xl font-serif text-[color:var(--primary)]">What you'll find here</h3>
        <p className="mt-2 text-[color:var(--text)]">
          This site is the front door to the kitchen. Browse the menu to see what we're serving, use the
          reservations page to book a table, order ahead for pickup or delivery, or talk to us about catering
          when the celebration is yours to host. We also publish guides — how gumbo actually works, what the
          holy trinity is, how a crawfish boil runs — because this food comes with stories and technique worth
          passing on, and because we would rather you understand what you're eating.
        </p>
        <p className="mt-2 text-[color:var(--text)]">
          Whether it's your first bowl of gumbo or your five-hundredth, you're welcome at the table. That's not
          a slogan. In Louisiana, feeding people is how you say everything else.
        </p>
      </div>
    </div>
  </section>
);

const ContactView: React.FC = () => (
  <section className="pt-24 md:pt-28 pb-12 md:pb-16">
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-12 gap-8">
      <div className="md:col-span-6 space-y-4">
        <h1 className="text-4xl md:text-6xl font-serif text-[color:var(--primary)]">Contact & Location</h1>
        <p className="text-[color:var(--text)]">140 Keith Dr, Canton, GA 30114</p>
        <a className="text-[color:var(--accent)]" href="tel:6788997404">(678) 899-7404</a>
        <p className="text-[color:var(--text)]">
          The fastest way to reach us for anything time-sensitive — tonight's reservation, a change to an
          order, a catering date you need held — is by phone. For everything else, the form on this page works
          well: tell us what you need, leave an email we can actually reach, and we'll get back to you.
        </p>
        <p className="text-[color:var(--text)]">
          Planning something bigger? Catering questions are easier with a few details up front: the date, the
          approximate headcount, and whether you're thinking a full crawfish boil, a gumbo-and-fixings spread,
          or something custom. Send what you know; we'll help you figure out the rest.
        </p>
        <p className="text-[color:var(--text)]">
          Found something wrong on this site — a price that doesn't match the menu board, a page that won't
          load, a typo in a guide? Tell us through the form and we'll fix it. Reader corrections keep this site
          honest, and we appreciate every one.
        </p>
        <p className="text-[color:var(--text)]">
          Booking the space or planning a private event? Call the number above and ask about dates — large
          parties and full crawfish boils take a little lead time to do right, and we'd rather plan yours
          properly than squeeze it in. Gift questions, donation requests for local fundraisers, and press
          inquiries can all start with the form as well; just say so in the first line of your message so it
          lands with the right person.
        </p>
      </div>
      <div className="md:col-span-6">
        <form className="space-y-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
          <input placeholder="Name" className="w-full rounded-full border border-[color:var(--border)] px-4 py-3" />
          <input placeholder="Email" className="w-full rounded-full border border-[color:var(--border)] px-4 py-3" />
          <textarea placeholder="Message" className="w-full rounded-2xl border border-[color:var(--border)] px-4 py-3" />
          <button className="h-11 md:h-12 w-full rounded-full emerald-button font-semibold transition">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </section>
);

const AdminView: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [code, setCode] = useState('');
  const adminCode = import.meta.env.VITE_ADMIN_CODE || 'cajunmenu';

  if (!authed) {
    return (
      <section className="pt-24 md:pt-28 pb-12 md:pb-16">
        <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-serif text-[color:var(--primary)]">Admin Access</h1>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Access code"
            className="mt-4 w-full rounded-full border border-[color:var(--border)] px-4 py-3"
          />
          <button
            onClick={() => setAuthed(code === adminCode)}
            className="mt-4 h-11 w-full rounded-full bg-[color:var(--secondary)] text-white font-semibold hover:shadow-[0_0_20px_rgba(178,148,94,0.55)] transition"
          >
            Enter Dashboard
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-6">
        <h1 className="text-4xl font-serif text-[color:var(--primary)]">Analytics Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Traffic Overview', 'Top Pages', 'Devices'].map((label) => (
            <div key={label} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
              {label}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['Referrers', 'Contact Submissions'].map((label) => (
            <div key={label} className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6">
              {label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const BEAD_COLORS = ['purple', 'gold', 'green'];

const HangingBeadLetter: React.FC<{ char: string; index: number }> = ({ char, index }) => {
  if (char === ' ') {
    return <div className="bead-space" aria-hidden="true" />;
  }
  return (
    <div className="bead-strand flex-shrink-0 transform transition-transform duration-500 hover:translate-y-4 cursor-pointer pointer-events-auto">
      <div className="bead-line">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className={`bead-drop bead-${BEAD_COLORS[(index + i) % 3]}`} />
        ))}
      </div>
      <div className={`char-pendant text-mg-${BEAD_COLORS[index % 3]} mt-[-10px]`}>{char}</div>
  </div>
  );
};

const PrivacyView: React.FC = () => (
  <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
    <div className="prose prose-invert max-w-none">
      <p className="text-mgGold font-black uppercase tracking-[0.35em] text-[11px]">Privacy Policy</p>
      <h1 className="text-4xl md:text-6xl font-serif text-white">Privacy and data use</h1>
      <p className="text-white/70 text-lg">
        This policy explains what information The Cajun Menu collects through this website, how we use it, and
        the choices you have. We collect only what is needed to answer reservations, contact requests, and
        catering inquiries, and to understand how the site is used.
      </p>
      <h2 className="text-white font-serif">What we collect</h2>
      <p className="text-white/70">
        When you submit the contact form or a reservation request, we collect the details you provide — your
        name, email address or phone number, and the contents of your message, including reservation notes such
        as party size and date. Like most websites, we also receive standard technical information when you
        visit, such as your browser type, device type, pages viewed, and approximate location derived from your
        IP address, through analytics tooling.
      </p>
      <h2 className="text-white font-serif">How we use it</h2>
      <p className="text-white/70">
        We use the information you send us to respond to you, manage your reservation or catering inquiry, and
        keep business records of those communications. We use aggregate site analytics to see which pages and
        guides are useful and to fix problems. We do not sell personal information, and we do not share it with
        third parties for their own marketing.
      </p>
      <h2 className="text-white font-serif">Cookies and advertising</h2>
      <p className="text-white/70">
        This site may display advertising served by Google AdSense. Google and its partners use cookies and
        similar technologies to serve ads based on your prior visits to this and other websites, and to measure
        how ads perform. Google's use of advertising cookies enables it and its partners to serve ads to you
        based on your visits to this site and/or other sites on the internet. You may opt out of personalized
        advertising by visiting Google Ads Settings (https://www.google.com/settings/ads), and you can opt out
        of cookie use by many third-party vendors at the Digital Advertising Alliance opt-out page
        (https://optout.aboutads.info). You can also block or delete cookies in your browser settings; the site
        will still work, though some features may behave differently. Read more about how Google uses data from
        sites that use its services at https://policies.google.com/technologies/partner-sites.
      </p>
      <h2 className="text-white font-serif">Your choices</h2>
      <p className="text-white/70">
        You may ask us what personal information we hold about you from your form submissions, ask us to
        correct it, or ask us to delete it. Send the request through the contact page or call us at
        (678) 899-7404, and we will respond as required by applicable law. This site is not directed to children
        under 13, and we do not knowingly collect their information.
      </p>
      <h2 className="text-white font-serif">Changes and questions</h2>
      <p className="text-white/70">
        We may update this policy as the site changes; the current version will always be posted on this page.
        Questions about this policy can be sent through the contact page or by phone at (678) 899-7404.
      </p>
    </div>
  </div>
);

const TermsView: React.FC = () => (
  <div className="min-h-screen pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto">
    <div className="prose prose-invert max-w-none">
      <p className="text-mgGold font-black uppercase tracking-[0.35em] text-[11px]">Terms</p>
      <h1 className="text-4xl md:text-6xl font-serif text-white">Terms of use</h1>
      <p className="text-white/70 text-lg">
        This site is provided to share restaurant information, publish cooking guides, accept reservations, and
        support customer communication. By using it, you agree to these terms.
      </p>
      <h2 className="text-white font-serif">Information on this site</h2>
      <p className="text-white/70">
        We work to keep menus, prices, and guides accurate, but menu items, hours, and pricing can change
        without notice, and the menu board at the restaurant controls if anything here disagrees with it.
        Cooking guides are offered for general information and home enjoyment; follow standard food-safety
        practice when cooking, especially with seafood.
      </p>
      <h2 className="text-white font-serif">Acceptable use</h2>
      <p className="text-white/70">
        Do not use the site to submit false reservations, spam, or abusive content, or to interfere with the
        site's operation. We may refuse service or cancel submissions that appear fraudulent or unsafe.
        Reservations made through the site are requests until confirmed by us.
      </p>
      <h2 className="text-white font-serif">Our content</h2>
      <p className="text-white/70">
        The text, guides, and design of this site belong to The Cajun Menu or its contributors. You're welcome
        to link to our pages and quote brief excerpts with credit; republishing whole guides or using the
        site's content commercially requires our permission. Third-party names and trademarks mentioned in
        guides belong to their owners.
      </p>
      <h2 className="text-white font-serif">Liability and changes</h2>
      <p className="text-white/70">
        The site is provided as is, without warranties of any kind, and to the extent allowed by law we are not
        liable for indirect damages arising from its use. We may update these terms from time to time; the
        current version will always be posted on this page, and continuing to use the site after a change means
        you accept the updated terms. Questions about these terms can be sent through the contact page.
      </p>
      <h2 className="text-white font-serif">Reservations, orders, and catering</h2>
      <p className="text-white/70">
        Submitting a reservation, order, or catering inquiry through this site creates a request, not a
        confirmed booking, until we confirm it with you directly. Please give accurate contact information —
        if we cannot reach you to confirm, we may release the table or date. For catering, quoted prices are
        estimates based on the details you provide and are finalized once the menu and headcount are agreed.
      </p>
    </div>
  </div>
);

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const brandPendant = "THE CAJUN MENU";

  return (
    <footer className="relative bg-mgDeep pt-40 pb-20 overflow-hidden min-h-[700px]">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="bead-rig-background">
          {brandPendant.split('').map((char, i) => (
            <HangingBeadLetter key={i} char={char} index={i} />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-mgDeep via-mgDeep/60 to-transparent" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10 h-full flex flex-col">
        <div className="flex justify-center items-center gap-12 mb-28 footer-socials">
          <motion.a whileHover={{ scale: 1.2 }} href="https://www.instagram.com/thecajunmenu" target="_blank" rel="noreferrer" className="social-3d social-instagram"><Instagram size={48} /></motion.a>
          <motion.a whileHover={{ scale: 1.2 }} href="https://www.facebook.com/people/The-Cajun-Menu/61558125637329/" target="_blank" rel="noreferrer" className="social-3d social-facebook"><Facebook size={48} /></motion.a>
          <motion.a whileHover={{ scale: 1.2 }} href="mailto:thecajunmenu@gmail.com" className="social-3d social-mail"><Mail size={48} /></motion.a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24 items-start border-t border-white/10 pt-24 mb-20">
          <div className="space-y-10">
            <h4 className="font-display italic text-3xl text-mgGold mb-6 text-left">Service Hours</h4>
            <div className="space-y-6 font-oswald tracking-widest text-sm uppercase">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Sunday</span>
                <span className="text-white">12:00 — 17:00</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Monday</span>
                <span className="text-white">Closed</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Tuesday</span>
                <span className="text-white">Closed</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Wednesday — Thursday</span>
                <span className="text-white">11:00 — 20:00</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-white/50">Friday — Saturday</span>
                <span className="text-white">11:00 — 20:00</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h4 className="font-display italic text-3xl text-mgGold mb-10 text-center">Our Location</h4>
            <div className="w-full h-80 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl transition-all hover:border-mgGold/40 group">
              <iframe
                src="https://www.google.com/maps?q=140+Keith+Dr,+Canton,+GA+30114&output=embed&t=k"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                className="transition-all duration-700"
              />
            </div>
            <p className="mt-8 text-center text-white/50 font-medium tracking-widest text-xs uppercase flex items-center justify-center gap-3">
              <MapPin size={18} className="text-mgGold" /> 140 Keith Dr, Canton, GA 30114
            </p>
          </div>

          <div className="flex flex-col lg:items-end lg:text-right space-y-10">
            <h4 className="font-display italic text-3xl text-mgGold mb-6">Stay Connected</h4>
            <div className="space-y-8">
              <div>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.4em] block mb-2 font-black">Catering & Parties</span>
                <a href="tel:6788997404" className="text-3xl font-oswald text-white hover:text-mgGreen transition-colors flex items-center lg:justify-end gap-4">
                  (678) 899-7404 <Phone size={22} className="text-mgGreen" />
                </a>
              </div>
              <div>
                <span className="text-[10px] text-white/30 uppercase tracking-[0.4em] block mb-2 font-black">General Inquiry</span>
                <a href="mailto:thecajunmenu@gmail.com" className="text-3xl font-oswald text-white hover:text-mgGreen transition-colors flex items-center lg:justify-end gap-4">
                  thecajunmenu@gmail.com <Mail size={22} className="text-mgGreen" />
                </a>
              </div>
              <button
                onClick={() => navigate('/contact')}
                className="mt-6 px-12 py-5 bg-white text-mgDeep font-black rounded-full text-[11px] tracking-[0.4em] uppercase hover:bg-mgGold hover:text-white transition-all shadow-xl light-cta"
              >
                SEND A MESSAGE
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.6em] text-white/10 pt-12 border-t border-white/5">
          <span>© 2026 THE CAJUN MENU • LOUISIANA TRADITION</span>
          <div className="flex gap-12">
            <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const AppShell = () => {
  useEffect(() => {
    const scripts = [
      'https://fast.wistia.com/player.js',
      'https://fast.wistia.com/embed/14ushhwlms.js',
    ];
    scripts.forEach((src) => {
      if (!document.querySelector(`script[src="${src}"]`)) {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        if (src.includes('/embed/')) s.type = 'module';
        document.body.appendChild(s);
      }
    });
  }, []);

  return (
    <div className="text-[color:var(--text)]">
      <Header />
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/menu" element={<MenuView />} />
          <Route path="/reservations" element={<ReservationsView />} />
          <Route path="/order" element={<OrderView />} />
          <Route path="/catering" element={<CateringView />} />
          <Route path="/guides/gumbo" element={<GumboGuideView />} />
          <Route path="/guides/holy-trinity" element={<HolyTrinityGuideView />} />
          <Route path="/guides/crawfish-boil" element={<CrawfishBoilGuideView />} />
          <Route path="/about" element={<AboutView />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/privacy" element={<PrivacyView />} />
          <Route path="/terms" element={<TermsView />} />
          <Route path="/admin" element={<AdminView />} />
        </Routes>
      </AnimatePresence>
      <React.Suspense fallback={null}>
        <GatorBobWidget />
      </React.Suspense>
      <Footer />
    </div>
  );
};

const App = () => (
  <BrowserRouter>
    <ErrorBoundary>
      <AppShell />
    </ErrorBoundary>
  </BrowserRouter>
);

export default App;
