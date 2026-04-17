/**
 * loom-weave.js — viewport-fixed weaving background with scroll-driven weave.
 *
 * Warp threads (vertical): gentle sway, fill viewport top to bottom.
 * Weft threads (horizontal paths): flow like real threads with drape + animated
 * drift. Each weft has a scroll-linked "progress" controlling how far it has
 * been drawn across the warp; progress is globally driven by scroll position
 * (top = 0%, bottom = 100%) with per-weft stagger so threads weave in bands.
 */
(function () {
  const WARP_COUNT = 26;
  const WEFT_COUNT = 20;
  const THREAD_W = 1.1;
  const WARP_ALPHA = 0.14;
  const WEFT_ALPHA = 0.18;
  const WEFT_STAGGER = 0.60;

  // palette
  const HUES = [
    { pos: 0.00, col: "#2196F3" },
    { pos: 0.22, col: "#66B3FF" },
    { pos: 0.44, col: "#4EC9B0" },
    { pos: 0.66, col: "#C19CD8" },
    { pos: 0.85, col: "#FFBD2E" },
    { pos: 1.00, col: "#2196F3" },
  ];

  const svgNS = "http://www.w3.org/2000/svg";
  const host = document.getElementById("loom-weave");
  if (!host) return;

  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("class", "weave-svg");
  svg.setAttribute("preserveAspectRatio", "none");
  host.appendChild(svg);

  const defs = document.createElementNS(svgNS, "defs");
  svg.appendChild(defs);

  let W = 0, H = 0;
  const warps = [];   // { pathEl, x, color, seed }
  const wefts = [];   // { pathEl, overEls, y, startScroll, endScroll, seed, gradEl, crossings }

  function colorAt(t) {
    t = ((t % 1) + 1) % 1;
    for (let i = 0; i < HUES.length - 1; i++) {
      const a = HUES[i], b = HUES[i + 1];
      if (t >= a.pos && t <= b.pos) {
        const k = (t - a.pos) / (b.pos - a.pos);
        return mix(a.col, b.col, k);
      }
    }
    return HUES[HUES.length - 1].col;
  }
  function mix(c1, c2, k) {
    const p = h => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
    const [r1,g1,b1] = p(c1), [r2,g2,b2] = p(c2);
    return `rgb(${Math.round(r1+(r2-r1)*k)},${Math.round(g1+(g2-g1)*k)},${Math.round(b1+(b2-b1)*k)})`;
  }

  function buildWarp() {
    warps.forEach(w => w.pathEl.remove());
    warps.length = 0;
    const margin = 30;
    const span = W - margin * 2;
    for (let i = 0; i < WARP_COUNT; i++) {
      const x = margin + span * (i / (WARP_COUNT - 1));
      const color = colorAt(i / (WARP_COUNT - 1));
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("stroke", color);
      path.setAttribute("stroke-width", THREAD_W);
      path.setAttribute("stroke-opacity", WARP_ALPHA);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-linecap", "round");
      svg.appendChild(path);
      warps.push({ pathEl: path, x, color, seed: i * 1.3 });
    }
  }

  function buildWefts() {
    wefts.forEach(w => {
      w.pathEl.remove();
      w.overEls.forEach(o => o.el.remove());
      w.gradEl?.remove();
    });
    wefts.length = 0;

    const span = H;
    for (let i = 0; i < WEFT_COUNT; i++) {
      const y = (span * (i + 0.5)) / WEFT_COUNT;
      const gradId = `wg-${i}`;

      // scroll window during which this weft weaves
      const staggerTotal = (WEFT_COUNT - 1) * (1 - WEFT_STAGGER) + WEFT_STAGGER;
      const startScroll = (i * (1 - WEFT_STAGGER)) / staggerTotal;
      const endScroll = startScroll + (WEFT_STAGGER / staggerTotal);

      const offset = (i * 0.08 + 0.1) % 1;

      // gradient — userSpaceOnUse so it paints across the SVG width
      const lg = document.createElementNS(svgNS, "linearGradient");
      lg.setAttribute("id", gradId);
      lg.setAttribute("gradientUnits", "userSpaceOnUse");
      lg.setAttribute("x1", 0); lg.setAttribute("x2", W);
      lg.setAttribute("y1", y); lg.setAttribute("y2", y);
      for (let s = 0; s <= 6; s++) {
        const stop = document.createElementNS(svgNS, "stop");
        stop.setAttribute("offset", `${(s / 6) * 100}%`);
        stop.setAttribute("stop-color", colorAt(offset + s / 6));
        lg.appendChild(stop);
      }
      defs.appendChild(lg);

      // the flowing weft path
      const path = document.createElementNS(svgNS, "path");
      path.setAttribute("stroke", `url(#${gradId})`);
      path.setAttribute("stroke-width", THREAD_W);
      path.setAttribute("stroke-opacity", WEFT_ALPHA);
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("fill", "none");
      svg.appendChild(path);

      // precompute warp crossings (x positions + "is this row over or under")
      const crossings = warps.map((warp, wIdx) => ({
        warp,
        warpColor: warp.color,
        isOver: ((wIdx + i) % 2) === 0,
      }));

      // over-segments at every "over" crossing (drawn on top of the weft)
      const overEls = [];
      for (const c of crossings) {
        if (!c.isOver) continue;
        const over = document.createElementNS(svgNS, "line");
        over.setAttribute("stroke", c.warpColor);
        over.setAttribute("stroke-width", THREAD_W + 0.6);
        over.setAttribute("stroke-opacity", 0.85);
        over.style.opacity = "0";
        svg.appendChild(over);
        overEls.push({ el: over, warp: c.warp });
      }

      wefts.push({
        pathEl: path, overEls, y, startScroll, endScroll,
        seed: i * 2.1, gradEl: lg, crossings,
      });
    }
  }

  function measure() {
    W = document.documentElement.clientWidth;
    H = document.documentElement.clientHeight;
    svg.setAttribute("width", W);
    svg.setAttribute("height", H);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    buildWarp();
    buildWefts();
  }

  function getScrollFrac() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    return Math.max(0, Math.min(1, window.scrollY / maxScroll));
  }
  function ease(p) {
    return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
  }

  function buildWeftD(baseY, endX, time, seed) {
    if (endX <= 0) return `M 0 ${baseY}`;
    const steps = 40;
    const step = endX / steps;
    const sagAmp = 3.5;
    const waveAmp = 2.2;
    const waveFreq = 0.017;
    const timeFreq = 0.0006;

    let d = "";
    for (let i = 0; i <= steps; i++) {
      const x = i * step;
      const wave = Math.sin(x * waveFreq + time * timeFreq + seed) * waveAmp;
      const wave2 = Math.sin(x * waveFreq * 0.4 + time * timeFreq * 0.7 + seed * 1.3) * (waveAmp * 0.5);
      const t = i / steps;
      const sag = Math.sin(t * Math.PI) * sagAmp;
      const y = baseY + wave + wave2 + sag;
      d += (i === 0 ? "M" : " L") + " " + x.toFixed(2) + " " + y.toFixed(2);
    }
    return d;
  }

  function buildWarpD(baseX, time, seed) {
    const steps = 40;
    const stepY = H / steps;
    const waveAmp = 2.2;
    const wave2Amp = 1.1;
    const waveFreq = 0.017;
    const timeFreq = 0.0006;
    let d = "";
    for (let i = 0; i <= steps; i++) {
      const y = i * stepY;
      const wave = Math.sin(y * waveFreq + time * timeFreq + seed) * waveAmp;
      const wave2 = Math.sin(y * waveFreq * 0.4 + time * timeFreq * 0.7 + seed * 1.3) * wave2Amp;
      const x = baseX + wave + wave2;
      d += (i === 0 ? "M" : " L") + " " + x.toFixed(2) + " " + y.toFixed(2);
    }
    return d;
  }

  function warpXAt(baseX, y, time, seed) {
    const waveFreq = 0.017;
    const timeFreq = 0.0006;
    const wave = Math.sin(y * waveFreq + time * timeFreq + seed) * 2.2;
    const wave2 = Math.sin(y * waveFreq * 0.4 + time * timeFreq * 0.7 + seed * 1.3) * 1.1;
    return baseX + wave + wave2;
  }

  function updateWeftProgress(time) {
    const frac = getScrollFrac();
    for (const w of wefts) {
      let local = (frac - w.startScroll) / (w.endScroll - w.startScroll);
      local = Math.max(0, Math.min(1, local));
      const eased = ease(local);
      const endX = eased * W;

      w.pathEl.setAttribute("d", buildWeftD(w.y, endX, time, w.seed));

      for (const o of w.overEls) {
        const wx = warpXAt(o.warp.x, w.y, time, o.warp.seed);
        o.el.style.opacity = endX >= wx - 0.5 ? "0.85" : "0";
        const waveFreq = 0.017;
        const timeFreq = 0.0006;
        const wave = Math.sin(wx * waveFreq + time * timeFreq + w.seed) * 2.2;
        const wave2 = Math.sin(wx * waveFreq * 0.4 + time * timeFreq * 0.7 + w.seed * 1.3) * 1.1;
        const t = endX > 0 ? Math.min(1, wx / endX) : 0;
        const sag = Math.sin(t * Math.PI) * 3.5;
        const y = w.y + wave + wave2 + sag;
        o.el.setAttribute("x1", wx);
        o.el.setAttribute("x2", wx);
        o.el.setAttribute("y1", y - 4);
        o.el.setAttribute("y2", y + 4);
      }
    }
  }

  function tick(now) {
    for (const w of warps) {
      w.pathEl.setAttribute("d", buildWarpD(w.x, now, w.seed));
    }
    updateWeftProgress(now);
    requestAnimationFrame(tick);
  }

  const init = () => {
    measure();
    setTimeout(measure, 300);
    requestAnimationFrame(tick);
  };
  if (document.readyState === "complete") init();
  else window.addEventListener("load", init);

  let rz;
  window.addEventListener("resize", () => {
    clearTimeout(rz);
    rz = setTimeout(measure, 120);
  });

  window.__loomWeave = { measure };
})();
