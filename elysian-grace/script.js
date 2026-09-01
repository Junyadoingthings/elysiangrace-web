/* Elysian Grace Events — shared behaviour */
(function () {
  'use strict';

  var WA_NUMBER = '27639500047';

  /* ---- year ---- */
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  /* ---- land on the right section when a page is opened with a #fragment ----
     (e.g. services.html#decor from the home page: the browser's initial jump
     happens before fonts/images settle, so it can end up at the top) ---- */
  if (window.location.hash.length > 1) {
    var target = null;
    try {
      target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
    } catch (err) { target = null; }
    if (target) {
      window.addEventListener('load', function () {
        window.requestAnimationFrame(function () {
          target.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
      });
    }
  }

  /* ---- sticky header ---- */
  var header = document.getElementById('header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- mobile menu ---- */
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    var toggle = function (open) {
      if (open && header) {
        /* keep the panel clear of the sticky header + announcement bar */
        mobileNav.style.paddingTop = Math.max(0, header.getBoundingClientRect().bottom) + 28 + 'px';
      }
      burger.classList.toggle('is-open', open);
      mobileNav.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    };
    burger.addEventListener('click', function () {
      toggle(!mobileNav.classList.contains('is-open'));
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') toggle(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') toggle(false);
    });
  }

  /* ---- reveal on scroll ---- */
  var revealables = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealables.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = (Array.prototype.indexOf.call(el.parentNode.children, el) % 6) * 70;
        setTimeout(function () { el.classList.add('is-in'); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- services page: highlight active category ---- */
  var svcNav = document.getElementById('svcNav');
  if (svcNav) {
    var links = Array.prototype.slice.call(svcNav.querySelectorAll('a'));
    var sections = links
      .map(function (a) { return document.querySelector(a.getAttribute('href')); })
      .filter(Boolean);

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- booking form ---- */
  var form = document.getElementById('bookingForm');
  if (!form) return;

  var chipWrap = document.getElementById('chips');
  var chips = chipWrap ? Array.prototype.slice.call(chipWrap.querySelectorAll('.chip')) : [];
  var svcErr = document.getElementById('svcErr');

  var setChip = function (chip, on) {
    chip.classList.toggle('is-on', on);
    chip.setAttribute('aria-pressed', on ? 'true' : 'false');
  };

  chips.forEach(function (chip) {
    chip.setAttribute('aria-pressed', 'false');
    chip.addEventListener('click', function () {
      setChip(chip, !chip.classList.contains('is-on'));
      if (svcErr) svcErr.parentNode.classList.remove('has-error');
    });
  });

  /* preselect service chips from ?service=… (services page "Book this" buttons) */
  var params = new URLSearchParams(window.location.search);
  var wanted = params.get('service') || '';
  var extraService = '';

  var byLabel = function (label) {
    return chips.filter(function (c) {
      return (c.getAttribute('data-svc') || c.textContent).indexOf(label) === 0;
    });
  };

  if (wanted) {
    var w = wanted.toLowerCase();
    var picks = [];

    if (/funeral|memorial/.test(w)) {
      picks = ['Funeral'];
    } else {
      if (/planning|coordinat|celebration package|day-of/.test(w)) picks.push('Event Planning');
      if (/d(e|é|%c3%a9)cor|styling/.test(w)) picks.push('Décor');
      if (/floral|flower|rose|bouquet|bunch|boxed|gift box/.test(w)) picks.push('Florals');
      if (/hair|wig|frontal|t-part|curl|bob|beauty bundle/.test(w)) picks.push('Hair');
      if (/makeup|glam|beauty bundle/.test(w)) picks.push('Makeup');
      if (/nail|beauty bundle/.test(w)) picks.push('Nails');
      if (/spa|pamper/.test(w)) picks.push('Spa');
      if (/photo|portrait|content clip|coverage/.test(w)) picks.push('Photography');
      if (/bridal attire|gown|suiting|groom/.test(w)) picks.push('Bridal Attire');
    }

    var matchedAny = false;
    picks.forEach(function (label) {
      byLabel(label).forEach(function (chip) { setChip(chip, true); matchedAny = true; });
    });
    if (!matchedAny) extraService = wanted;

    var notes = document.getElementById('notes');
    if (notes && !notes.value) notes.value = 'I am interested in: ' + wanted;

    if (/funeral|memorial/.test(w)) {
      var occ = document.getElementById('occasion');
      if (occ) occ.value = 'Funeral / Memorial';
    }
  }

  var markError = function (el, bad) {
    var field = el.closest('.field');
    if (field) field.classList.toggle('has-error', bad);
  };

  ['name', 'phone', 'occasion'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', function () { markError(el, false); });
    if (el) el.addEventListener('change', function () { markError(el, false); });
  });

  var val = function (id) {
    var el = document.getElementById(id);
    return el ? el.value.trim() : '';
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var name = val('name'), phone = val('phone'), occasion = val('occasion');
    var chosen = chips.filter(function (c) { return c.classList.contains('is-on'); })
      .map(function (c) {
        var t = document.createElement('textarea');
        t.innerHTML = c.getAttribute('data-svc') || c.textContent;
        return t.value;
      });
    if (extraService) chosen.push(extraService);

    var bad = false, firstBad = null;
    [['name', name], ['phone', phone], ['occasion', occasion]].forEach(function (pair) {
      var el = document.getElementById(pair[0]);
      var isBad = !pair[1];
      markError(el, isBad);
      if (isBad && !bad) { bad = true; firstBad = el; }
    });
    if (!chosen.length) {
      if (svcErr) svcErr.parentNode.classList.add('has-error');
      if (!bad) { bad = true; firstBad = chipWrap; }
    }
    if (bad) {
      if (firstBad && firstBad.scrollIntoView) {
        firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (firstBad.focus) firstBad.focus({ preventScroll: true });
      }
      return;
    }

    var date = val('date');
    var prettyDate = date
      ? new Date(date + 'T00:00:00').toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' })
      : 'To be confirmed';

    var lines = [
      'Hi Elysian Grace Events, I would like to make a booking.',
      '',
      'Name: ' + name,
      'Contact: ' + phone,
      'Occasion: ' + occasion,
      'Date: ' + prettyDate,
      'Guests: ' + (val('guests') || 'To be confirmed'),
      'Venue / area: ' + (val('area') || 'To be confirmed'),
      'Services needed: ' + chosen.join(', '),
      'Budget: ' + (val('budget') || 'To be discussed'),
      'Best contact method: ' + (val('contactPref') || 'WhatsApp')
    ];
    var notesVal = val('notes');
    if (notesVal) { lines.push('', 'Notes: ' + notesVal); }
    lines.push('', 'Sent from the Elysian Grace Events website.');

    var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
  });
})();
