// Měnící se slovo v nadpisu.
// Každé písmeno se chvíli „šifruje“ a pak se ustálí, zleva doprava s malým rozptylem.

const CHARS = '-_~`!@#$%^&*()+=[]{}|;:,.<>?';
const HOLD_MS = 2800; // jak dlouho slovo zůstane, než přijde další
const FRAME_MS = 34; // asi 30 snímků za vteřinu, ať je šifra čitelná

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

const randomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

function scrambleTo(el: HTMLElement, text: string): Promise<void> {
  const target = Array.from(text);
  const step = Math.min(48, 560 / Math.max(target.length, 1));
  const revealAt = target.map((_, i) => 60 + i * step + Math.random() * 110);
  const start = performance.now();
  let last = 0;

  return new Promise((resolve) => {
    const frame = (now: number) => {
      if (now - last >= FRAME_MS) {
        last = now;
        const t = now - start;
        let done = true;
        el.innerHTML = target
          .map((ch, i) => {
            if (ch === ' ' || t >= revealAt[i]) return escapeHtml(ch);
            done = false;
            return `<span class="sc">${escapeHtml(randomChar())}</span>`;
          })
          .join('');
        if (done) {
          el.textContent = text;
          resolve();
          return;
        }
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  });
}

export function initScramble() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll<HTMLElement>('[data-scramble]').forEach((root) => {
    const out = root.querySelector<HTMLElement>('[data-scramble-out]');
    const words: string[] = JSON.parse(root.dataset.words || '[]');
    if (!out || words.length < 2) return;

    // Nadpis si podrží výšku nejdelšího slova, aby text pod ním neposkakoval.
    const heading = root.closest<HTMLElement>('h1, h2, h3') ?? root;
    const reserveHeight = () => {
      const current = out.textContent ?? '';
      heading.style.minHeight = '';
      let max = 0;
      for (const w of words) {
        out.textContent = w;
        max = Math.max(max, heading.getBoundingClientRect().height);
      }
      out.textContent = current;
      heading.style.minHeight = `${Math.ceil(max)}px`;
    };
    document.fonts.ready.then(reserveHeight);
    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(reserveHeight, 150);
    });

    let index = 0;
    let visible = true;

    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }).observe(root);

    const next = async () => {
      if (!reduce.matches && visible && !document.hidden) {
        index = (index + 1) % words.length;
        await scrambleTo(out, words[index]);
      }
      window.setTimeout(next, HOLD_MS);
    };

    window.setTimeout(next, HOLD_MS);
  });
}
