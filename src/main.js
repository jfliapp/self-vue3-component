import { app } from "./app";
import { render, createNode } from "./vue";

createApp(app).mounted("#app");

function createApp(app) {
  return {
    mounted(container) {
      let vnode = createNode(app);
      let id = document.querySelector(container);
      render(vnode, id)
    },
  };
}
