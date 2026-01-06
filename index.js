/* Smooth scroll */
function goto(id) { document.querySelector(id).scrollIntoView({ behavior: 'smooth' }) }

/* Theme switcher + persistence */
const root = document.documentElement;
const themeSelect = document.getElementById('themeSelect');
const themes = ['indigo-lime', 'purple-gold', 'ocean-coral', 'forest-cream'];
function applyTheme(t) {
    if (!themes.includes(t)) t = themes[0];
    root.setAttribute('data-theme', t);
    if (themeSelect) themeSelect.value = t;
    localStorage.setItem('educhess-theme', t);
}
applyTheme(localStorage.getItem('educhess-theme') || themes[0]);
themeSelect.addEventListener('change', e => applyTheme(e.target.value));
document.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 't') {
        const cur = root.getAttribute('data-theme') || themes[0];
        const i = (themes.indexOf(cur) + 1) % themes.length;
        applyTheme(themes[i]);
    }
    if (e.key.toLowerCase() === 'g') goto('#gallery');
    if (e.key.toLowerCase() === 'h') goto('#top');
});

/* Hero parallax: tilt by mouse */
window.addEventListener('mousemove', e => {
    const hero = document.querySelector('.hero'); const rect = hero.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) - .5, cy = ((e.clientY - rect.top) / rect.height) - .5;
    hero.style.transform = `perspective(900px) rotateY(${cx * 4}deg) rotateX(${-cy * 3}deg)`;
});

/* Magnetic hover for buttons/logo */
function makeMagnetic(el, strength = 12) {
    el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) / r.width;
        const y = (e.clientY - (r.top + r.height / 2)) / r.height;
        el.style.transform = `translate(${x * strength}px,${y * strength}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = '' });
}
document.querySelectorAll('.magnetic').forEach(el => makeMagnetic(el));

/* Ripple effects */
document.querySelectorAll('[data-ripple]').forEach(btn => {
    btn.addEventListener('click', function (e) {
        const r = document.createElement('span'); r.className = 'ripple';
        const rect = this.getBoundingClientRect(); const size = Math.max(rect.width, rect.height);
        r.style.width = r.style.height = size + 'px';
        r.style.left = (e.clientX - rect.left - size / 2) + 'px';
        r.style.top = (e.clientY - rect.top - size / 2) + 'px';
        this.appendChild(r); setTimeout(() => r.remove(), 600);
    });
});

/* Entrance reveals + stagger */
const reveals = [...document.querySelectorAll('.reveal')];
const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('show');
            if (e.target.classList.contains('stagger')) {
                [...e.target.querySelectorAll('.card,.grid > *')].forEach((child, i) => {
                    child.style.transitionDelay = i * 90 + 'ms';
                    requestAnimationFrame(() => { child.classList.add('show'); child.style.opacity = 1; child.style.transform = 'none'; });
                });
            }
            io.unobserve(e.target);
        }
    });
}, { threshold: .15 });
reveals.forEach(el => io.observe(el));

/* Animated counters */
function animateCounter(el) {
    const to = +el.dataset.to || 0, dur = 1200, start = performance.now();
    function step(ts) { const p = Math.min(1, (ts - start) / dur); el.textContent = Math.round(to * p); if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
}
document.querySelectorAll('.counter').forEach(c => {
    const o = new IntersectionObserver(es => {
        es.forEach(en => { if (en.isIntersecting) { animateCounter(c); o.unobserve(c); } })
    }, { threshold: .6 });
    o.observe(c);
});

/* Pricing toggle */
const toggle = document.getElementById('priceToggle');
toggle.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
        toggle.querySelectorAll('button').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false') });
        btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
        const mode = btn.dataset.mode; document.querySelectorAll('.price').forEach(p => p.textContent = p.dataset[mode]);
    });
});

/* In‑person location logic */
// const modeSelect = document.getElementById('modeSelect');
// const serviceType = document.getElementById('serviceType');
// const locationSelect = document.getElementById('locationSelect');
// function updateLocationVisibility() {
//     const inperson = modeSelect.value === 'inperson' || serviceType.value.includes('Offline');
//     locationSelect.style.display = inperson ? 'block' : 'none';
// }
// modeSelect.addEventListener('change', updateLocationVisibility);
// serviceType.addEventListener('change', updateLocationVisibility);
// updateLocationVisibility();

/* Gallery filters */
const filterBtns = document.querySelectorAll('.filter-btn');
const gallery = document.getElementById('galleryGrid');
filterBtns.forEach(b => b.addEventListener('click', () => {
    filterBtns.forEach(x => x.classList.remove('active'));
    b.classList.add('active'); const f = b.dataset.filter;
    gallery.querySelectorAll('img').forEach(img => { img.style.display = (f === 'all' || img.dataset.cat === f) ? 'block' : 'none'; });
}));

/* Lightbox + keyboard nav */
const lb = document.getElementById('lightbox'); const lbImg = lb.querySelector('img');
const imgs = [...document.querySelectorAll('#galleryGrid img')]; let curr = 0;
function openLightbox(i) { curr = i; lbImg.src = imgs[i].src; lb.style.display = 'flex'; }
function hideLightbox() { lb.style.display = 'none' }
imgs.forEach((img, i) => img.addEventListener('click', () => openLightbox(i)));
lb.addEventListener('click', e => { if (e.target === lb) hideLightbox() });
document.addEventListener('keydown', e => {
    if (lb.style.display === 'flex') {
        if (e.key === 'Escape') hideLightbox();
        if (e.key === 'ArrowRight') { curr = (curr + 1) % imgs.length; lbImg.src = imgs[curr].src }
        if (e.key === 'ArrowLeft') { curr = (curr - 1 + imgs.length) % imgs.length; lbImg.src = imgs[curr].src }
    }
});

/* Header glow on scroll */
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.style.boxShadow = window.scrollY > 16 ? '0 0 18px rgba(0,227,168,.35)' : 'none';
});


const chatContainer = document.getElementById("chat-container");
    const chatToggle = document.getElementById("chat-toggle");
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");

    chatToggle.addEventListener("click", () => {
      chatContainer.classList.toggle("active");
    });

    const botReplies = (msg) => {
      msg = msg.toLowerCase();

      if (msg.includes("hello") || msg.includes("hi")) return "Hey there! 👋";
      if (msg.includes("how are you")) return "I'm just a bot, but I'm doing great 😄";
      if (msg.includes("your name")) return "I'm your friendly website chatbot 🤖";
      if (msg.includes("price") || msg.includes("cost")) return "Our prices start from ₹499 only 💰";
      if (msg.includes("help")) return "Sure! Please tell me what kind of help you need 💡";
      if (msg.includes("bye")) return "Goodbye! Have a great day 😊";
      return "Sorry, I didn't understand that 😅. Try asking something else!";
    };

    function sendMessage() {
      const msg = userInput.value.trim();
      if (!msg) return;

      const userMsg = document.createElement("div");
      userMsg.classList.add("message", "user-message");
      userMsg.innerText = msg;
      chatBox.appendChild(userMsg);
      chatBox.scrollTop = chatBox.scrollHeight;
      userInput.value = "";

      const typing = document.createElement("div");
      typing.classList.add("message", "bot-message");
      typing.innerHTML = "<span class='typing'>Bot is typing...</span>";
      chatBox.appendChild(typing);
      chatBox.scrollTop = chatBox.scrollHeight;

      setTimeout(() => {
        typing.remove();
        const botMsg = document.createElement("div");
        botMsg.classList.add("message", "bot-message");
        botMsg.innerText = botReplies(msg);
        chatBox.appendChild(botMsg);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 800);
    }

    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });



     // Accordion behaviour: single-open, smooth animation and accessibility
  (function(){
    const accordion = document.getElementById('faqAccordion');
    const items = Array.from(accordion.querySelectorAll('.faq-item'));

    // Helper to open an item (animates height)
    function openItem(item){
      const answer = item.querySelector('.faq-answer');
      const body = answer.querySelector('.faq-body');

      // set aria states
      item.classList.add('open');
      answer.setAttribute('aria-hidden','false');
      item.querySelector('.faq-question').setAttribute('aria-expanded','true');

      // calculate and set max-height to allow smooth transition
      answer.style.maxHeight = body.scrollHeight + 24 + 'px'; // extra padding allowance
    }

    // Helper to close an item
    function closeItem(item){
      const answer = item.querySelector('.faq-answer');
      const button = item.querySelector('.faq-question');

      // remove open class so visuals change
      item.classList.remove('open');
      button.setAttribute('aria-expanded','false');
      answer.setAttribute('aria-hidden','true');

      // collapse with transition by setting maxHeight to 0
      answer.style.maxHeight = 0;
    }

    // Close all items
    function closeAll(){
      items.forEach(i => {
        closeItem(i);
      });
    }

    // Init: ensure max-height of opened item(s) set correctly
    items.forEach(i => {
      const answer = i.querySelector('.faq-answer');
      const body = answer.querySelector('.faq-body');
      if (i.classList.contains('open')){
        // set to content height
        answer.style.maxHeight = body.scrollHeight + 24 + 'px';
        answer.setAttribute('aria-hidden','false');
        i.querySelector('.faq-question').setAttribute('aria-expanded','true');
      } else {
        answer.style.maxHeight = 0;
        answer.setAttribute('aria-hidden','true');
        i.querySelector('.faq-question').setAttribute('aria-expanded','false');
      }
    });

    // Click handlers (only one open at a time)
    items.forEach(item => {
      const btn = item.querySelector('.faq-question');

      btn.addEventListener('click', (e) => {
        const isOpen = item.classList.contains('open');

        // close all first (single-open behavior)
        closeAll();

        if (!isOpen){
          openItem(item);
        } else {
          closeItem(item);
        }

        // optional: smooth scroll to keep the button in view on small screens
        const topOffset = item.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      });

      // keyboard support (Enter/Space)
      btn.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          btn.click();
        }
      });
    });

    // Recompute heights on window resize (in case text wraps)
    window.addEventListener('resize', () => {
      items.forEach(i => {
        const answer = i.querySelector('.faq-answer');
        const body = answer.querySelector('.faq-body');
        if (i.classList.contains('open')){
          answer.style.maxHeight = body.scrollHeight + 24 + 'px';
        } else {
          answer.style.maxHeight = 0;
        }
      });
    });
  })();



  // reviews

const slides = document.querySelectorAll('.testimonial-slide');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
let current = 0;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  slides[index].classList.add('active');
}

nextBtn.addEventListener('click', () => {
  current = (current + 1) % slides.length;
  showSlide(current);
});

prevBtn.addEventListener('click', () => {
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
});

// Auto slide every 5 seconds
setInterval(() => {
  current = (current + 1) % slides.length;
  showSlide(current);
}, 5000);
const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("active");
    links.classList.toggle("active");
  });
