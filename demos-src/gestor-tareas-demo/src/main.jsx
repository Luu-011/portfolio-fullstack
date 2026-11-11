import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import GestorTareas from './GestorTareas.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GestorTareas />
  </StrictMode>,
);
