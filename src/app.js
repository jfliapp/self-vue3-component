import { createNode as h } from './vue'
const foo = {
  setup(props, {emit}) {
    console.log(props, 'setup --- > props')
    const emitAdd = () => {
      emit('add', 'vue------emit')
    }
    return {
      msg: 'foo',
      emitAdd
    }
  },
  render() {
    // return h('div', {}, [h('p', {}, 'p'), h('p',null, 'pp')])
    // return h('div', {class: 'red', onClick: this.emitAdd}, 'hello - ' + this.msg + this.count)
    console.log(this.$slots, '$slots, ')
    return h('div',{}, [this.$slots['header'], h('p', null, 'p'), this.$slots['footer']])
  }
}
export const app = {
  setup() {
    return {
      msg: 'vue3'
    }
  },
  render() {
    return h(foo, {count: 123, onAdd: (args) => {
      console.log('app, emit foo', args)
    }}, {
      header: h('p', {}, 'header'),
      footer: h('p', {}, 'footer')
    })
  }
}