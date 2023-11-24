export const render = (vnode, container) => {
  patch(vnode, container);
};

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
    emit: () => {}
  };
  component.emit = (name, args) => {
    const handlerName = 'on' + name.slice(0, 1).toUpperCase() + name.slice(1);
    const handler = component.props[handlerName]
    handler(args)
  }
  return component;
}
function setupComponent(instance) {
  // TODO:
  initProps(instance,instance.vnode.props)
  // initSlot()
  setupStatefulComponent(instance);
}

function initProps(instance, props) {
  instance.props = props;
}
function setupStatefulComponent(instance) {
  const { props} = instance
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
    const setupResult = setup(instance.props, {emit: instance.emit});
    handleSetupResult(instance, setupResult);
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
