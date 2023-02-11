import Root from "./Root.svelte"

const root = new Root({
  target: document.getElementById("app") as HTMLElement,
})

export default root
