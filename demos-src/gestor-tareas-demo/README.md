# Gestor de tareas (demo)

Tablero de tareas con tres columnas (Por hacer, En curso, Hecho), arrastrar y soltar y guardado local.
Es independiente del resto del sistema: no necesita backend ni base de datos.

**Tecnologías:** React 19 · JavaScript · Web Storage API · Vite

## Probarlo

```bash
npm install
npm run dev        # http://localhost:5173
```

## Qué hace

- Agregar tareas con título y prioridad (alta, media, baja). No deja guardar títulos vacíos.
- Arrastrar tarjetas entre columnas y reordenarlas dentro de una columna (drag and drop nativo del navegador).
- Botones de flecha para mover tarjetas con teclado o desde el celular, donde arrastrar no siempre funciona.
- Editar una tarea, eliminarla (con "Deshacer" durante 6 segundos) y limpiar todas las hechas.
- Barra de progreso con las tareas hechas.
- **Guardado local:** todo se guarda en `localStorage` bajo la clave `gestor-tareas:v1`.
  Si abrís la página en dos pestañas, los cambios de una aparecen en la otra (evento `storage`).
- La primera vez carga tareas de ejemplo. El botón "Restablecer demo" vuelve a ese estado.

## Cómo conectarlo a la página de proyectos

**Opción 1: carpeta lista para publicar.** La carpeta `dist/` ya viene compilada y usa rutas relativas,
así que funciona desde cualquier subcarpeta (por ejemplo `/demos/gestor-tareas/`). Copiala al servidor y enlazala
o ponela en un `<iframe>`:

```html
<a href="/demos/gestor-tareas/">Probar demo</a>
<iframe src="/demos/gestor-tareas/" title="Gestor de tareas" style="width:100%;height:700px;border:0"></iframe>
```

> `dist/index.html` no se puede abrir con doble clic (el navegador bloquea los módulos desde `file://`).
> Hace falta cualquier servidor estático, por ejemplo `npx serve dist`.

Para regenerarla después de tocar el código: `npm run build`.

**Opción 2: como componente dentro de un proyecto React.** Copiá la carpeta `src/` (sin `main.jsx`) e importá el componente:

```jsx
import GestorTareas from './gestor-tareas/GestorTareas.jsx';
// instalar también: npm i @fontsource-variable/bricolage-grotesque
<GestorTareas />
```

Los estilos están acotados a la clase `.gt` y todas las clases llevan el prefijo `gt-`, así que no pisan los de la página.
Para usar sus propios colores, cambiá las variables CSS que están al principio de `src/estilos.css`.

## Estructura

```
src/
  main.jsx              Punto de entrada (monta <GestorTareas />)
  GestorTareas.jsx      Estado general, guardado y arrastre
  Columna.jsx           Columna y zona de soltado
  Tarjeta.jsx           Tarjeta con edición en el lugar
  FormularioNueva.jsx   Alta de tareas
  datos.js              Columnas, tareas de ejemplo y función moverTarea
  almacenamiento.js     Lectura y escritura en localStorage
  estilos.css           Estilos
```
