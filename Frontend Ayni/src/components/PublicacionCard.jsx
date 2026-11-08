/** Tarjeta semántica reutilizada sin alterar las variantes visuales originales. */
export default function PublicacionCard({ children, ...props }) {
  return <article {...props}>{children}</article>;
}
