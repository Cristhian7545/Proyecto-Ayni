# Ubicación y guía de Ayni

Configuración del mapa y guía de uso. Esta versión incluye archivos .env con los puertos y opciones de conexión preparados y las credenciales de MySQL y proveedores vacías. Cada instalación debe completar sus datos locales. Los .env.example también se conservan. Los archivos locales del propietario mantienen sus claves y no se sobrescriben para preparar la subida.

## Cómo usar la ubicación

1. Abre el formulario de Trueques, Apoyo Solidario o Emprendimientos.
2. Marca **Añadir una ubicación a esta publicación**. Es opcional.
3. Abre **Buscar dirección o elegir en el mapa**. Escribe una dirección y selecciona una sugerencia. Los resultados se limitan a Perú y se orientan a Lima o al punto elegido.
4. También puedes tocar el mapa, mover el marcador o pulsar **Usar mi ubicación actual**. El permiso de ubicación se pide solo al pulsar ese botón.
5. Revisa la dirección o escribe una referencia y publica. Si desmarcas la ubicación, no se envían la dirección ni las coordenadas.

Las sugerencias completan dirección y punto a la vez. Mover un punto elimina una dirección completada de otro lugar para evitar contradicciones; las referencias escritas manualmente se conservan. Una búsqueda atrasada no reemplaza un punto elegido después. Quitar punto elimina las coordenadas; puedes conservar una referencia escrita.

Sin conexión o si Google rechaza una solicitud, sigue disponible el campo de dirección manual y la alternativa de coordenadas. Las coordenadas elegidas se conservan en la cola offline existente. El buscador de Google necesita internet.

## Configuración Google Cloud

La clave existente se utiliza desde Frontend Ayni/.env mediante VITE_GOOGLE_MAPS_API_KEY; no se imprime ni se copia a la plantilla. No se editó tu .env en esta actualización.

En el proyecto de Google Cloud asociado a esa clave:

- Habilita **Maps JavaScript API** y **Places API (New)**.
- Habilita la facturación y permite ambas APIs en las restricciones de la clave.
- En sitios web autoriza http://127.0.0.1:5173/* y http://localhost:5173/*. Para preview, agrega los mismos sitios con puerto 4173.
- VITE_GOOGLE_MAPS_MAP_ID es opcional durante desarrollo; se usa DEMO_MAP_ID cuando no hay un ID configurado.

Reinicia npm run dev si cambias el .env. Si usas la PWA compilada, vuelve a ejecutar npm run build y npm run preview y acepta la actualización de la aplicación.

Se usa PlaceAutocompleteElement de Places API (New), con sugerencias navegables por teclado, búsqueda en español y selección con Enter sin enviar el formulario. No se añadió geocodificación inversa: tocar el mapa guarda un punto; puedes añadir una referencia manual.

Referencias oficiales: [autocompletado](https://developers.google.com/maps/documentation/javascript/place-autocomplete-new), [configuración de clave](https://developers.google.com/maps/documentation/javascript/get-api-key).

## Guía fácil de leer

Ocho pasos con frases cortas, tres instrucciones numeradas, ejemplos y botones con nombres claros. Texto de 16 px, espacio entre instrucciones y consejos con mejor contraste. El lector de pantalla recibe el título de cada paso mediante el foco; se mantienen el cierre, la navegación por teclado y el regreso al botón que abrió la guía. No se añadieron imágenes en esta actualización.

## Verificación

Pruebas DOM con servicios Google y GPS simulados: selección, arrastre, GPS, retirada del punto, datos opcionales, Enter sin publicar, búsquedas tardías, error de sugerencias, reintento de carga y navegación/foco de guía. No usan tu clave ni consumen consultas de Google. También se ejecutan las pruebas offline, la verificación de vistas y el build de producción. La entrega real de sugerencias y la revisión visual en navegador requieren confirmar las APIs y restricciones de tu cuenta Google Cloud; no hay navegador interactivo disponible en esta sesión.
