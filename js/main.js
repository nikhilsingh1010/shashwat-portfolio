document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Timecode HUD ---------- */
  const tc = document.getElementById('timecode');
  const start = performance.now();
  function pad(n){ return String(n).padStart(2,'0'); }
  function tickTimecode(){
    const elapsed = performance.now() - start;
    const totalFrames = Math.floor(elapsed / (1000/24)); // 24fps
    const frames = totalFrames % 24;
    const totalSeconds = Math.floor(totalFrames / 24);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);
    tc.textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
    requestAnimationFrame(tickTimecode);
  }
  requestAnimationFrame(tickTimecode);

  /* ---------- Nav scroll state + mobile toggle ---------- */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    navToggle.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  }));

  /* ---------- Scroll Reveal Animations ---------- */
  const scrollRevealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        scrollRevealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.scroll-reveal').forEach(el => {
    scrollRevealObserver.observe(el);
  });

  /* Service cards — add scroll-reveal with staggered delay */
  document.querySelectorAll('.service-card').forEach((card, i) => {
    card.classList.add('scroll-reveal');
    card.style.transitionDelay = `${0.05 + i * 0.06}s`;
    scrollRevealObserver.observe(card);
  });


  /* ---------- Custom Cursor ---------- */
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (dot && ring) {
    let mx = -100, my = -100, rx = -100, ry = -100;
    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });
    (function animRing(){
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    })();
    document.querySelectorAll('a, button, .proj-card, .photo-item, .service-card, .hero-dot').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('grow'));
      el.addEventListener('mouseleave', () => ring.classList.remove('grow'));
    });
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.classList.add('hide'); });
    document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.classList.remove('hide'); });
  }

  /* ---------- Animated stat counters ---------- */
  const statNums = document.querySelectorAll('.stat-num');
  let statsAnimated = false;
  const statsObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNums.forEach(el => {
        const raw = el.textContent.trim();
        const suffix = raw.replace(/[\d]/g, '');
        const target = parseInt(raw);
        if (isNaN(target)) return;
        let current = 0;
        const step = Math.max(1, Math.round(target / 40));
        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current + suffix;
          if (current >= target) clearInterval(timer);
        }, 35);
      });
    }
  }, { threshold: 0.5 });
  const aboutStats = document.querySelector('.about-stats');
  if (aboutStats) statsObserver.observe(aboutStats);


  /* ---------- Active scene indicator ---------- */
  const scenes = ['hero','about','services','video-editing','videography','photography','experience','skills','testimonials','contact'];
  const activeSceneEl = document.getElementById('active-scene');
  const sceneObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const idx = scenes.indexOf(entry.target.id) + 1;
        if (idx > 0) activeSceneEl.textContent = pad(idx);
      }
    });
  }, { threshold: 0.4 });
  scenes.forEach(id => {
    const el = document.getElementById(id);
    if (el) sceneObserver.observe(el);
  });

  /* ---------- Reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.section-title, .service-card, .proj-card, .photo-item, .tl-item, .skill-block, .testimonial-card')
    .forEach(el => { el.classList.add('reveal'); revealObserver.observe(el); });

  /* ---------- Project data ---------- */
  const duotones = [
    'linear-gradient(135deg, #3f6f68, #0b0c0f)',
    'linear-gradient(135deg, #d9a24b, #0b0c0f)',
    'linear-gradient(135deg, #5c9c92, #131519)',
    'linear-gradient(135deg, #8a6a35, #131519)',
    'linear-gradient(135deg, #2e5f5a, #1a1d23)',
    'linear-gradient(135deg, #b9843a, #0b0c0f)'
  ];

  /* ============================================================
     TO ADD YOUR VIDEOS:
     1. Put video files in assets/videos/  (e.g. assets/videos/golden-hour-getaway.mp4)
     2. Put a thumbnail image (a frame grab) in assets/images/ (e.g. assets/images/edit-01-poster.jpg)
     3. Add "video" and "poster" to the matching project object below, e.g.:
        { tag:'Brand Film', title:'Golden Hour Getaway', desc:'...',
          video:'assets/videos/golden-hour-getaway.mp4',
          poster:'assets/images/edit-01-poster.jpg' }
     Projects without a "video" field keep showing the "coming soon" card automatically.
     ============================================================ */

  const editingProjects = [
    { tag:'Café Reel', title:'Café Vibes', desc:'A warm, mood-driven edit for a café brand — slow pours, ambient light, and a lived-in feel.', video:'assets/videos/VideoEditing/cafe.mp4', poster:'' },
    { tag:'Club Night', title:'Club Neoo — 28 March', desc:'Dynamic, high-energy cut for Club Neoo\'s March event — built for the dance floor and the gram.', video:'assets/videos/VideoEditing/CLUB NEOO 28 MARCH.mp4', poster:'' },
    { tag:'Event Highlight', title:'Club Momentz — 23 Mar', desc:'Punchy event reel capturing the crowd, colour, and energy of a big night out.', video:'assets/videos/VideoEditing/club momentz 23 mar.mp4', poster:'' },
    { tag:'Cinematic Reel', title:'Frames in Motion', desc:'A cinematic showcase piece — fluid movement, curated colour grade, and intentional pacing.', video:'assets/videos/VideoEditing/Copy of IMG_6165_4.mp4', poster:'' },
    { tag:'Healthcare', title:'Health Zone AI Reel', desc:'A calm, confident brand reel for Health Zone — reassuring visuals paired with AI-forward messaging.', video:'assets/videos/VideoEditing/HEALTH ZONE AI REEL 02.mp4', poster:'' },
    { tag:'Brand Reel', title:'NM AI — Brand Film', desc:'A sharp, minimal brand reel for an AI-forward brand — fast cuts, modern typography.', video:'assets/videos/VideoEditing/nm ai.mp4', poster:'' },
    { tag:'Personal Reel', title:'SG — Signature Edit', desc:'A personal showreel cut that demonstrates pacing range, colour sensibility, and editorial instinct.', video:'assets/videos/VideoEditing/sg4.mp4', poster:'' },
    { tag:'Event Film', title:'Silvete — 31 January', desc:'An elegant event film from January — atmosphere, detail, and the moments in between.', video:'assets/videos/VideoEditing/silvete 31 jan (1).mp4', poster:'' },
    { tag:'Institutional', title:'Study Chakra — 9 July', desc:'An energetic institutional edit for Study Chakra — community, ambition, and campus life.', video:'assets/videos/VideoEditing/STUDY CHAKRA 9 JULY1_1.mp4', poster:'' },
    { tag:'Luxury Brand', title:'Utopian Luxe', desc:'A premium brand film for Utopian Luxe — refined pacing, rich tones, and impeccable detail.', video:'assets/videos/VideoEditing/utopian luxe.mp4', poster:'' },
    { tag:'Event Reel', title:'17 July — Event Cut', desc:'A live event reel from July — capturing the moments that made the night worth remembering.', video:'assets/videos/VideoEditing/17 JULY.mp4', poster:'' },
  ];

  const videographyProjects = [
    { tag:'Hospitality', title:'Lakes Nine — 6 Feb', desc:'On-location coverage for Lakes Nine — interiors, ambience, and the lifestyle of the stay.', video:'assets/videos/VideoGraphy/LAKES NINE 6 FEB.mp4', poster:'' },
    { tag:'Night Event', title:'Tickled Pink — Night', desc:'Night event footage for Tickled Pink — moody light, candid moments, and the energy of the evening.', video:'assets/videos/VideoGraphy/Tickled pink night.mp4', poster:'' },
    { tag:'Food & Bev', title:'Makhan — Food Film', desc:'Overhead and close-up shots capturing texture, warmth, and the soul of good food.', video:'assets/videos/VideoGraphy/makhan.mp4', poster:'' },
    { tag:'Celebration', title:'Mother\'s Day Shoot', desc:'Heartfelt, warm footage for a Mother\'s Day campaign — emotion-first, detail-conscious.', video:'assets/videos/VideoGraphy/mothers day .mp4', poster:'' },
    { tag:'Videography Reel', title:'Reel Update', desc:'A behind-the-lens compilation — the raw production work across recent shoots.', video:'assets/videos/VideoGraphy/reel update.mov', poster:'' },
    { tag:'On-Location Shoot', title:'Shoot 1 — Reel 2', desc:'Clean, deliberate on-location footage — steady hands, natural light, and composed frames.', video:'assets/videos/VideoGraphy/shoot 1 reel 2.mp4', poster:'' },
    { tag:'Documentary', title:'Sunday Vlog', desc:'Observational, handheld footage of a lazy Sunday — candid city life with a documentary feel.', video:'assets/videos/VideoGraphy/sunday vlog .mp4', poster:'' },
    { tag:'Brand Film', title:'Tickled Pink — Video', desc:'Brand event coverage for Tickled Pink — from setup through to the final frame.', video:'assets/videos/VideoGraphy/tickled pink video.mp4', poster:'' },
    { tag:'Nature', title:'Uttarakhand — 18 Dec', desc:'An outdoor videography piece from Uttarakhand — chasing golden hour across mountain landscapes.', video:'assets/videos/VideoGraphy/uttrakhand 18 dec.mp4', poster:'' },
    { tag:'Valentine Special', title:'Valentine Chocolate Day', desc:'Warm, romantic product footage for Valentine\'s Day — soft light, close details, and celebration.', video:'assets/videos/VideoGraphy/valentine chocolate day.mp4', poster:'' },
  ];

  const photos = [
    { src:'assets/images/photo-01.jpg', thumb:'assets/images/photo-01-thumb.jpg', title:'Morning Vows', sub:'Portrait — Ritual Ceremony' },
    { src:'assets/images/photo-02.jpg', thumb:'assets/images/photo-02-thumb.jpg', title:'Electric Skyline', sub:'Landscape — Storm Over the City' },
    { src:'assets/images/photo-03.jpg', thumb:'assets/images/photo-03-thumb.jpg', title:'Fire &amp; Faith', sub:'Documentary — River Aarti' },
    { src:'assets/images/photo-04.jpg', thumb:'assets/images/photo-04-thumb.jpg', title:'Echoes of the Mughals', sub:'Architecture — Humayun\u2019s Tomb' },
    { src:'assets/images/photo-05.jpg', thumb:'assets/images/photo-05-thumb.jpg', title:'Confluence', sub:'Landscape — Riverside Pilgrimage' },
    { src:'assets/images/photo-06.jpg', thumb:'assets/images/photo-06-thumb.jpg', title:'Brotherhood in Bloom', sub:'Event — Haldi Ceremony' },
    { src:'assets/images/photo-07.jpg', thumb:'assets/images/photo-07-thumb.jpg', title:'Turmeric Traditions', sub:'Event — Haldi Ceremony' },
    { src:'assets/images/photo-08.jpg', thumb:'assets/images/photo-08-thumb.jpg', title:'Ready for the Ritual', sub:'Event — Wedding Festivities' },
    { src:'assets/images/photo-09.jpg', thumb:'assets/images/photo-09-thumb.jpg', title:'Standing Watch', sub:'Architecture — Qutub Minar' },
  ];

  /* ---------- Render project cards ---------- */
  function renderProjects(list, container, kind){
    const el = document.getElementById(container);
    el.innerHTML = list.map((p, i) => `
      <div class="proj-card" data-kind="${kind}" data-index="${i}">
        <div class="proj-thumb">
          ${p.poster
            ? `<img src="${p.poster}" alt="${p.title}" class="proj-poster">`
            : p.video
              ? `<video class="proj-poster proj-video-thumb" src="${p.video}" preload="metadata" muted playsinline disablePictureInPicture tabindex="-1"></video>`
              : `<div class="duotone" style="background:${duotones[i % duotones.length]}"></div>`
          }
          <span class="proj-tag">${p.tag}</span>
          <div class="play-icon"></div>
        </div>
        <div class="proj-body">
          <span class="proj-num">${String(i+1).padStart(2,'0')} / ${String(list.length).padStart(2,'0')}</span>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
        </div>
      </div>
    `).join('');
  }
  renderProjects(editingProjects, 'editingGrid', 'editing');
  renderProjects(videographyProjects, 'videographyGrid', 'videography');

  /* re-observe newly injected cards for reveal + refresh scene targets not needed since ids constant */
  document.querySelectorAll('#editingGrid .proj-card, #videographyGrid .proj-card').forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  /* ---------- Render photo grid ---------- */
  const photoGrid = document.getElementById('photoGrid');
  photoGrid.innerHTML = photos.map((p, i) => `
    <div class="photo-item reveal" data-index="${i}">
      <img src="${p.thumb}" alt="${p.title} — ${p.sub}" loading="lazy">
      <div class="photo-caption">
        <span class="p-title">${p.title}</span><br>
        <span class="p-sub">${p.sub}</span>
      </div>
    </div>
  `).join('');
  photoGrid.querySelectorAll('.photo-item').forEach(el => revealObserver.observe(el));

  /* ---------- Experience timeline ---------- */
  const experience = [
    {
      role:'Video Editor Intern', company:'Hypesquadz — Noida', dates:'May 2026 – Aug 2026',
      items:['Short-form editing','Client editing','Post-production']
    },
    {
      role:'Video Editor &amp; Videographer', company:'Social Asana — Lucknow', dates:'Aug 2025 – Apr 2026',
      items:['Videography','Video editing','Commercial shoots','Social media campaigns']
    },
    {
      role:'Video Editor Intern', company:'Flying Pizza Boy — Lucknow', dates:'May 2025 – Jul 2025',
      items:['Food promotional videos','Advertisement editing','Short-form content']
    },
    {
      role:'Video Editor', company:'Freelance', dates:'Jun 2024 – Nov 2024',
      items:['Edited videos for multiple clients','Social media editing','Promotional videos','Reels editing']
    },
    {
      role:'Instagram Manager &amp; Video Editor', company:'Mahimamakeovers', dates:'Feb 2023 – Present',
      items:['Instagram content management','Video editing','Social media content creation','Brand content optimisation']
    },
  ];
  document.getElementById('timeline').innerHTML = experience.map(e => `
    <div class="tl-item reveal">
      <div class="tl-head">
        <span class="tl-role">${e.role}</span>
        <span class="tl-dates">${e.dates}</span>
      </div>
      <div class="tl-company">${e.company}</div>
      <ul class="tl-list">${e.items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>
  `).join('');
  document.querySelectorAll('.tl-item').forEach(el => revealObserver.observe(el));

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxContent = document.getElementById('lightboxContent');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentMode = null; // 'photo' | 'editing' | 'videography'
  let currentIndex = 0;

  function openLightbox(mode, index){
    currentMode = mode;
    currentIndex = index;
    renderLightbox();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox(){
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }
  function renderLightbox(){
    if (currentMode === 'photo'){
      const p = photos[currentIndex];
      lightboxContent.innerHTML = `
        <img src="${p.src}" alt="${p.title}">
        <div class="lightbox-caption">
          <span class="p-title">${p.title}</span><br>
          <span class="p-sub">${p.sub} — ${currentIndex+1} / ${photos.length}</span>
        </div>
      `;
    } else {
      const list = currentMode === 'editing' ? editingProjects : videographyProjects;
      const p = list[currentIndex];
      const label = currentMode === 'editing' ? 'Video Editing Project' : 'Videography Project';
      const mediaBlock = p.video
        ? `<video class="lv-player" src="${p.video}" ${p.poster ? `poster="${p.poster}"` : ''} controls playsinline></video>`
        : `<div class="lv-placeholder"><span>&#9654;</span><span>Video preview coming soon</span></div>`;
      lightboxContent.innerHTML = `
        <div class="lightbox-video-info">
          <span class="lv-tag">${label} — ${p.tag}</span>
          <h3>${p.title}</h3>
          <p>${p.desc}</p>
          ${mediaBlock}
        </div>
      `;
    }
  }
  function step(dir){
    const list = currentMode === 'photo' ? photos : (currentMode === 'editing' ? editingProjects : videographyProjects);
    currentIndex = (currentIndex + dir + list.length) % list.length;
    renderLightbox();
  }

  document.addEventListener('click', (e) => {
    const projCard = e.target.closest('.proj-card');
    if (projCard){
      openLightbox(projCard.dataset.kind, parseInt(projCard.dataset.index, 10));
      return;
    }
    const photoItem = e.target.closest('.photo-item');
    if (photoItem){
      openLightbox('photo', parseInt(photoItem.dataset.index, 10));
    }
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  lightboxPrev.addEventListener('click', () => step(-1));
  lightboxNext.addEventListener('click', () => step(1));
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* ---------- Contact form (client-side only) ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    formNote.textContent = `Thanks${name ? ', ' + name.split(' ')[0] : ''} — this form is a front-end demo. Please email shashwatgupta4626@gmail.com directly to reach Shashwat.`;
    form.reset();
  });

  /* ---------- Hero video fade-in ---------- */
  const heroVideo = document.getElementById('heroVideo');
  if (heroVideo){
    const showHeroVideo = () => heroVideo.classList.add('loaded');
    if (heroVideo.readyState >= 3){
      showHeroVideo();
    } else {
      heroVideo.addEventListener('loadeddata', showHeroVideo, { once: true });
    }
  }

});
