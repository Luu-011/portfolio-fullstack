const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
};

export const IconoIzquierda = () => (
  <svg {...base}><path d="M15 5l-7 7 7 7" /></svg>
);
export const IconoDerecha = () => (
  <svg {...base}><path d="M9 5l7 7-7 7" /></svg>
);
export const IconoEditar = () => (
  <svg {...base}><path d="M4 20h4L19 9l-4-4L4 16v4z" /></svg>
);
export const IconoBorrar = () => (
  <svg {...base}><path d="M5 7h14M10 7V4h4v3M7 7l1 13h8l1-13" /></svg>
);
