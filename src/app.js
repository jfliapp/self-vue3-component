import { getCurrentInstance, provide, inject, createNode as h } from "./vue";
const bar = {
  setup() {
    // const self = getCurrentInstance();
    const aValue = inject("a1");
    return {
      msg: "bar",
      aValue,
    };
  },
  render() {
    // return h('div', {}, [h('p', {}, 'p'), h('p',null, 'pp')])
    // return h('div', {class: 'red', onClick: this.emitAdd}, 'hello - ' + this.msg + this.count)
    return h("div", {}, [
      this.$slots["yy"],
      h("p", {}, "bar: " + this.aValue), // 这个编译也是 this.$slots["default"]
      this.$slots["xx"](),
    ]);
  },
};
const foo = {
  setup(props, { emit }) {
    // const self = getCurrentInstance();
    provide("a1", "foo");
    const aValue = inject("a1");
    const bValue = inject("b1", 'b11111');
    const emitAdd = () => {
      emit("add", "vue------emit");
    };
    return {
      msg: "foo",
      aValue,
      bValue,
      emitAdd,
      
    };
  },
  render() {
    // return h('div', {}, [h('p', {}, 'p'), h('p',null, 'pp')])
    // return h('div', {class: 'red', onClick: this.emitAdd}, 'hello - ' + this.msg + this.count)
    return h("div", {}, [
      this.$slots["header"](this.msg),
      h(bar, {}, { xx: () => h("p", null, "foo:" + this.aValue), yy: h("p", null, "foo:" + this.bValue) }), // 这个编译也是 this.$slots["default"]
      this.$slots["footer"],
    ]);
  },
};
export const app = {
  setup() {
    // const self = getCurrentInstance();
    provide("a1", "app");
    return {
      msg: "vue3",
    };
  },
  render() {
    return h(
      foo,
      {
        count: 123,
        onAdd: (args) => {},
      },
      {
        header: (args) => h("p", {}, "header" + args),
        footer: h("p", {}, "footer"),
      }
    );
  },
};
