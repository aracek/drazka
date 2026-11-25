import { initScramble } from './scramble';
import { initTilt } from './tilt';
import { initStatus } from './status';

initScramble();
initTilt();
initStatus();

// Hlavička dostane tenkou linku, až se začne posouvat stránka.
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  const onScroll = () => header.toggleAttribute('data-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}
