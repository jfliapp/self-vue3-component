let selfInstance = null;

export const render = (vnode, container) => {
  patch(vnode, container);
};

export function getCurrentInstance()  {
  return selfInstance
}

export const createNode = (type, props, children) => {
  const vnode = {
    type,
    props,
    children,
    el: null,
  };
  return vnode;
};

function patch(vnode, container) {
  const type = vnode.type;
  if (typeof type === "string") {
    processElement(vnode, container);
  } else {
    processComponent(vnode, container);
  }
}

function processElement(vnode, container) {
  const ele = document.createElement(vnode.type);
  vnode.el = ele;
  const child = vnode.children;
  if (typeof child === "string") {
    ele.textContent = child;
  } else if (Array.isArray(child)) {
    child.forEach((item) => {
      patch(item, ele);
    });
  }
  const props = vnode.props;
  const isOn = (key) => /^on[A-Z]/.test(key);
  for (let key in props) {
    if (isOn(key)) {
      ele.addEventListener(key.slice(2).toLowerCase(), props[key]);
    } else {
      ele.setAttribute(key, props[key]);
    }
  }
  container.append(ele);
}
function processComponent(vnode, container) {
  mountedComponent(vnode, container);
}
function mountedComponent(vnode, container) {
  const instance = createComponentInstance(vnode, container);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
  const proxy = instance.proxy;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);
  instance.vnode.el = subTree.el;
}
function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupResult: {},
    props: {},
    slots: {},
    emit: () => {},
  };
  component.emit = (name, args) => {
    const handlerName = "on" + name.slice(0, 1).toUpperCase() + name.slice(1);
    const handler = component.props[handlerName];
    handler(args);
  };
  return component;
}
function setupComponent(instance) {
  console.log(instance, "instance");
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}

function initProps(instance, props) {
  instance.props = props;
}
function initSlots(instance, children) {
  // 这个children 可以是单个值 数组 左右域
  // 这一块是编译那边做的的事 单个值也是 就是默认default。 数组不做处理先了
  // 所以 这里就默认传进来的都是对象  这里就i默认做 作用域插槽了
  // 带有name的
  let slot = {};
  console.log(children, "childre==========");
  // 这里需要注意 第一次app的时候他是没有 children的
  if (children) {
    Object.entries(children).forEach(([key, value]) => {
      slot[key] = value;
    });
  }
  console.log(slot, "slot-------------initSlots");
  instance.slots = slot;
}
function setupStatefulComponent(instance) {
  const { props } = instance;
  const component = instance.type;
  instance.proxy = new Proxy(
    {},
    {
      get(target, key) {
        const setupResult = instance.setupResult;
        if (key in setupResult) {
          return setupResult[key];
        }
        if (key in props) {
          return props[key];
        }
        if (key === "$el") {
          return instance.vnode.el;
        }
        if (key === "$slots") {
          return instance.slots;
        }
      },
      set(target, key, value) {
        const setupResult = instance.setupResult;
        if (key in setupResult) {
          setupResult[key] = value;
          return true;
        }
      },
    }
  );
  const setup = component.setup;
  if (setup) {
    selfInstance = instance
    const setupResult = setup(instance.props, { emit: instance.emit });
    handleSetupResult(instance, setupResult);
    selfInstance = null
  }
}
function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === "object") {
    instance.setupResult = setupResult;
  }
  finishSetupComponent(instance);
}
function finishSetupComponent(instance) {
  const component = instance.type;
  if (component.render) {
    instance.render = component.render;
  }
}
