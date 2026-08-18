/* =========================================================================
   Season Zero — ON AIR controller
   TUNE (switch signal) · CUE (daylight/broadcast) · STAMP (exact credit)
   OPEN (project file) · ACTIVATE (booking)
   No external dependencies.
   ========================================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------- signal data: every credit is exact ---------------- */
  var SIGNALS = {
    create: {
      lane: "CREATE",
      client: "Rally Off Court × Montis",
      title: "Dear Diary, for Montis",
      displayTitle: "Dear Diary, for Montis",
      castShort: "Creator · Producer",
      stamp: "CONCEPT · VOICE · CREATOR · EDITOR · PRODUCT STORYTELLER",
      note: "A footwear confession that turns into a product argument. Written, voiced, shot and cut by Lauren.",
      cast: "Creator · Producer · Branded storyteller · Format development",
      file: {
        "Project": "Dear Diary, for Montis footwear. Produced under Rally Off Court.",
        "Audience": "Recreational and league pickleball players considering court-specific footwear.",
        "Assignment": "Make the case for court shoes over running shoes without sounding like an ad read.",
        "Deliverable": "One vertical film, 96 seconds, 1080 × 1920, cut for social.",
        "Lauren's role": "Concept, script, voice, on-camera and product hands, shooting and edit.",
        "Proof": "A complete branded piece delivered end to end by one person, with the brand's product logic intact."
      },
      evidence: ["ev-create-01.jpg", "ev-create-02.jpg", "ev-create-03.jpg", "ev-create-04.jpg", "ev-create-05.jpg"]
    },
    explain: {
      lane: "EXPLAIN",
      client: "Rally Off Court",
      title: "What's in My Pickleball Bag?",
      displayTitle: "What's in My Pickleball Bag?",
      castShort: "Explainer host · Educator",
      stamp: "CREATOR · ON-CAMERA EXPLAINER · PRODUCT/CATEGORY STORYTELLER",
      note: "Gear, use case and honest opinion, delivered fast enough that people finish it.",
      cast: "Explainer host · Educator · Subject-matter communicator",
      file: {
        "Project": "What's in My Pickleball Bag? Lauren-led product and category explanation for Rally Off Court.",
        "Audience": "New and improving players deciding what is actually worth buying.",
        "Assignment": "Explain a category with real opinions, so a viewer can make a decision at the end of it.",
        "Deliverable": "Lauren-led vertical explainer, plus supporting motion explainer work in finance and education.",
        "Lauren's role": "Creator, on-camera explainer, product and category storyteller.",
        "Proof": "She can carry technical or commercial detail on camera without losing the room."
      },
      evidence: ["explain-card.jpg", "finance-poster.jpg", "headshot.jpg"]
    },
    host: {
      lane: "HOST",
      client: "Rally Off Court × Honcho × White Claw Zero Proof",
      title: "Life Beyond Play \u2014 Honcho \u00d7 White Claw Zero Proof",
      displayTitle: "Life Beyond Play",
      castShort: "Lifestyle host · Field correspondent",
      stamp: "HOST · ON-CAMERA TALENT · CREATOR · EDITOR · PRODUCT STORYTELLER",
      note: "On camera with a handheld mic, carrying a sponsored segment at a live league night.",
      cast: "Lifestyle host · Field correspondent · Unscripted · Branded integrations",
      file: {
        "Project": "Life Beyond Play with Honcho Pickleball and White Claw Zero Proof.",
        "Audience": "League players and the brands trying to reach them in the room, not in a feed.",
        "Assignment": "Host a sponsored segment live at a venue and make the sponsor feel like part of the night.",
        "Deliverable": "Hosted field segment, shot and cut for social distribution.",
        "Lauren's role": "Host and on-camera talent, plus creator, editor and product storyteller.",
        "Proof": "Handheld mic, live noise, unscripted moments, and the brand message still lands.",
        "Also on camera": "Scrambled Up | Television Game Show Contestant | 2026"
      },
      evidence: ["ev-host-04.jpg", "ev-host-02.jpg", "ev-host-03.jpg", "ev-host-05.jpg", "ev-host-01.jpg"]
    },
    activate: {
      lane: "ACTIVATE",
      client: "Honcho Pickleball × Centerline",
      title: "Courtside activation, Honcho × Centerline",
      displayTitle: "Honcho × Centerline",
      castShort: "Event host · Brand ambassador",
      stamp: "BRAND ACTIVATION · FIELD STORY · COMMUNITY PRESENCE",
      note: "Product in hand, players behind her, a real room. The sponsor reads as part of the night.",
      cast: "Event host · Moderator · Brand ambassador · On-site talent",
      file: {
        "Project": "Honcho Pickleball activation with Centerline apparel at a live indoor venue.",
        "Audience": "Players at the venue and the wider community watching the recap.",
        "Assignment": "Give a sponsor visible, natural presence inside a live event without stopping the event.",
        "Deliverable": "Activation stills and field content, plus cross-tagged host footage from the same environment.",
        "Lauren's role": "Brand activation, field story and community presence. Captain Ambassador with Honcho.",
        "Proof": "Product visibility, sponsor integration and live interaction in one frame.",
        "Also in this lane": "GoTennis / ARSA Fall Festival promo, 10,000+ views; selected promotional content later supported by paid amplification."
      },
      evidence: ["activate-centerline.jpg", "activate-centerline-02.jpg", "activate-room.jpg"]
    }
  };

  var STRIPS = {
    create: [["ev-create-01.jpg","Title card"],["ev-create-02.jpg","On court"],["ev-create-03.jpg","The shoes"],["ev-create-04.jpg","Rally"],["ev-create-05.jpg","Partner card"]],
    explain:[["explain-card.jpg","Daylight look"],["headshot.jpg","To camera"],["ev-create-03.jpg","Gear"],["finance-poster.jpg","Explainer motion"],["montis-card.jpg","Product"]],
    host:   [["ev-host-04.jpg","Handheld mic"],["ev-host-02.jpg","Close, to camera"],["ev-host-03.jpg","Live read"],["ev-host-05.jpg","Segment"],["ev-host-01.jpg","The venue"]],
    activate:[["activate-card.jpg","Product in hand"],["activate-room.jpg","The room"],["activate-centerline-02.jpg","Courtside"],["ev-host-01.jpg","Sponsor table"],["ev-host-03.jpg","Live read"]]
  };
  var SRCLABEL = {create:"RALLY OFF COURT × MONTIS",explain:"RALLY OFF COURT",host:"HONCHO × WHITE CLAW ZERO PROOF",activate:"HONCHO × CENTERLINE"};

  var LANES = ["create", "explain", "host", "activate"];
  var COLORS = { create: "var(--pink)", explain: "var(--violet)", host: "var(--aqua)", activate: "var(--coral)" };
  var HEX = { create: "#ff1e86", explain: "#6a2be0", host: "#0bbcd0", activate: "#ff6a44" };

  var root = document.documentElement;
  var canViewTransition = false; // RC5: direct state change; no generated-looking transition choreography

  function transitionUpdate(kind, update) {
    if (!canViewTransition) { update(); return null; }
    root.dataset.vt = kind;
    var transition = document.startViewTransition(update);
    if (transition.types) {
      transition.types.add("season-zero");
      transition.types.add(kind);
    }
    transition.finished.finally(function () { delete root.dataset.vt; });
    return transition;
  }
  var stage = document.getElementById("onair");
  var tabs = Array.prototype.slice.call(document.querySelectorAll(".tune [role=tab]"));
  var current = "host";

  /* ---------------- STAGE WAKE ---------------- */
  requestAnimationFrame(function () { stage.classList.add("woke"); });

  /* ---------------- media helpers ---------------- */
  function playVideo(v) {
    if (!v) return;
    if (v.dataset.src && !v.getAttribute("src")) {
      v.setAttribute("src", v.dataset.src);   // lazy: nothing loads until tuned to
      v.load();
    }
    /* RC10.2: let the curated Host poster land as the first casting read,
       then cue the real motion. This is a title-sequence beat, not a new UI. */
    if (v.id === "v-host" && !reduce.matches && !v.dataset.firstCueDone) {
      if (v.dataset.firstCueScheduled) return;
      v.dataset.firstCueScheduled = "true";
      v.pause();
      window.setTimeout(function () {
        v.dataset.firstCueDone = "true";
        delete v.dataset.firstCueScheduled;
        var fig = v.closest(".signal");
        if (!fig || !fig.hasAttribute("data-active")) return;
        var delayed = v.play();
        if (delayed && delayed.catch) delayed.catch(function () { /* poster stands in */ });
      }, 1150);
      return;
    }
    var p = v.play();
    if (p && p.catch) p.catch(function () { /* poster stands in, nothing breaks */ });
  }
  function pauseVideo(v) { if (v && !v.paused) v.pause(); }

  /* ---------------- TUNE: native view-transition signal change -------- */
  function applyTune(lane, focusTab) {
    current = lane;
    root.style.setProperty("--signal", COLORS[lane]);
    stage.dataset.activeLane = lane;

    document.querySelectorAll(".signal").forEach(function (fig) {
      var on = fig.dataset.lane === lane;
      if (on) { fig.setAttribute("data-active", ""); } else { fig.removeAttribute("data-active"); }
      fig.querySelectorAll("video").forEach(function (v) { on ? playVideo(v) : pauseVideo(v); });
    });

    tabs.forEach(function (t) {
      var on = t.dataset.lane === lane;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      if (on && focusTab) t.focus();
    });

    var s = SIGNALS[lane];
    set("lt-lane", s.lane.charAt(0) + s.lane.slice(1).toLowerCase()); set("lt-client", "· " + s.client); set("lt-title", s.displayTitle || s.title);
    set("lt-stamp", s.stamp); set("lt-note", s.note);
    set("cast-lanes", s.castShort || s.cast);
    set("sigbug-label", s.lane);
    var tr = stage.querySelector(".tuner-readout"); if (tr) tr.textContent = "TUNE 0" + (LANES.indexOf(lane)+1) + " · " + s.lane;
    set("mon-src", SRCLABEL[lane]);
    var field = document.getElementById("field");
    if (field) {
      field.innerHTML = "";
      STRIPS[lane].slice(0, 3).forEach(function (pair, i) {
        var f = document.createElement("figure");
        f.className = "f" + (i + 1);
        var img = document.createElement("img");
        img.src = "assets/img/" + pair[0];
        img.loading = i === 0 ? "eager" : "lazy";
        img.decoding = "async";
        img.alt = "";
        f.appendChild(img);
        field.appendChild(f);
      });
    }
    if (drawer && drawer.hasAttribute("data-open")) fillDrawer(lane);
  }

  function tune(lane, focusTab) {
    if (!SIGNALS[lane]) return;
    var previous = current;
    var direction = LANES.indexOf(lane) < LANES.indexOf(previous) ? "back" : "forward";
    var alreadyActive = previous === lane && document.querySelector('.signal[data-lane="' + lane + '"][data-active]');
    if (alreadyActive) { applyTune(lane, focusTab); return; }
    transitionUpdate(direction, function () { applyTune(lane, focusTab); });
  }
  function set(id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; }

  tabs.forEach(function (t) {
    t.tabIndex = t.getAttribute("aria-selected") === "true" ? 0 : -1;
    t.addEventListener("click", function () { tune(t.dataset.lane, false); });
    t.addEventListener("keydown", function (e) {
      var i = LANES.indexOf(current), n = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % LANES.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i + LANES.length - 1) % LANES.length;
      else if (e.key === "Home") n = 0;
      else if (e.key === "End") n = LANES.length - 1;
      if (n !== null) { e.preventDefault(); tune(LANES[n], true); }
    });
  });

  /* ---------------- CUE: daylight / broadcast ---------------- */
  function applyCue(next) {
    var on = next === "broadcast";
    root.setAttribute("data-cue", next);
    ["btn-cue", "btn-cue-m"].forEach(function (id) {
      var b = document.getElementById(id);
      if (b) b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    ["cue-label", "cue-label-m"].forEach(function (id) {
      var l = document.getElementById(id);
      if (l) l.textContent = on ? "Return to daylight" : "Go on air";
    });
    var tc = document.getElementById("cuestate");
    if (tc) { tc.textContent = on ? "ON AIR" : "DAYLIGHT"; tc.classList.toggle("live", on); }
  }
  function toggleCue() {
    var next = root.getAttribute("data-cue") === "broadcast" ? "daylight" : "broadcast";
    transitionUpdate("cue", function () { applyCue(next); });
  }
  ["btn-cue", "btn-cue-m"].forEach(function (id) {
    var b = document.getElementById(id);
    if (b) b.addEventListener("click", toggleCue);
  });

  /* ---------------- TIMECODE ---------------- */
  var tcEl = document.getElementById("tc"), t0 = Date.now();
  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    if (!tcEl) return;
    var ms = Date.now() - t0;
    tcEl.textContent = "00:" + pad(Math.floor(ms / 60000) % 60) + ":" + pad(Math.floor(ms / 1000) % 60) + ":" + pad(Math.floor((ms % 1000) / 40));
  }
  if (tcEl && !reduce.matches && getComputedStyle(tcEl.closest('.fc-timecode')).display !== 'none') setInterval(tick, 250);
  else if (tcEl) tcEl.textContent = "00:00:00:00";

  /* ---------------- OPEN: project file drawer ---------------- */
  var drawer = document.getElementById("drawer");
  var scrim = document.getElementById("drawer-scrim");
  var lastFocus = null;

  function fillDrawer(lane) {
    var s = SIGNALS[lane];
    document.getElementById("drawer-lane").textContent = s.lane + " · " + s.stamp;
    document.getElementById("drawer-title").textContent = s.title;
    var dl = document.getElementById("drawer-fields");
    dl.innerHTML = "";
    Object.keys(s.file).forEach(function (k) {
      var wrap = document.createElement("div");
      var dt = document.createElement("dt"); dt.textContent = k;
      var dd = document.createElement("dd"); dd.textContent = s.file[k];
      wrap.appendChild(dt); wrap.appendChild(dd); dl.appendChild(wrap);
    });
    var grid = document.getElementById("drawer-evidence");
    grid.innerHTML = "";
    s.evidence.forEach(function (f) {
      var img = document.createElement("img");
      img.src = "assets/img/" + f;
      img.loading = "lazy"; img.decoding = "async";
      img.alt = "Frame from " + s.title;
      grid.appendChild(img);
    });
  }

  function openDrawer(lane, source) {
    var targetLane = SIGNALS[lane] ? lane : current;
    lastFocus = source || document.activeElement;
    fillDrawer(targetLane);
    drawer.hidden = false; scrim.hidden = false;
    requestAnimationFrame(function () {
      drawer.setAttribute("data-open", ""); scrim.setAttribute("data-open", "");
      document.getElementById("drawer-close").focus();
    });
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    drawer.removeAttribute("data-open"); scrim.removeAttribute("data-open");
    document.body.style.overflow = "";
    setTimeout(function () { drawer.hidden = true; scrim.hidden = true; }, reduce.matches ? 0 : 420);
    if (lastFocus) lastFocus.focus();
  }

  document.getElementById("btn-open").addEventListener("click", function () { openDrawer(current, this); });
  document.querySelectorAll(".project-trigger").forEach(function (b) {
    b.addEventListener("click", function () { openDrawer(b.dataset.openLane, b); });
  });
  document.getElementById("drawer-close").addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);
  document.getElementById("drawer-watch").addEventListener("click", closeDrawer);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && drawer.hasAttribute("data-open")) { e.preventDefault(); closeDrawer(); }
    if (e.key === "Tab" && drawer.hasAttribute("data-open")) {
      var f = drawer.querySelectorAll("a[href],button:not([disabled])");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------- PLAYER: modal playback from Watch Lauren ------------- */
  var player = document.getElementById("player");
  var playerScrim = document.getElementById("player-scrim");
  var pv = document.getElementById("player-video");
  var playerLast = null;
  var playerLane = "host";

  function openPlayer(btn) {
    playerLast = btn;
    playerLane = btn.dataset.lane || "host";
    var card = btn.closest(".clip, .route");
    if (card) player.style.setProperty("--c", getComputedStyle(card).getPropertyValue("--c"));
    document.getElementById("player-title").textContent = btn.dataset.title || "";
    document.getElementById("player-stamp").textContent = btn.dataset.stamp || "";
    document.getElementById("player-note").textContent = btn.dataset.note || "";
    pv.poster = btn.dataset.poster || "";
    var posterUrl = btn.dataset.poster ? new URL(btn.dataset.poster, document.baseURI).href : "";
    player.style.setProperty("--poster", posterUrl ? "url('" + posterUrl + "')" : "none");
    var startAt = parseFloat(btn.dataset.start || "0") || 0;
    pv.muted = true;
    pv.addEventListener("loadedmetadata", function seekPlayerStart() {
      function beginPlayback() {
        if (!reduce.matches) {
          var loadedPlay = pv.play();
          if (loadedPlay && loadedPlay.catch) loadedPlay.catch(function () { /* poster and controls stand in */ });
        }
      }
      if (startAt > 0 && isFinite(pv.duration)) {
        pv.addEventListener("seeked", beginPlayback, { once: true });
        pv.currentTime = Math.min(startAt, Math.max(0, pv.duration - .25));
      } else {
        beginPlayback();
      }
    }, { once: true });
    pv.src = btn.dataset.video;
    pv.load();
    player.hidden = false; playerScrim.hidden = false;
    requestAnimationFrame(function () {
      player.setAttribute("data-open", ""); playerScrim.setAttribute("data-open", "");
      document.getElementById("player-close").focus();
    });
    document.body.style.overflow = "hidden";
    stage.querySelectorAll("video").forEach(pauseVideo);
  }
  function closePlayer(returnFocus) {
    if (returnFocus === undefined) returnFocus = true;
    pv.pause();
    player.removeAttribute("data-open"); playerScrim.removeAttribute("data-open");
    document.body.style.overflow = "";
    setTimeout(function () {
      player.hidden = true; playerScrim.hidden = true;
      pv.removeAttribute("src"); pv.load();
    }, reduce.matches ? 0 : 340);
    if (returnFocus && playerLast) playerLast.focus();
  }

  document.querySelectorAll("button.playable, button.tape-action.playable").forEach(function (b) {
    b.addEventListener("click", function (e) { e.preventDefault(); openPlayer(b); });
  });
  document.getElementById("player-close").addEventListener("click", function () { closePlayer(true); });
  playerScrim.addEventListener("click", function () { closePlayer(true); });
  player.addEventListener("click", function (e) { if (e.target === player) closePlayer(true); });
  document.getElementById("player-open-file").addEventListener("click", function () {
    var trigger = playerLast;
    var lane = playerLane;
    closePlayer(false);
    setTimeout(function () { openDrawer(lane, trigger); }, reduce.matches ? 0 : 360);
  });

  document.addEventListener("keydown", function (e) {
    if (!player.hasAttribute("data-open")) return;
    if (e.key === "Escape") { e.preventDefault(); closePlayer(true); return; }
    if (e.key === "Tab") {
      var f = player.querySelectorAll("button:not([disabled]),video[controls],a[href]");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------- GALLERY: approved Scrambled Up set photography ------- */
  var GALLERIES = {
    scrambled: {
      title: "Scrambled Up",
      items: [
        ["scrambled-podium-smile.webp", "Lauren smiling at her Scrambled Up podium after filming."],
        ["scrambled-host-new.webp", "Lauren with the Scrambled Up host on the television set."],
        ["scrambled-peace-new.webp", "Lauren flashing a peace sign behind her Scrambled Up podium."],
        ["scrambled-button.webp", "Lauren at the game-show buzzer during her Scrambled Up set session."],
        ["scrambled-podium-alt.webp", "Lauren on the Scrambled Up set, camera-ready and relaxed."],
        ["scrambled-step.webp", "Lauren on the Scrambled Up game-show stage."]
      ]
    }
  };
  var gallery = document.getElementById("gallery");
  var galleryScrim = document.getElementById("gallery-scrim");
  var galleryLast = null;

  function openGallery(btn) {
    var data = GALLERIES[btn.dataset.gallery];
    if (!data) return;
    galleryLast = btn;
    document.getElementById("gallery-title").textContent = data.title;
    var grid = document.getElementById("gallery-grid");
    grid.innerHTML = "";
    data.items.forEach(function (item, i) {
      var fig = document.createElement("figure");
      var img = document.createElement("img");
      img.src = "assets/img/" + item[0];
      img.alt = item[1];
      img.loading = i === 0 ? "eager" : "lazy";
      img.decoding = "async";
      var cap = document.createElement("figcaption");
      cap.textContent = item[1];
      fig.appendChild(img); fig.appendChild(cap); grid.appendChild(fig);
    });
    gallery.hidden = false; galleryScrim.hidden = false;
    requestAnimationFrame(function () {
      gallery.setAttribute("data-open", ""); galleryScrim.setAttribute("data-open", "");
      document.getElementById("gallery-close").focus();
    });
    document.body.style.overflow = "hidden";
  }
  function closeGallery() {
    gallery.removeAttribute("data-open"); galleryScrim.removeAttribute("data-open");
    document.body.style.overflow = "";
    setTimeout(function () { gallery.hidden = true; galleryScrim.hidden = true; }, reduce.matches ? 0 : 320);
    if (galleryLast) galleryLast.focus();
  }
  document.querySelectorAll(".gallery-trigger").forEach(function (b) {
    b.addEventListener("click", function () { openGallery(b); });
  });
  document.getElementById("gallery-close").addEventListener("click", closeGallery);
  galleryScrim.addEventListener("click", closeGallery);
  gallery.addEventListener("click", function (e) { if (e.target === gallery) closeGallery(); });
  document.addEventListener("keydown", function (e) {
    if (!gallery.hasAttribute("data-open")) return;
    if (e.key === "Escape") { e.preventDefault(); closeGallery(); return; }
    if (e.key === "Tab") {
      var f = gallery.querySelectorAll("button:not([disabled]),a[href]");
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------- R5 WORLD LAYER --------------------------------------- */
  /* page progress: provides a native-feeling broadcast timeline everywhere */
  var scrollTicking = false;
  function updatePageProgress() {
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    root.style.setProperty("--page-progress", Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4));
    scrollTicking = false;
  }
  window.addEventListener("scroll", function () {
    if (!scrollTicking) { scrollTicking = true; requestAnimationFrame(updatePageProgress); }
  }, { passive: true });
  updatePageProgress();

  /* RC5: pointer-following glow removed. The hero uses fixed, authored light. */

  /* section world dial and active masthead location */
  var worldSections = Array.prototype.slice.call(document.querySelectorAll("[data-world-index][data-world-label]"));
  var worldIndex = document.getElementById("world-index");
  var worldLabel = document.getElementById("world-label");
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.rig nav a[href^="#"]'));
  if ("IntersectionObserver" in window && worldSections.length) {
    var worldObserver = new IntersectionObserver(function (entries) {
      var visible = entries.filter(function (e) { return e.isIntersecting; }).sort(function (a,b) { return b.intersectionRatio-a.intersectionRatio; });
      if (!visible.length) return;
      var el = visible[0].target;
      if (worldIndex) worldIndex.textContent = el.dataset.worldIndex;
      if (worldLabel) worldLabel.textContent = el.dataset.worldLabel;
      root.dataset.world = el.dataset.worldLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      navLinks.forEach(function (link) {
        var active = link.getAttribute("href") === "#" + el.id;
        if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-30% 0px -48% 0px", threshold: [0.02,.12,.28,.5] });
    worldSections.forEach(function (section) { worldObserver.observe(section); });
  }

  /* scroll-linked animation fallback for browsers without animation-timeline */
  if (!(window.CSS && CSS.supports && CSS.supports("animation-timeline: view()"))) {
    root.classList.add("no-scroll-timeline");
    if ("IntersectionObserver" in window) {
      var revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.setAttribute("data-revealed", ""); observer.unobserve(entry.target); }
        });
      }, { rootMargin: "0px 0px -8%", threshold: .08 });
      document.querySelectorAll(".world-reveal").forEach(function (el) { revealObserver.observe(el); });
    } else {
      document.querySelectorAll(".world-reveal").forEach(function (el) { el.setAttribute("data-revealed", ""); });
    }
  }

  /* proof-tape depth and light response */
  if (window.matchMedia("(pointer:fine)").matches && !reduce.matches) {
    document.querySelectorAll(".tilt-surface").forEach(function (surface) {
      var raf = 0;
      surface.addEventListener("pointermove", function (e) {
        if (raf) return;
        raf = requestAnimationFrame(function () {
          var r = surface.getBoundingClientRect();
          var x = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
          var y = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
          surface.style.setProperty("--tilt-y", ((x - .5) * 5).toFixed(2) + "deg");
          surface.style.setProperty("--tilt-x", ((.5 - y) * 4).toFixed(2) + "deg");
          surface.style.setProperty("--spot-x", (x * 100).toFixed(1) + "%");
          surface.style.setProperty("--spot-y", (y * 100).toFixed(1) + "%");
          surface.setAttribute("data-tilting", "");
          raf = 0;
        });
      }, { passive: true });
      surface.addEventListener("pointerleave", function () {
        surface.style.setProperty("--tilt-x", "0deg");
        surface.style.setProperty("--tilt-y", "0deg");
        surface.removeAttribute("data-tilting");
      });
    });
  }

  /* RC5: reactive signal-field canvas removed from execution to reduce decorative motion and CPU work. */

  /* ---------------- pause offscreen video, save battery ---------------- */
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var v = en.target.querySelector('.signal[data-active] video');
        if (!en.isIntersecting) {
          stage.querySelectorAll("video").forEach(pauseVideo);
        } else if (v) { playVideo(v); }
      });
    }, { threshold: 0.12 }).observe(stage);
  }

  /* ---------------- boot ---------------- */
  root.style.setProperty("--signal", COLORS[current]);
  tune("host", false);
})();
