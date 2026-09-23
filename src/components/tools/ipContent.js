/**
 * Plain-data copy for ip.jsx, kept in a .js (not .jsx) file so
 * scripts/routes.mjs — a plain Node script with no JSX transform — can
 * import it too, and reuse this exact copy in the prerendered /check-ip
 * snapshot instead of maintaining a second copy that can drift.
 */
export const IP_FAQS = [
  { q: 'What is a public IP address?', a: 'It is the address your internet provider assigns to your connection, and the one visible to every website and server you contact. Devices inside your home network have separate private addresses that the router translates on the way out.' },
  { q: 'How accurate is IP geolocation?', a: 'It is usually correct at country level and often at city level, but it maps to your provider’s registered network rather than your physical address. Mobile connections in particular can appear dozens of miles away, at whichever exchange handles the traffic.' },
  { q: 'What is the difference between IPv4 and IPv6?', a: 'IPv4 uses 32 bits, written as four numbers like 192.0.2.1, and its roughly 4.3 billion addresses ran out years ago. IPv6 uses 128 bits written in hexadecimal, giving an effectively unlimited supply. Most connections now support both.' },
  { q: 'Does my IP address change?', a: 'Usually yes. Most residential connections receive a dynamic address that can change when the router restarts or the lease expires. Business lines often pay for a static address that stays fixed.' },
  { q: 'Can someone find my home address from my IP?', a: 'Not from the address alone. Only your internet provider holds the link between an IP address and a subscriber, and they release it to law enforcement under legal process. Public geolocation databases resolve to a city or region at best.' },
  { q: 'How do I hide my IP address?', a: 'A VPN routes your traffic through its own server, so websites see that server’s address instead of yours. Tor and proxy services work similarly. Reload this page while connected to check it is taking effect.' },
];

export const IP_INTRO = 'Every device connected to the internet is reachable through an IP address. The one shown above is your public address — the one your router presents to the rest of the internet, and the one every website you visit can see. It is how responses find their way back to you.';

export const IP_EXTRA_PARAGRAPHS = [
  'Alongside the address itself, this page shows what any website can infer from it: an approximate city and region, the country, the time zone, and the internet provider that owns the address block. That geolocation is derived from provider registration records, so it typically resolves to a city or regional hub rather than a street.',
  'The lookup is read-only and nothing is stored. If you connect through a VPN or proxy, reload the page and you will see that provider’s address instead of your own, which is the quickest way to confirm the tunnel is actually working.',
];

export const IP_STEPS = [
  'Your public IP address is detected automatically when the page loads.',
  'Review the location, time zone, and provider details shown alongside it.',
  'Copy the address in one click when you need it for a whitelist or support ticket.',
  'Reload after connecting to a VPN to confirm the address has actually changed.',
];
