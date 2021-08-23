import { renderComponent } from "../react-dom";

const setStateQueue = [];
const renderQueue = [];

function defer(fn) {
    return Promise.resolve().then(fn)
}

export function enqueueSetState(stateChange, component) {
    if (setStateQueue.length === 0) {
        defer(flush)
    }
    setStateQueue.push({
        stateChange,
        component
    })
    // 如果renderQueue里没有当前组件,则添加到队列中
    let r = renderQueue.some(item => {
        return item === component;
    })
    if (!r) {
        renderQueue.push(component);
    }
}

function flush() {
    let item, component;
    // 遍历state
    while (item = setStateQueue.shift()) {
        const { stateChange, component } = item;
        // 如果没有prevState,则将当前的state作为初始的prevState
        if (!component.prevState) {
            component.prevState = Object.assign({}, component.state);
        }
        // 如果stateChange是一个方法,也就是setState的第一种形式
        if (typeof stateChange === 'function') {
            Object.assign(component.state, stateChange(component.prevState, component.props))
        } else {
            // 如果stateChange是一个对象,则直接合并到setState中
            Object.assign(component.state, stateChange);
        }
        component.prevState = component.state;
    }

    // 遍历组件
    while (component = renderQueue.shift()) {
        renderComponent(component);
    }
}