(function () {
  // ================== الإعدادات (غيّرها من هنا) ==================
  var PHONE = '0510785161';
  var WHATSAPP = '966510785161';   // الرقم بالصيغة الدولية بدون + أو أصفار
  var IMAGES = 17;                 // الصور: 1.jpeg إلى 17.jpeg
  var VIDEOS = 4;                  // الفيديوهات: 1.mp4 إلى 4.mp4
  // ================================================================

  var WA_PATH = 'M16.02 3C9.4 3 4.03 8.36 4.03 14.97c0 2.35.68 4.55 1.86 6.4L4 28l6.82-1.79a11.94 11.94 0 0 0 5.2 1.19h.01c6.61 0 11.98-5.37 11.98-11.98C28 8.36 22.63 3 16.02 3zm0 21.9h-.01a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-4.05 1.06 1.08-3.95-.24-.4a9.9 9.9 0 0 1-1.52-5.27c0-5.47 4.45-9.92 9.93-9.92 5.47 0 9.92 4.45 9.92 9.92 0 5.48-4.45 9.15-9.7 10.15zm5.44-7.43c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35z';
  var PHONE_PATH = 'M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z';

  function $(id) { return document.getElementById(id); }

  // ---------- الأزرار العائمة (أسفل اليسار) ----------
  var fb = document.createElement('div');
  fb.className = 'float-btns';
  fb.innerHTML =
    '<a class="fb-wa" href="https://wa.me/' + WHATSAPP + '" target="_blank" rel="noopener" aria-label="تواصل عبر واتساب">' +
      '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="' + WA_PATH + '"/></svg></a>' +
    '<a class="fb-call" href="tel:' + PHONE + '" aria-label="اتصل بنا">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + PHONE_PATH + '"/></svg></a>';
  document.body.appendChild(fb);

  // ---------- قائمة الجوال ----------
  var toggle = $('navToggle'), nav = $('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  var yr = $('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // ---------- عارض صور الواجهة ----------
  var slides = document.querySelectorAll('.slide');
  var dotsBox = $('dots');
  if (slides.length && dotsBox) {
    var idx = 0, timer = null;
    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', 'الصورة ' + (i + 1));
      d.addEventListener('click', function () { go(i); restart(); });
      dotsBox.appendChild(d);
    });
    var dots = dotsBox.querySelectorAll('button');
    var go = function (n) {
      idx = (n + slides.length) % slides.length;
      slides.forEach(function (s, i) { s.classList.toggle('active', i === idx); });
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    };
    var restart = function () {
      clearInterval(timer);
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        timer = setInterval(function () { go(idx + 1); }, 5000);
      }
    };
    $('heroNext').onclick = function () { go(idx + 1); restart(); };
    $('heroPrev').onclick = function () { go(idx - 1); restart(); };
    go(0); restart();
  }

  // ---------- المعرض والشاشة المكبرة ----------
  var gallery = $('gallery');
  if (gallery) {
    var items = [];
    for (var i = 1; i <= IMAGES; i++) items.push({ type: 'image', src: i + '.jpeg' });
    for (var v = 1; v <= VIDEOS; v++) items.push({ type: 'video', src: v + '.mp4' });

    var lb = $('lightbox'), lbImg = $('lbImg'), lbVid = $('lbVid'), lbCount = $('lbCount');
    var current = 0;

    items.forEach(function (it, n) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', (it.type === 'video' ? 'تشغيل الفيديو رقم ' : 'عرض الصورة رقم ') + (n + 1));
      if (it.type === 'video') {
        b.className = 'is-video';
        var vid = document.createElement('video');
        vid.src = it.src + '#t=0.1';
        vid.muted = true;
        vid.setAttribute('playsinline', '');
        vid.preload = 'metadata';
        b.appendChild(vid);
      } else {
        var img = document.createElement('img');
        img.src = it.src;
        img.alt = 'من أعمالنا - صورة ' + (n + 1);
        img.loading = 'lazy';
        img.onerror = function () { this.style.opacity = 0; };
        b.appendChild(img);
      }
      b.addEventListener('click', function () { openLb(n); });
      gallery.appendChild(b);
    });

    var stopVideo = function () { lbVid.pause(); lbVid.removeAttribute('src'); lbVid.load(); };
    var showLb = function () {
      var it = items[current];
      if (it.type === 'video') {
        lbImg.style.display = 'none';
        lbVid.style.display = 'block';
        lbVid.src = it.src;
        lbVid.play().catch(function () {});
      } else {
        stopVideo();
        lbVid.style.display = 'none';
        lbImg.style.display = 'block';
        lbImg.src = it.src;
      }
      lbCount.textContent = (current + 1) + ' / ' + items.length;
    };
    var openLb = function (n) { current = n; showLb(); lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
    var closeLb = function () { stopVideo(); lb.classList.remove('open'); document.body.style.overflow = ''; };
    var nextLb = function () { current = (current + 1) % items.length; showLb(); };
    var prevLb = function () { current = (current - 1 + items.length) % items.length; showLb(); };

    $('lbClose').onclick = closeLb;
    $('lbNext').onclick = nextLb;
    $('lbPrev').onclick = prevLb;
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLb();
      if (e.key === 'ArrowLeft') nextLb();
      if (e.key === 'ArrowRight') prevLb();
    });
  }

  // ---------- نموذج التواصل (يفتح واتساب برسالة جاهزة) ----------
  var form = $('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('fName').value.trim();
      var service = $('fService').value;
      var msg = $('fMsg').value.trim();
      var text = 'السلام عليكم، أنا ' + name + '.\nالخدمة المطلوبة: ' + service + '.\n' + msg;
      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
    });
  }
})();
