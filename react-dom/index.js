import Component from "../react/component";
import { diff, diffNode } from "./diff";

const ReactDom = {
    render
}

function render(vnode, container, dom) {
    return diff(dom, vnode, container)
    //container.appendChild(_render(vnode))
}

export function createComponent(comp, props) {
    let inst;
    if (comp.prototype && comp.prototype.render) {
        inst = new comp(props);
    } else {
        inst = new Component(props);
        inst.constructor = comp;
        inst.render = function () {
            return this.constructor(props)
        }
    }
    return inst;
}

export function setComponentProps(comp, props) {
    if (!comp.base) {
        if (comp.componentWillMount) comp.componentWillMount();
    } else {
        if (comp.componentWillReceieveProps) comp.componentWillReceieveProps();
    }
    comp.props = props;
    renderComponent(comp)
}

export function renderComponent(comp) {
    let base;
    const renderer = comp.render();
    if (comp.base && comp.componentWillUpdate) {
        comp.componentWillUpdate();
    }

    base = diffNode(comp.base, renderer);
    comp.base = base;

    if (comp.base) {
        if (comp.componentDidUpdate) comp.componentDidUpdate();
    } else {
        if (comp.componentDidMount) comp.componentDidMount();
    }
    /* if (comp.base && comp.base.parentNode) {
        comp.base.parentNode.replaceChild(base, comp.base)
    }
    comp.base = base; */
}

function _render(vnode) {
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return;
    if (typeof vnode === 'number') vnode = vnode.toString();
    if (typeof vnode === 'string') {
        const textNode = document.createTextNode(vnode);
        return textNode
    }

    if (typeof vnode.tag == 'function') {
        //1.创建组件
        const comp = createComponent(vnode.tag, vnode.attrs);
        //2.设置组件属性
        setComponentProps(comp, vnode.attrs)
        //3.组件渲染的节点对象返回
        return comp.base;
    }

    const { tag, attrs, children } = vnode;
    const dom = document.createElement(tag);
    if (attrs) {
        Object.keys(attrs).forEach(key => {
            const value = attrs[key];
            setAttribute(dom, key, value)
        })
    }
    if (children && children.length) {
        children.forEach(child => render(child, dom))
    }
    return dom
}

export function setAttribute(dom, key, value) {
    if (key === 'className') {
        key = 'class';
    }

    if (/on\w+/.test(key)) {
        key = key.toLowerCase();
        dom[key] = value || '';
    } else if (key === 'style') {
        if (!value || typeof value === 'string') {
            dom.style.cssText = value || '';
        } else if (value && typeof value === 'object') {
            for (const k in value) {
                if (typeof value[k] === 'number') {
                    dom.style[k] = value[k] + 'px';
                } else {
                    dom.style[k] = value[k];
                }
            }
        }
    } else {
        if (key in dom) {
            dom[key] = value || ''
        }
        if (value) {
            dom.setAttribute(key, value)
        } else {
            dom.removeAttribute(key)
        }
    }
}

export default ReactDom;