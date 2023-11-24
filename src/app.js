import { getCurrentInstance, createNode as h } from "./vue";
const foo = {
  setup(props, { emit }) {
    const self = getCurrentInstance()
    console.log(self, "self")
    console.log(props, "setup --- > props");
    const emitAdd = () => {
      emit("add", "vue------emit");
    };
    return {
      msg: "foo",
      emitAdd,
    };
  },
  render() {
    // return h('div', {}, [h('p', {}, 'p'), h('p',null, 'pp')])
    // return h('div', {class: 'red', onClick: this.emitAdd}, 'hello - ' + this.msg + this.count)
    console.log(this.$slots, "$slots, ");
    return h("div", {}, [
      this.$slots["header"](this.msg),
      h("p", null, "p"), // 这个编译也是 this.$slots["default"]
      this.$slots["footer"],
    ]);
  },
};
export const app = {
  setup() {
    const self = getCurrentInstance()
    console.log(self, "self")
    debugger
    return {
      msg: "vue3",
    };
  },
  render() {
    return h(
      foo,
      {
        count: 123,
        onAdd: (args) => {
          console.log("app, emit foo", args);
        },
      },
      {
        header: (args) => h("p", {}, "header" + args),
        footer: h("p", {}, "footer"),
      }
    );
  },
};
