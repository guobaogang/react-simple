import { setAttribute, createComponent, setComponentProps } from ".";

export function diff(dom, vnode, container) {
    const ret = diffNode(dom, vnode);
    if (container) {
        container.appendChild(ret)
    }
    return ret;
}

export function diffNode(dom, vnode) {
    let out = dom;
    if (vnode === undefined || vnode === null || typeof vnode === 'boolean') return;
    if (typeof vnode === 'number') vnode = vnode.toString();
    if (typeof vnode === 'string') {
        if (dom && dom.nodeType === 3) {
            if (dom.textContent !== vnode) {
                dom.textContent = vnode
            }
        } else {
            out = document.createTextNode(vnode);
            if (dom && dom.parentNode) {
                dom.parentNode.replaceChild(out, dom)
            }
        }
        return out;
    }

    if (typeof vnode.tag === 'function') {
        return diffComponent(dom, vnode);
    }

    if (!dom) {
        console.log(vnode.tag);
        out = document.createElement(vnode.tag);
    }
    if (vnode.children && vnode.children.length > 0 || (out.childNodes && out.childNodes.length > 0)) {
        diffChildren(out, vnode.children);
    }
    diffAttribute(out, vnode);
    return out;
}

function diffComponent(dom, vnode) {
    let comp = dom;
    // 如果组件没有变化,则重新设置 props;   执行
    if (comp && comp.constructor === vnode.tag) {
        // 重新设置 props
        setComponentProps(comp, vnode.attrs);
        // 赋值
        dom = comp.base;
    } else {
        // 如果组件类型变化,则移除掉原来组件,并渲染新组件
        // 移除
        if (comp) {
            unmountComponent(comp);
            comp = null;
        }
        //核心代码
        // 1.创建新组件
        comp = createComponent(vnode.tag, vnode.attrs);
        // 2.设置组件属性
        setComponentProps(comp, vnode.attrs);
        dom = comp.base;
    }
    return dom;
}

function unmountComponent(comp) {
    removeNode(comp.base)
}

function removeNode(dom) {
    if (dom && dom.parentNode) {
        dom.parentNode.removeChild()
    }
}

function diffAttribute(dom, vnode) {
    const oldAttrs = {};
    const domAttrs = dom.attributes;
    const newAttrs = vnode.attrs;
    [...domAttrs].forEach(item => {
        oldAttrs[item.name] = item.value
    })

    for (const key in oldAttrs) {
        if (key in newAttrs) {
            setAttribute(dom, key, undefined)
        }
    }

    for (const key in newAttrs) {
        if (oldAttrs[key] !== newAttrs[key]) {
            setAttribute(dom, key, newAttrs[key])
        }
    }
}


// 对比子节点
function diffChildren(dom, vchildren) {
    const domChildren = dom.childNodes;
    const children = [];
    const keyed = {};
    // 将有key的节点(用对象保存)和没有key的节点(用数组保存)分开
    if (domChildren.length > 0) {
        [...domChildren].forEach(item => {
            // 获取key
            const key = item.key;
            if (key) {
                // 如果key存在,保存到对象中
                keyed[key] = item;
            } else {
                // 如果key不存在,保存到数组中
                children.push(item)
            }

        })
    }
    if (vchildren && vchildren.length > 0) {
        let min = 0;
        let childrenLen = children.length; //2
        [...vchildren].forEach((vchild, i) => {
            // 获取虚拟DOM中所有的key
            const key = vchild.key;
            let child;
            if (key) {
                // 如果有key,找到对应key值的节点
                if (keyed[key]) {
                    child = keyed[key];
                    keyed[key] = undefined;
                }
            } else if (childrenLen > min) {
                // alert(1);
                // 如果没有key,则优先找类型相同的节点
                for (let j = min; j < childrenLen; j++) {
                    let c = children[j];
                    if (c) {
                        child = c;
                        children[j] = undefined;
                        if (j === childrenLen - 1) childrenLen--;
                        if (j === min) min++;
                        break;
                    }
                }
            }
            // 对比
            child = diffNode(child, vchild);
            // 更新DOM
            const f = domChildren[i];
            if (child && child !== dom && child !== f) {
                // 如果更新前的对应位置为空，说明此节点是新增的
                if (!f) {
                    dom.appendChild(child);
                    // 如果更新后的节点和更新前对应位置的下一个节点一样，说明当前位置的节点被移除了
                } else if (child === f.nextSibling) {
                    removeNode(f);
                    // 将更新后的节点移动到正确的位置
                } else {
                    // 注意insertBefore的用法，第一个参数是要插入的节点，第二个参数是已存在的节点
                    dom.insertBefore(child, f);
                }
            }
        })
    }
}
