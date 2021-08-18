const ReactDom = {
    render
}

function render(vnode, container) {
    if (vnode == undefined) return;
    if (typeof vnode === 'string') {
        const textNode = document.createTextNode(vnode);
        return container.appendChild(textNode)
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
    container.appendChild(dom)
}

function setAttribute(dom, key, value) {
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