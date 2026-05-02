
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle,
  Send,
} from 'lucide-react';
import { MENU_ITEMS, MENU_CATEGORIES } from '../data/menu';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Menu', href: '/menu' },
  { label: 'Reservations', href: '#reservations' },
  { label: 'About', href: '#about' },
  { label: 'Planner', href: '/planner' },
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi there! Ask me about hours, reservations, or today’s specials.',
    },
  ]);
  const containerRef = useRef(null);

  const faq = [
    {
      q: 'hours',
      a: 'We are open Wed–Sat 11a–8p and Sun 12p–5p. Mon–Tue closed.',
    },
    {
      q: 'reservation',
      a: 'You can reserve by calling 678-899-7404 or using the “Make a reservation” button on the page.',
    },
    { q: 'address', a: 'Find us at 140 Keith Dr, Canton, GA 30114.' },
    {
      q: 'special',
      a: 'Today’s pick: Cajun Crab Boil + Beignets combo. Ask for the Mardi Gras special.',
    },
  ];

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setInput('');

    const match =
      faq.find((item) => userText.toLowerCase().includes(item.q)) ||
      faq.find((item) => item.q === 'special');

    const reply = match
      ? match.a
      : "I'm here to help with hours, reservations, catering, or menu suggestions!";
    setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[120]">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 rounded-full bg-mardiGold px-5 py-3 font-black uppercase tracking-wide text-mardiPurple shadow-2xl hover:shadow-[0_10px_30px_rgba(255,215,0,0.5)] transition-transform hover:-translate-y-0.5"
      >
        <MessageCircle size={18} />
        Chat with us
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-4 w-[320px] overflow-hidden rounded-2xl border border-white/10 bg-[#0c1122] shadow-2xl glass"
          >
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-mardiGold">
                  Instant help
                </p>
                <p className="text-white/70 text-sm">The Cajun Menu Concierge</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <X size={16} />
              </button>
            </div>

            <div
              ref={containerRef}
              className="max-h-80 space-y-3 overflow-y-auto p-4 text-sm text-white/80"
            >
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.sender === 'bot' ? 'justify-start' : 'justify-end'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.sender === 'bot'
                        ? 'bg-white/10 text-white'
                        : 'bg-mardiGold text-mardiPurple font-semibold'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-white/5 bg-black/20 px-3 py-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask a question..."
                className="flex-1 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-mardiGold/70"
              />
              <button
                type="button"
                onClick={handleSend}
                className="rounded-full bg-mardiGreen p-2 text-white hover:bg-mardiGold hover:text-mardiPurple transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const createMardiGrasEffect = () => {
    const colors = ['#00ff41', '#ff00ff', '#ffd700'];
    const btn = document.getElementById('mobileToggle');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const container = document.body;

    for (let i = 0; i < 30; i += 1) {
      const bead = document.createElement('div');
      bead.className = 'bead';
      bead.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      const tx = (Math.random() - 0.5) * 400;
      const ty = Math.random() * 600;
      bead.style.left = `${centerX}px`;
      bead.style.top = `${centerY}px`;
      bead.style.setProperty('--tx', `${tx}px`);
      bead.style.setProperty('--ty', `${ty}px`);
      bead.style.animation = `dropExplosion ${1 + Math.random()}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
      container.appendChild(bead);
      setTimeout(() => bead.remove(), 2000);
    }

    for (let i = 0; i < 20; i += 1) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      const tx = (Math.random() - 0.5) * 300;
      const ty = Math.random() * 400;
      confetti.style.left = `${centerX}px`;
      confetti.style.top = `${centerY}px`;
      confetti.style.setProperty('--tx', `${tx}px`);
      confetti.style.setProperty('--ty', `${ty}px`);
      confetti.style.animation = `dropExplosion ${0.5 + Math.random()}s linear forwards`;
      container.appendChild(confetti);
      setTimeout(() => confetti.remove(), 1500);
    }
  };

  return (
    <nav className="crescent-royale-nav-container fixed top-0 w-full">
      <div className="crescent-pattern" />
      <div className="crescent-nav-content">
        <div className="crescent-logo">
          <wistia-player
            media-id="ip3tp5t9me"
            class="logo-wistia"
            aspect="1.0"
            muted
            autoplay
            loop
            playsinline
          />
          <span>The Cajun Menu</span>
        </div>

        <ul className="crescent-nav-links">
          {NAV_LINKS.map((item) => (
            <li key={item.label}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
          <li>
            <a
              href="#menu"
              className="mardi-press px-4 py-2 rounded-full border border-white/30 bg-white/10 text-white font-bold text-xs tracking-[0.2em]"
            >
              Order Online
            </a>
          </li>
        </ul>

        <button
          type="button"
          id="mobileToggle"
          aria-label="Toggle menu"
          className={`fleur-toggle md:hidden ${isOpen ? 'active' : ''}`}
          onClick={() => {
            const next = !isOpen;
            setIsOpen(next);
            if (next) createMardiGrasEffect();
          }}
        />
      </div>

      <div className={`mobile-menu ${isOpen ? 'active' : ''}`}>
        <div className="menu-pattern" />
        {NAV_LINKS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="mobile-link"
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <a
          href="#menu"
          className="mobile-link text-mardiGold"
          onClick={() => setIsOpen(false)}
        >
          Order Online
        </a>
      </div>
    </nav>
  );
};

const DishCard = ({ item }) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-mardiGold/50 hover:shadow-[0_20px_60px_rgba(106,27,154,0.35)]"
  >
    <div className="relative mb-6 h-64 w-full overflow-hidden rounded-2xl">
      {item.image ? (
        <motion.img
          whileHover={{ scale: 1.12, rotate: 2, y: -8 }}
          src={item.image}
          alt={item.name}
          loading="lazy"
          className="h-full w-full rounded-2xl object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-mardiPurple to-mardiBlue">
          <span className="text-4xl font-black uppercase tracking-tight text-white/30">
            Delicious
          </span>
        </div>
      )}
      <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-mardiGold px-4 py-1 font-black text-mardiPurple shadow-lg">
        {item.price}
      </div>
    </div>

    <h3 className="mb-2 font-serif text-2xl font-black leading-tight text-white">
      {item.name}
    </h3>
    <p className="mb-4 text-sm leading-relaxed text-white/70">{item.description}</p>

    <div className="flex items-center justify-between">
      <span className="text-xs font-bold uppercase tracking-[0.2em] text-mardiGold">
        {item.category}
      </span>
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-mardiGold hover:text-mardiPurple"
      >
        <ArrowRight size={20} />
      </button>
    </div>

    <div className="absolute -left-3 -bottom-3 h-16 w-16 rounded-full bg-gradient-to-tr from-mardiGreen to-transparent opacity-20 blur-2xl transition-opacity group-hover:opacity-40" />
    <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-gradient-to-bl from-mardiPurple to-transparent opacity-20 blur-2xl transition-opacity group-hover:opacity-40" />
  </motion.div>
);
const MenuCarousel = ({ activeCategory, onSelect }) => {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    if (containerRef.current) {
      const amount = direction === 'left' ? -220 : 220;
      containerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-12 w-full py-6">
      <div className="absolute inset-y-0 left-0 z-10 flex items-center">
        <button
          type="button"
          onClick={() => scroll('left')}
          className=" -ml-4 rounded-full border border-white/20 bg-mardiPurple p-2 text-white shadow-xl transition-all hover:bg-mardiGold hover:text-mardiPurple"
        >
          <ChevronLeft />
        </button>
      </div>

      <div
        ref={containerRef}
        className="no-scrollbar flex gap-4 overflow-x-auto px-10 pb-4"
      >
        {MENU_CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`menu-filter-btn flex-shrink-0 snap-center rounded-full border-2 px-8 py-3 text-sm font-black uppercase tracking-[0.25em] transition-all duration-300 ${
              activeCategory === cat ? 'is-active' : ''
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="absolute inset-y-0 right-0 z-10 flex items-center">
        <button
          type="button"
          onClick={() => scroll('right')}
          className="-mr-4 rounded-full border border-white/20 bg-mardiPurple p-2 text-white shadow-xl transition-all hover:bg-mardiGold hover:text-mardiPurple"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

const buildParticles = () =>
  Array.from({ length: 18 }).map((_, idx) => ({
    id: idx,
    size: Math.floor(Math.random() * 4) + 1,
    startY: Math.random() * 900,
    endY: Math.random() * -120,
    startX: Math.random() * 100,
    endX: Math.random() * -80 + 40,
    duration: 12 + Math.random() * 20,
    left: Math.random() * 100,
  }));

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState(MENU_CATEGORIES[0]);
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  const filteredItems = MENU_ITEMS.filter((item) => item.category === selectedCategory);
  const signatureDishes = MENU_ITEMS.filter((item) => item.isSignature);
  const [particles] = useState(buildParticles);

  useEffect(() => {
    document.title = 'The Cajun Menu | Mardi Gras Culinary Experience in Canton, GA';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Taste the Cajun in Canton, GA. Bold Louisiana flavors, fresh seafood, and Mardi Gras energy — dine in, pick up, or reserve your celebration.',
      );
    }

    // Load Wistia scripts once for hero background player
    const playerScriptSrc = 'https://fast.wistia.com/player.js';
    const heroEmbedSrc = 'https://fast.wistia.com/embed/vstx0wwv4f.js';
    const logoEmbedSrc = 'https://fast.wistia.com/embed/ip3tp5t9me.js';
    const storyEmbedSrc = 'https://fast.wistia.com/embed/vlzs2j8r43.js';

    if (!document.querySelector(`script[src="${playerScriptSrc}"]`)) {
      const s = document.createElement('script');
      s.src = playerScriptSrc;
      s.async = true;
      document.body.appendChild(s);
    }

    if (!document.querySelector(`script[src="${heroEmbedSrc}"]`)) {
      const s2 = document.createElement('script');
      s2.src = heroEmbedSrc;
      s2.type = 'module';
      s2.async = true;
      document.body.appendChild(s2);
    }

    if (!document.querySelector(`script[src="${logoEmbedSrc}"]`)) {
      const s3 = document.createElement('script');
      s3.src = logoEmbedSrc;
      s2.type = 'module';
      s3.async = true;
      document.body.appendChild(s3);
    }

    if (!document.querySelector(`script[src="${storyEmbedSrc}"]`)) {
      const s4 = document.createElement('script');
      s4.src = storyEmbedSrc;
      s4.type = 'module';
      s4.async = true;
      document.body.appendChild(s4);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#080d1b] text-white selection:bg-mardiGold selection:text-mardiPurple">
      <Navbar />
      <ChatBot />

      <section
        id="home"
        className="relative flex min-h-screen items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0">
          <wistia-player
            media-id="vstx0wwv4f"
            class="hero-wistia"
            aspect="1.0"
            muted
            autoplay
            loop
            playsinline
          />

          <style>
            {`wistia-player[media-id='vstx0wwv4f']:not(:defined) {
                background: center / cover no-repeat url('https://fast.wistia.com/embed/medias/vstx0wwv4f/swatch');
                display: block;
                width: 100%;
                height: 100%;
                filter: blur(5px);
              }`}
          </style>

          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-[#080d1b]" />

          <div className="pointer-events-none absolute inset-0 opacity-30">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                initial={{ opacity: 0, y: particle.startY }}
                animate={{
                  opacity: [0.1, 0.45, 0.1],
                  y: [particle.startY, particle.endY],
                  x: [particle.startX, particle.endX],
                }}
                transition={{ duration: particle.duration, repeat: Infinity }}
                className="absolute rounded-full bg-mardiGold"
                style={{
                  width: `${particle.size * 4}px`,
                  height: `${particle.size * 4}px`,
                  left: `${particle.left}%`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-20 text-center px-6 py-12">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-mardiGold backdrop-blur"
          >
            Flavor of Louisiana
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-white/80"
          >
            Bold Cajun dishes, soulful seafood boils, and the spirit of Mardi Gras—right here in Canton.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8 flex flex-wrap justify-center gap-4"
          >
            <a
              href="/menu"
              className="mardi-press rounded-full bg-mardiGold px-8 py-4 text-sm font-black uppercase tracking-[0.25em] text-mardiPurple shadow-xl hover:text-mardiPurple"
            >
              View Menu
            </a>
            <a
              href="#reservations"
              className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-black uppercase tracking-[0.25em] text-white hover:bg-white hover:text-mardiPurple transition-colors"
            >
              Book a Table
            </a>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#0a0f1d] py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 flex flex-col items-end justify-between gap-6 md:flex-row">
            <div className="max-w-xl">
              <motion.h2
                initial={{ x: -100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                className="mb-6 font-serif text-4xl font-black uppercase leading-tight md:text-6xl"
              >
                Our{' '}
                <span className="text-mardiGold italic underline decoration-mardiPurple underline-offset-8">
                  Signature
                </span>{' '}
                Creations
              </motion.h2>
              <p className="text-lg text-white/70">
                Traditional Louisiana recipes with a modern Mardi Gras energy. Zesty,
                soulful, unforgettable.
              </p>
            </div>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              <a
                href="#menu"
                className="group flex items-center gap-3 border-b-2 border-mardiGold/40 pb-2 text-sm font-bold uppercase tracking-[0.25em] text-mardiGold transition-all hover:border-mardiGold"
              >
                See Full Menu{' '}
                <ChevronRight className="transition-transform group-hover:translate-x-2" />
              </a>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {signatureDishes.slice(0, 8).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <DishCard item={item} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <section id="menu" className="relative border-t border-white/5 bg-[#0f172a] py-24">
        <div className="container mx-auto px-6">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="mb-4 font-serif text-5xl font-black uppercase md:text-7xl"
            >
              Explore <span className="text-mardiGreen">the Flavors</span>
            </motion.h2>
            <div className="mx-auto mb-6 h-1 w-24 bg-mardiGold" />
          </div>

          <MenuCarousel activeCategory={selectedCategory} onSelect={setSelectedCategory} />

          <motion.div
            key={selectedCategory}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-mardiGold/50"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h4 className="text-2xl font-bold text-white group-hover:text-mardiGold transition-colors">
                    {item.name}
                  </h4>
                  <span className="text-xl font-black text-mardiGold">{item.price}</span>
                </div>
                <p className="mb-6 italic leading-relaxed text-white/65">
                  “{item.description}”
                </p>
                <button
                  type="button"
                  className="mardi-press flex items-center gap-2 text-xs font-black uppercase tracking-[0.25em] text-mardiGreen"
                >
                  Add to Order <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        id="about"
        className="relative overflow-hidden bg-[#0a0f1d] py-24"
      >
        <div className="container mx-auto grid items-center gap-16 px-6 md:grid-cols-2">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div style={{ scale }} className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl">
              <wistia-player
                media-id="vlzs2j8r43"
                class="story-wistia"
                aspect="0.5625"
                muted
                autoplay
                loop
                playsinline
              />
              <style>
                {`wistia-player[media-id='vlzs2j8r43']:not(:defined) {
                    background: center / cover no-repeat url('https://fast.wistia.com/embed/medias/vlzs2j8r43/swatch');
                    display: block;
                    width: 100%;
                    padding-top: 56.25%;
                    filter: blur(5px);
                  }`}
              </style>
              <div className="absolute inset-0 mix-blend-overlay bg-mardiPurple/20" />
            </motion.div>
            <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-mardiGold opacity-30 blur-[90px]" />
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-mardiPurple opacity-30 blur-[90px]" />
            <div className="absolute -right-12 top-1/2 -translate-y-1/2 rounded-2xl border border-white/20 bg-white/5 p-4 shadow-2xl backdrop-blur-xl">
              <div className="text-center">
                <p className="text-3xl font-black text-mardiGold">48 hr</p>
                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/70">
                  Bean marinade
                </p>
              </div>
            </div>
          </motion.div>

          <div>
            <motion.h3
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="mb-6 text-sm font-black uppercase tracking-[0.3em] text-mardiGold"
            >
              Our Story
            </motion.h3>
            <motion.h2
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-8 font-serif text-4xl font-black uppercase leading-tight md:text-6xl"
            >
              Get Your <span className="italic text-mardiPurple">Cajun Fix</span> Fast
            </motion.h2>
            <motion.p
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mb-10 text-lg leading-relaxed text-white/70"
            >
              Order online for quick pickup or delivery, or join us in Canton for
              gumbo, po-boys, and seafood boils cooked the Louisiana way.
            </motion.p>
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mb-10 grid grid-cols-2 gap-8"
            >
              <div className="flex flex-col gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mardiGold/10 text-mardiGold">
                  <Clock size={24} />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                  Fast Service
                </h4>
                <p className="text-xs text-white/60">Fresh to your door or ready for pickup.</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-mardiGreen/10 text-mardiGreen">
                  <MapPin size={24} />
                </div>
                <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-white">
                  Local Taste
                </h4>
                <p className="text-xs text-white/60">Louisiana heart, Canton home.</p>
              </div>
            </motion.div>

            <a
              href="#menu"
              className="rounded-full bg-mardiGreen px-12 py-5 font-black uppercase tracking-[0.25em] text-white shadow-xl transition-all hover:-translate-y-0.5 hover:bg-mardiPurple hover:shadow-[0_10px_30px_rgba(46,125,50,0.4)]"
            >
              Order Online Now
            </a>
          </div>
        </div>
      </section>

      <section
        id="reservations"
        className="relative overflow-hidden bg-mardiPurple py-24"
      >
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 L100,0 L100,100 L0,100 Z" fill="url(#grid)" />
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
          </svg>
        </div>

        <div className="container relative z-10 mx-auto px-6">
          <div className="glass rounded-[3rem] border border-white/20 p-10 text-center shadow-2xl md:p-20">
            <motion.div initial={{ scale: 0.85, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}>
              <div className="mb-8 inline-flex items-center gap-4 rounded-full bg-mardiGold px-6 py-2 text-sm font-black uppercase tracking-[0.2em] text-mardiPurple shadow-xl">
                <Calendar size={18} /> Next Event: Feb 17, 2026
              </div>
              <h2 className="mb-8 font-serif text-5xl font-black uppercase text-white md:text-8xl">
                Make a <span className="text-mardiGold">Reservation</span>
              </h2>
              <p className="mx-auto mb-12 max-w-2xl text-xl text-white/85">
                Celebrations, date nights, team dinners — let’s make it unforgettable.
                Call, reserve online, or chat with us.
              </p>

            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="tel:16788997404"
                className="mardi-press rounded-full bg-white px-12 py-5 text-sm font-black uppercase tracking-[0.25em] text-mardiPurple shadow-2xl"
              >
                Call Us
              </a>
              <a
                href="mailto:thecajunmenu@gmail.com?subject=Reservation%20Request"
                className="mardi-press rounded-full border-2 border-white/30 px-12 py-5 text-sm font-black uppercase tracking-[0.25em] text-white"
              >
                Email Team
              </a>
            </div>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-[#050811] pb-12 pt-24">
        <div className="container mx-auto px-6">
          <div className="mb-20 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-8 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-mardiGold text-2xl font-bold text-mardiPurple">
                  C
                </div>
                <span className="font-serif text-2xl font-black italic uppercase tracking-tight text-white">
                  The Cajun <span className="text-mardiGold">Menu</span>
                </span>
              </div>
              <p className="mb-8 leading-relaxed text-white/55">
                Bold, authentic New Orleans spirit in Canton. Join us for seafood boils,
                po-boys, and Mardi Gras vibes all year long.
              </p>
              <div className="flex gap-4">
                {[Instagram, Facebook, Twitter].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all hover:bg-mardiGold hover:text-mardiPurple"
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-8 border-l-4 border-mardiGold pl-4 text-sm font-black uppercase tracking-[0.2em] text-white">
                Visit Us
              </h4>
              <ul className="space-y-4 text-white/75">
                <li className="flex gap-4">
                  <MapPin className="flex-shrink-0 text-mardiGold" size={20} />
                  <span>140 Keith Dr, Canton, GA 30114</span>
                </li>
                <li className="flex gap-4">
                  <Phone className="flex-shrink-0 text-mardiGreen" size={20} />
                  <span>678-899-7404</span>
                </li>
                <li className="flex gap-4">
                  <Mail className="flex-shrink-0 text-mardiBlue" size={20} />
                  <span>thecajunmenu@gmail.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-8 border-l-4 border-mardiPurple pl-4 text-sm font-black uppercase tracking-[0.2em] text-white">
                Hours
              </h4>
              <ul className="space-y-4 text-white/75">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Sun:</span>
                  <span className="font-bold text-mardiGold">12p – 5p</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Mon – Tue:</span>
                  <span className="text-xs font-bold uppercase text-white/30">Closed</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span>Wed – Thu:</span>
                  <span>11a – 8p</span>
                </li>
                <li className="flex justify-between">
                  <span>Fri – Sat:</span>
                  <span>11a – 8p</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-8 border-l-4 border-mardiGreen pl-4 text-sm font-black uppercase tracking-[0.2em] text-white">
                Newsletter
              </h4>
              <p className="mb-4 text-xs text-white/60">
                Get Mardi Gras news, crawfish boil drops, and VIP tastings.
              </p>
              <form
                className="relative"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert('Thanks for subscribing!');
                }}
              >
                <input
                  type="email"
                  required
                  placeholder="Your email"
                  className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-mardiGold/60"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 rounded-full bg-mardiGold px-6 text-xs font-black uppercase tracking-[0.25em] text-mardiPurple transition-all hover:bg-white"
                >
                  Join
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-12 text-[10px] font-bold uppercase tracking-[0.2em] text-white/35 md:flex-row">
            <p>© 2026 The Cajun Menu. All rights reserved.</p>
            <div className="flex gap-8">
              <a className="hover:text-mardiGold" href="#">
                Privacy
              </a>
              <a className="hover:text-mardiGold" href="#">
                Terms
              </a>
              <a className="hover:text-mardiGold" href="#">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
