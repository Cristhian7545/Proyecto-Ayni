export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-high py-space-xl mt-space-xxl shadow-[0_-1px_6px_rgba(77,90,74,0.03)]">
      <div className="max-w-[1200px] mx-auto px-margin-desktop text-center flex flex-col items-center gap-space-xs">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {'© 2026 Ayni. Todos los derechos reservados'}
        </p>
        <div className="flex items-center justify-center gap-space-sm font-label-sm text-label-sm text-on-surface-variant/80">
          <a
            className="hover:text-primary transition-colors"
            data-path="terminos-y-convivencia"
            href="#"
          >
            {'Términos y Convivencia'}
          </a>
          <span className="text-outline-variant">{'•'}</span>
          <a
            className="hover:text-primary transition-colors"
            data-path="ayuda-y-soporte-comunitario"
            href="#"
          >
            {'Ayuda y Soporte Comunitario'}
          </a>
        </div>
      </div>
    </footer>
  );
}
