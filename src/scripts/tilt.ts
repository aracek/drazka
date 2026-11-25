// Vstupenky se lehce naklání za kurzorem a odlesk jde za ním.
// Jen na počítači s myší a jen když člověk nemá vypnuté animace.

const MAX_DEG = 6;
const HOVER_SCALE = 1.018;

export function initTilt() {
  const can = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');

  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
    let frame = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      el.classList.remove('is-tilting');
      el.style.transform = '';
    };

    el.addEventListener('pointermove', (e) => {
      if (!can.matches || e.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width; // 0 až 1
        const y = (e.clientY - r.top) / r.height;
        const rotY = (x - 0.5) * 2 * MAX_DEG;
        const rotX = (0.5 - y) * 2 * MAX_DEG;
        el.classList.add('is-tilting');
        el.style.transform = `rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale(${HOVER_SCALE})`;
        el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
      });
    });

    el.addEventListener('pointerleave', reset);
    can.addEventListener('change', reset);
  });
}
