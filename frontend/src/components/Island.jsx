// Rendered on the server like any other component, then hydrated on its own
// by src/client/main.js. Props must be plain JSON, and islands can't use useId:
// ids generated for the whole page won't match the island's own.
export default function Island({ name, component: Component, props = {} }) {
  return (
    <div className="island" data-island={name} data-props={JSON.stringify(props)}>
      <Component {...props} />
    </div>
  )
}
