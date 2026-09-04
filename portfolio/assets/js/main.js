const loader = document.getElementById('loader');
const ldTxt  = document.getElementById('ldTxt');
const ldProg = document.getElementById('ldProg');

setTimeout(() => ldTxt.classList.add('go'), 100);
setTimeout(() => ldProg.style.width = '100%', 200);
setTimeout(() => {
  loader.classList.add('out');
  document.getElementById('h1').classList.add('revealed');
}, 1350);


window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('stuck', window.scrollY > 40);
}, { passive: true });

const ham    = document.getElementById('ham');
const drawer = document.getElementById('drawer');

ham.addEventListener('click', () => {
  ham.classList.toggle('open');
  drawer.classList.toggle('open');
});
drawer.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => {
    ham.classList.remove('open');
    drawer.classList.remove('open');
  })
);

const roles = [
  'Web Developer',
  'UI/UX Designer',
  'Product Designer',
  'Mobile App Designer',
  'CS Student'
];
const twEl = document.getElementById('tw');
let ri = 0, ci = 0, del = false;

(function type() {
  const w = roles[ri];
  if (!del) {
    twEl.textContent = w.slice(0, ++ci);
    if (ci === w.length) { del = true; return setTimeout(type, 1700); }
    setTimeout(type, 72);
  } else {
    twEl.textContent = w.slice(0, --ci);
    if (ci === 0) { del = false; ri = (ri + 1) % roles.length; return setTimeout(type, 280); }
    setTimeout(type, 40);
  }
})();

/* =============================================
   SCROLL REVEAL
============================================= */
const srObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const siblings = [...(e.target.parentElement?.querySelectorAll('.sr') || [])];
    const i = siblings.indexOf(e.target);
    setTimeout(() => e.target.classList.add('in'), i * 75);
    srObs.unobserve(e.target);
  });
}, { threshold: 0.08 });

document.querySelectorAll('.sr').forEach(el => srObs.observe(el));

/* =============================================
   3D TILT (pointer — works on touch too)
============================================= */
function addTilt(sel, deg) {
  document.querySelectorAll(sel).forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left)  / r.width  - .5;
      const y = (e.clientY - r.top)   / r.height - .5;
      el.style.transform =
        `perspective(900px) rotateY(${x * deg}deg) rotateX(${-y * deg * .7}deg) scale3d(1.025,1.025,1.025)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  });
}
addTilt('.proj-card', 7);
addTilt('.sk-card',   6);
addTilt('.av-ring',   9);

/* =============================================
   LIQUID BLOB — follows pointer inside cards
============================================= */
document.querySelectorAll('.proj-card').forEach(card => {
  const blob = card.querySelector('.proj-blob');
  if (!blob) return;
  card.addEventListener('pointermove', e => {
    const r = card.getBoundingClientRect();
    blob.style.left = (e.clientX - r.left - 100) + 'px';
    blob.style.top  = (e.clientY - r.top  - 100) + 'px';
  });
});

/* =============================================
   SCROLL-DRIVEN 3D DEPTH
============================================= */
/* init hidden states */
document.querySelectorAll('.tl-item').forEach(el => {
  el.style.opacity   = '0';
  el.style.transition = 'opacity .5s ease, transform .5s ease';
});

function onDepthScroll() {
  const vh = window.innerHeight;
  const sy = window.scrollY;

  /* hero photo parallax */
  const hp = document.getElementById('heroPhoto');
  if (hp) hp.style.transform = `translateY(${sy * .14}px)`;

  /* avatar ring slow rotation */
  const av = document.getElementById('heroAv');
  if (av) av.style.transform = `rotateZ(${sy * .025}deg)`;

  /* project cards Z-push as they enter/leave viewport */
  ['pc1','pc2','pc3','pc4'].forEach(id => {
    const el = document.getElementById(id);
    if (!el || el.matches(':hover')) return;
    const r = el.getBoundingClientRect();
    const p = Math.min(Math.max((vh - r.top) / (vh + r.height), 0), 1);
    el.style.transform = `perspective(1000px) translateZ(${(p - .5) * 26}px)`;
  });

  /* about photo gentle parallax tilt */
  const ac = document.getElementById('aboutImgCol');
  if (ac) {
    const r = ac.getBoundingClientRect();
    const p = Math.min(Math.max((vh - r.top) / vh, 0), 1);
    ac.style.transform =
      `perspective(700px) rotateY(${(p - .5) * 5}deg) translateY(${(1 - p) * 16}px)`;
  }

  /* timeline items slide in from left with depth */
  document.querySelectorAll('.tl-item').forEach(el => {
    if (el.dataset.done) return;
    const r = el.getBoundingClientRect();
    const p = Math.min(Math.max((vh - r.top) / 160, 0), 1);
    el.style.opacity   = p;
    el.style.transform =
      `perspective(600px) translateX(${(1 - p) * -24}px) translateZ(${(p - .5) * 10}px)`;
    if (p >= 1) el.dataset.done = '1';
  });
}

window.addEventListener('scroll', onDepthScroll, { passive: true });
setTimeout(onDepthScroll, 300);

/* =============================================
   COMMENTS (localStorage)
============================================= */
let cmts = [];
try { cmts = JSON.parse(localStorage.getItem('dav_cmts') || '[]'); } catch(e) {}

const cmtList = document.getElementById('cmtList');
const cmtNone = document.getElementById('cmtNone');
const esc = s => s
  .replace(/&/g,'&amp;')
  .replace(/</g,'&lt;')
  .replace(/>/g,'&gt;');

function renderCmts() {
  cmtList.querySelectorAll('.cmt-card').forEach(c => c.remove());
  cmtNone.style.display = cmts.length ? 'none' : 'block';
  [...cmts].reverse().forEach(c => {
    const d = document.createElement('div');
    d.className = 'cmt-card';
    d.innerHTML = `
      <div class="cmt-head">
        <div class="cmt-av">${esc(c.name[0].toUpperCase())}</div>
        <div>
          <div class="cmt-name">${esc(c.name)}</div>
          <div class="cmt-time">${c.time}</div>
        </div>
      </div>
      <div class="cmt-body">${esc(c.text)}</div>`;
    d.style.cssText = 'opacity:0;transform:translateY(12px);transition:opacity .38s,transform .38s';
    cmtList.appendChild(d);
    setTimeout(() => { d.style.opacity = '1'; d.style.transform = 'none'; }, 50);
  });
}
renderCmts();

document.getElementById('cmtBtn').addEventListener('click', () => {
  const n = document.getElementById('cmtN').value.trim();
  const t = document.getElementById('cmtT').value.trim();
  if (!n || !t) return;
  cmts.push({
    name: n, text: t,
    time: new Date().toLocaleDateString('en-CA', {
      year:'numeric', month:'short', day:'numeric',
      hour:'2-digit', minute:'2-digit'
    })
  });
  try { localStorage.setItem('dav_cmts', JSON.stringify(cmts)); } catch(e) {}
  document.getElementById('cmtN').value = '';
  document.getElementById('cmtT').value = '';
  renderCmts();
  cmtList.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* CV MODAL */
const modal  = document.getElementById('cv-modal');
const openM  = () => modal.classList.add('on');
const closeM = () => modal.classList.remove('on');

['navCV','openCV2','drawerCV'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', e => { e.preventDefault(); openM(); });
});
document.getElementById('cvX').addEventListener('click', closeM);
modal.addEventListener('click', e => { if (e.target === modal) closeM(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeM(); });

/* CV DOWNLOAD (generates a clean HTML file) */
document.getElementById('cvDl').addEventListener('click', () => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>David Egwudo — CV</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',Arial,sans-serif;color:#111;background:#fff;padding:40px;max-width:820px;margin:auto;line-height:1.6}
  h1{font-size:2rem;font-weight:800;letter-spacing:-.04em}
  h1 span{color:#7B5EA7}
  .sub{font-size:.85rem;color:#555;margin:.3rem 0 .8rem}
  .contacts{display:flex;gap:12px;flex-wrap:wrap;font-size:.75rem;color:#444;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid #111}
  .contacts a{color:#7B5EA7}
  h2{font-size:.7rem;font-weight:800;text-transform:uppercase;letter-spacing:.08em;color:#7B5EA7;margin:18px 0 10px;padding-bottom:4px;border-bottom:1px solid #eee}
  .e{margin-bottom:12px}
  .er{display:flex;justify-content:space-between;flex-wrap:wrap;gap:3px}
  .et{font-weight:700;font-size:.87rem}
  .ed{font-size:.7rem;color:#888}
  .eo{font-size:.77rem;color:#7B5EA7;margin:.18rem 0 .3rem}
  .ep{font-size:.8rem;color:#555;line-height:1.65}
  .sk{display:flex;flex-wrap:wrap;gap:5px}
  .sp{font-size:.7rem;padding:3px 8px;border:1px solid #ddd;color:#555;border-radius:3px}
</style>
</head>
<body>
<h1>Egwudo David <span>Ugochukwu</span></h1>
<div class="sub">Web Developer · UI/UX Designer · Mobile App Designer · CS Student</div>
<div class="contacts">
  <span>Canada</span>
  <a href="mailto:egwudoodavid@gmail.com">egwudoodavid@gmail.com</a>
  <span>+234 901 398 3600</span>
  <a href="https://www.linkedin.com/in/david-egwudo-bb7542300/">LinkedIn</a>
  <a href="https://x.com/uegwudo27180">Twitter/X</a>
  <a href="https://www.instagram.com/ugo.egwudo">Instagram</a>
</div>
<h2>Experience</h2>
<div class="e"><div class="er"><span class="et">Freelance Web Developer &amp; Designer</span><span class="ed">2024–Present</span></div><div class="eo">Self-employed · Remote, Canada</div><p class="ep">4+ client projects: e-commerce, portfolios, brand identities. End-to-end from Figma to deployment.</p></div>
<div class="e"><div class="er"><span class="et">UI/UX Design Intern</span><span class="ed">2023–2024</span></div><div class="eo">Tech Startup · Remote</div><p class="ep">Designed mobile app UI, conducted user testing, prepared Figma handoffs.</p></div>
<div class="e"><div class="er"><span class="et">Campus Hackathon — Top 3</span><span class="ed">2023</span></div><div class="eo">Lead City University</div><p class="ep">Built a community resource-sharing platform in 24 hours. Top 3 finish.</p></div>
<h2>Education</h2>
<div class="e"><div class="er"><span class="et">B.Sc. Computer Science</span><span class="ed">2023–2026/27</span></div><div class="eo">Lead City University · Ibadan, Nigeria</div></div>
<div class="e"><div class="er"><span class="et">Google UX Design Certificate</span><span class="ed">2024</span></div><div class="eo">Coursera</div></div>
<div class="e"><div class="er"><span class="et">Full-Stack Web Development Bootcamp</span><span class="ed">2023</span></div><div class="eo">Udemy</div></div>
<h2>Skills</h2>
<div class="sk"><span class="sp">HTML5</span><span class="sp">CSS3</span><span class="sp">JavaScript</span><span class="sp">PHP</span><span class="sp">Python</span><span class="sp">Java</span><span class="sp">MySQL</span><span class="sp">Node.js</span><span class="sp">Figma</span><span class="sp">Adobe XD</span><span class="sp">UI/UX Design</span><span class="sp">Mobile App Design</span><span class="sp">Branding</span><span class="sp">Git/GitHub</span><span class="sp">Bootstrap</span><span class="sp">SASS</span></div>
<h2>Projects</h2>
<div class="e"><div class="er"><span class="et">FinTrack — Finance Dashboard</span></div><p class="ep">Finance UI/UX + dev. Figma, JavaScript, Chart.js.</p></div>
<div class="e"><div class="er"><span class="et">ShopEase — E-Commerce Platform</span></div><p class="ep">Full e-commerce site. HTML/CSS/JS/PHP/MySQL.</p></div>
<div class="e"><div class="er"><span class="et">MindSpace — Mobile Wellness App</span></div><p class="ep">24-screen Figma prototype + design system. User-tested with 12 students.</p></div>
<div class="e"><div class="er"><span class="et">EduConnect — Student Portal</span></div><p class="ep">University portal. Tech lead. PHP/MySQL full-stack.</p></div>
</body>
</html>`;

  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([html], { type: 'text/html' })),
    download: 'David_Egwudo_CV.html'
  });
  a.click();
});
