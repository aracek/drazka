// Podle pražského času: „Otevřeno do 22:00“ nebo „Zavřeno · otevíráme zítra v 8:00“.
// Zvýrazní dnešek v otevírací době a schová akce, které už proběhly.

type Den = { den: string; zavreno?: boolean; od?: string; do?: string };

const EN_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const IN_DAY = ['v pondělí', 'v úterý', 've středu', 've čtvrtek', 'v pátek', 'v sobotu', 'v neděli'];

function pragueNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Prague',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return {
    dayIndex: EN_DAYS.indexOf(get('weekday')),
    minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')),
    date: `${get('year')}-${get('month')}-${get('day')}`,
  };
}

const toMinutes = (s?: string) => {
  if (!s) return NaN;
  const [h, m] = s.split(':').map(Number);
  return h * 60 + (m || 0);
};

const pretty = (s?: string) => (s ?? '').replace(/^0(\d)/, '$1'); // 08:00 → 8:00

const isOpenDay = (d?: Den) => !!d && !d.zavreno && !!d.od && !!d.do;

function statusText(hours: Den[], now: ReturnType<typeof pragueNow>): string {
  const today = hours[now.dayIndex];
  if (isOpenDay(today)) {
    const from = toMinutes(today.od);
    const to = toMinutes(today.do);
    if (now.minutes >= from && now.minutes < to) return `Otevřeno do ${pretty(today.do)}`;
    if (now.minutes < from) return `Zavřeno · otevíráme v ${pretty(today.od)}`;
  }
  for (let i = 1; i <= 7; i++) {
    const idx = (now.dayIndex + i) % 7;
    const day = hours[idx];
    if (isOpenDay(day)) {
      const when = i === 1 ? 'zítra' : IN_DAY[idx];
      return `Zavřeno · otevíráme ${when} v ${pretty(day.od)}`;
    }
  }
  return 'Dočasně zavřeno';
}

export function initStatus() {
  const now = pragueNow();

  const el = document.querySelector<HTMLElement>('[data-status]');
  if (el) {
    const hours: Den[] = JSON.parse(el.dataset.hours || '[]');
    if (hours.length === 7 && now.dayIndex >= 0) el.textContent = statusText(hours, now);
  }

  document.querySelector(`[data-day="${now.dayIndex}"]`)?.classList.add('is-today');

  // Web se znovu sestaví jen po změně v administraci, tak staré akce schováme tady.
  const tickets = document.querySelectorAll<HTMLElement>('[data-datum]');
  let left = 0;
  tickets.forEach((t) => {
    if ((t.dataset.datum ?? '') < now.date) t.remove();
    else left++;
  });
  if (tickets.length > 0 && left === 0) {
    document.querySelector<HTMLElement>('[data-tickets-empty]')?.removeAttribute('hidden');
  }
}
