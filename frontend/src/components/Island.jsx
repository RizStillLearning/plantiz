// Marks an interactive component for hydration. The server renders it into the
// page like any other markup; in the browser, src/client/main.js loads only
// that component's code (see islands/registry.js) and takes over. Props must
// be plain JSON. Islands avoid useId: each hydrates on its own, so ids
// generated from the full page tree would not match.
export default function Island({ name, component: Component, props = {} }) {
  return (
    <div className="island" data-island={name} data-props={JSON.stringify(props)}>
      <Component {...props} />
    </div>
  )
}
