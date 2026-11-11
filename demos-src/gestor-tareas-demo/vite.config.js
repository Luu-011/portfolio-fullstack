import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' hace que la carpeta dist/ funcione desde cualquier ruta
// (por ejemplo /demos/gestor-tareas/) sin tocar nada más.
export default defineConfig({
  base: './',
  plugins: [react()],
});
