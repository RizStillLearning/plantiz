// Inline stroke icons on a 24px grid. Every icon here is decorative: the text
// beside it carries the meaning, so each one is hidden from assistive tech.
const icons = {
  leaf: (
    <>
      <path d="M4.5 19.5c0-9 5.5-15 15-15 0 9.5-6 15-15 15Z" />
      <path d="M4.5 19.5 14 10" />
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>
  ),
  shieldCheck: (
    <>
      <path d="M12 3.5 5 6.5v5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9v-5Z" />
      <path d="m9 12.2 2.1 2.1 4.1-4.3" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="3.75" />
      <path d="M12 3v1.75M12 19.25V21M3 12h1.75M19.25 12H21M5.64 5.64l1.24 1.24M17.12 17.12l1.24 1.24M5.64 18.36l1.24-1.24M17.12 6.88l1.24-1.24" />
    </>
  ),
  droplet: <path d="M12 3.5c3.2 3.9 5.5 7 5.5 10a5.5 5.5 0 0 1-11 0c0-3 2.3-6.1 5.5-10Z" />,
  sprout: (
    <>
      <path d="M12 20.5v-7.5" />
      <path d="M12 13c0-3.6-2.6-6.5-7-6.5 0 3.6 2.6 6.5 7 6.5Z" />
      <path d="M12 11c0-3 2.3-5.5 6.5-5.5 0 3-2.3 5.5-6.5 5.5Z" />
      <path d="M8 20.5h8" />
    </>
  ),
  thermometer: (
    <>
      <path d="M14 14.5V5.5a2 2 0 1 0-4 0v9a4 4 0 1 0 4 0Z" />
      <path d="M12 10v7" />
    </>
  ),
  height: (
    <>
      <path d="M12 3.5v17" />
      <path d="M8.5 7 12 3.5 15.5 7" />
      <path d="m8.5 17 3.5 3.5 3.5-3.5" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </>
  ),
  home: (
    <>
      <path d="M4 10.5 12 4l8 6.5" />
      <path d="M6 9v10.5h12V9" />
      <path d="M10 19.5v-5h4v5" />
    </>
  ),
  book: (
    <>
      <path d="M3 5.5c2.5-1.3 5.5-1.3 9 .7 3.5-2 6.5-2 9-.7V19c-2.5-1.3-5.5-1.3-9 .7-3.5-2-6.5-2-9-.7Z" />
      <path d="M12 6.2v13.5" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </>
  ),
  camera: (
    <>
      <path d="M3.5 8.5a2 2 0 0 1 2-2h2l1.5-2h6l1.5 2h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" />
      <circle cx="12" cy="13" r="3.5" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15V4.5" />
      <path d="m7.5 9 4.5-4.5L16.5 9" />
      <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
    </>
  ),
  alert: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V13" />
      <path d="M12 16.5h.01" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-4.4-4.4" />
    </>
  ),
  chevronDown: <path d="m6 9 6 6 6-6" />,
  close: <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />,
}

export default function Icon({ name, size = 20, className }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {icons[name]}
    </svg>
  )
}
