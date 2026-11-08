// Interacciones locales trasladadas desde mensajer_a_y_chat_entre_vecinos_ayni/code.html.
export default function initialize({
  document,
  window,
  listen,
  setTimeout,
  requestAnimationFrame,
}) {
  const escapeUserText = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[character],
    );

  (function () {
    const form = document.getElementById('message-form');
    const input = document.getElementById('message-input');
    const container = document.getElementById('messages-container');

    if (form && input && container) {
      listen(form, 'submit', function (e) {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        const timeString = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        });

        const messageNode = document.createElement('div');
        messageNode.className =
          'flex items-start justify-end gap-3 max-w-[85%] ml-auto transition-all duration-300 transform translate-y-2 opacity-0';
        messageNode.innerHTML = `
            <div class="space-y-1 text-right">
              <div class="flex items-center justify-end gap-2">
                <span class="font-label-sm text-[12px] text-on-surface-variant">${timeString}</span>
                <span class="font-label-md text-label-md text-primary font-semibold">Tú</span>
              </div>
              <div class="bg-primary text-on-primary p-space-md rounded-2xl rounded-tr-xs shadow-xs text-left">
                <p class="font-body-md text-body-md leading-relaxed">${escapeHtml(text)}</p>
              </div>
              <div class="inline-flex items-center gap-1 text-on-surface-variant font-label-sm text-[11px]">
                <span>Enviado</span>
                <span class="material-symbols-outlined text-[14px] text-primary">done</span>
              </div>
            </div>
          `;

        container.appendChild(messageNode);
        input.value = '';
        container.scrollTop = container.scrollHeight;

        // Animación suave de entrada
        requestAnimationFrame(() => {
          messageNode.classList.remove('translate-y-2', 'opacity-0');
        });
      });
    }

    function escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  })();

  return { document };
}
