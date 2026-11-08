/** Contenedor común; cada pantalla conserva el contenido lateral de Stitch. */
export default function Sidebar({ children, ...props }) {
  return <aside {...props}>{children}</aside>;
}
