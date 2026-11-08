# Verificación de la integración

Revisión realizada el 7 de noviembre de 2026.

- `npm install`: dependencias instaladas y lockfile generado.
- `npm run verify`: correcto para las nueve vistas, los siete módulos principales y las 36 imágenes locales. La comparación incluye el contenido completo, las etiquetas y clases visuales originales, además de los modales situados fuera de `main`.
- `npm run build`: correcto con Vite 7.3.7, sin advertencias; genera `dist/` con carga separada de las vistas por ruta.
- Navegación comprobada en navegador para las nueve pantallas. La revisión final no produjo errores ni advertencias en consola.
- Interacciones comprobadas: carrusel de Inicio, avance y cierre de la guía, un único incremento por clic en un «me gusta» con StrictMode, disponibilidad condicional de Trueques y Apoyo Solidario, apertura del registro de Emprendimientos, apertura del modal de Eventos, pestaña de administración y aprobación local en Comunidades, modal de completar publicación de Mi Perfil y un mensaje local en el chat sin duplicarse.
- Las pruebas se realizaron sobre datos de demostración en memoria. No hubo operaciones de backend ni mensajes a terceros.

La preservación del diseño se comprueba mediante la comparación del marcado y clases, las capturas originales en `public/assets/referencias/` y una revisión visual de la aplicación. No se afirma una comparación automatizada de píxeles para todos los tamaños de pantalla.
