/* ============================================
   HERO CANVAS - Abstract Cinematic Animation
   Mesh gradient with floating particles
   ============================================ */

(function () {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let animationId;
  let time = 0;

  // Check reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Color palette (from design system)
  const colors = {
    obsidian: [11, 13, 16],
    petrol: [15, 94, 110],
    bone: [243, 240, 234],
    steel: [124, 134, 147],
  };

  // Particles
  const particles = [];
  const PARTICLE_COUNT = 60;

  // Orbs (large gradient blobs)
  const orbs = [];
  const ORB_COUNT = 4;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.2 - 0.1,
        opacity: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  function initOrbs() {
    orbs.length = 0;

    orbs.push({
      x: width * 0.3,
      y: height * 0.4,
      radius: Math.min(width, height) * 0.35,
      color: colors.petrol,
      opacity: 0.08,
      speedX: 0.15,
      speedY: 0.1,
      phase: 0,
    });

    orbs.push({
      x: width * 0.7,
      y: height * 0.6,
      radius: Math.min(width, height) * 0.3,
      color: colors.petrol,
      opacity: 0.05,
      speedX: -0.12,
      speedY: -0.08,
      phase: Math.PI * 0.5,
    });

    orbs.push({
      x: width * 0.5,
      y: height * 0.3,
      radius: Math.min(width, height) * 0.25,
      color: colors.bone,
      opacity: 0.025,
      speedX: 0.08,
      speedY: 0.12,
      phase: Math.PI,
    });

    orbs.push({
      x: width * 0.6,
      y: height * 0.7,
      radius: Math.min(width, height) * 0.2,
      color: colors.steel,
      opacity: 0.04,
      speedX: -0.1,
      speedY: 0.06,
      phase: Math.PI * 1.5,
    });
  }

  function drawOrb(orb, t) {
    const cx = orb.x + Math.sin(t * 0.0005 + orb.phase) * 40 * orb.speedX * 100;
    const cy = orb.y + Math.cos(t * 0.0004 + orb.phase) * 30 * orb.speedY * 100;

    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.radius);
    const [r, g, b] = orb.color;
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${orb.opacity})`);
    gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, ${orb.opacity * 0.4})`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
  }

  function drawParticle(p, t) {
    const pulseOpacity = p.opacity + Math.sin(t * 0.002 + p.pulse) * 0.15;
    const alpha = Math.max(0, Math.min(1, pulseOpacity));

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${colors.bone[0]}, ${colors.bone[1]}, ${colors.bone[2]}, ${alpha})`;
    ctx.fill();
  }

  function updateParticles() {
    for (const p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
    }
  }

  function draw() {
    time += 16;

    // Clear
    ctx.fillStyle = `rgb(${colors.obsidian[0]}, ${colors.obsidian[1]}, ${colors.obsidian[2]})`;
    ctx.fillRect(0, 0, width, height);

    // Draw orbs
    for (const orb of orbs) {
      drawOrb(orb, time);
    }

    // Draw particles
    for (const p of particles) {
      drawParticle(p, time);
    }

    updateParticles();

    animationId = requestAnimationFrame(draw);
  }

  function drawStatic() {
    ctx.fillStyle = `rgb(${colors.obsidian[0]}, ${colors.obsidian[1]}, ${colors.obsidian[2]})`;
    ctx.fillRect(0, 0, width, height);

    for (const orb of orbs) {
      drawOrb(orb, 0);
    }

    for (const p of particles) {
      drawParticle(p, 0);
    }
  }

  function init() {
    resize();
    initParticles();
    initOrbs();

    if (prefersReducedMotion) {
      drawStatic();
    } else {
      draw();
    }
  }

  // Throttled resize
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (animationId) cancelAnimationFrame(animationId);
      init();
    }, 200);
  });

  // Pause when not visible
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) {
      if (animationId) cancelAnimationFrame(animationId);
    } else if (!prefersReducedMotion) {
      draw();
    }
  });

  init();
})();
