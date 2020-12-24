var Reconciler = require('react-reconciler')
var unity = require('./unity_element.js')

const hostContext = {}
const childContext = {}

/** 检查属性是否相等 */
function isEqual(value, oldValue) {
    if (value == oldValue) return true
    if (oldValue == null) return false
    if (typeof value === 'object') {
        for (const key in value) {
            if (value[key] !== oldValue[key]) return false
        }
    } else {
        return false
    }
    return true
}

const hostConfig = {
    /** 获取根容器的上下文信息, 只在根节点调用一次 */
    getRootHostContext(root) {
        return hostContext
    },
    /** 获取子节点的上下文信息, 每遍历一个节点都会调用一次 */
    getChildHostContext(parentHostContext, type, rootContainerInstance) {
        return childContext
    },
    /** 获取可公开的节点实例，即你愿意暴露给用户的节点信息，用户通过ref可以获取到这个对象。一般自定义渲染器原样返回即可, 除非你想有选择地给用户暴露信息 */
    getPublicInstance(instance) {
        return instance
    },
    clearContainer(container) {
        //GlobalGame.ClearChildren(container.gameObject)
    },
    /** 普通节点实例创建 */
    createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
        return unity.createElement(type, props, rootContainerInstance, hostContext, internalInstanceHandle)
    },
    /** 文本节点的创建 */
    createTextInstance(text, rootContainerInstance, hostContext, internalInstanceHandle) {
        //console.log('create text.................', text)
        //return unity.createTextNode(text, rootContainerInstance)
        throw new Error('.....................not support text child node')
    },
    /** 决定是否要处理子节点/子文本节点 */
    shouldSetTextContent(type, props) {
        return false
    },
    resetTextContent(instance) { },
    /** 
 * 在完成所有子节点初始化时(所有子节点都appendInitialChild完毕)时被调用, 如果返回true，则commitMount将会被触发
 * ReactDOM通过这个属性和commitMount配置实现表单元素的autofocus功能
 */
    finalizeInitialChildren(parentInstance, type, props, rootContainerInstance, hostContext) {
        return unity.initComonent(type, parentInstance, props, rootContainerInstance, hostContext)
    },
    commitTextUpdate(textInstance, oldText, newText) {
        unity.setText(textInstance, oldText, newText)
    },
    commitMount(instance, type, newProps, internalInstanceHandle) {
        //Some attributes like style need to be changed only after mount
    },
    /** 
     * 开始提交之前被调用，比如这里可以保存一些状态，在’提交‘完成后恢复状态。比如ReactDOM会保存当前元素的焦点状态，在提交后恢复 
     * 执行完prepareForCommit，就会开始执行Effects(节点更新)
     */
    prepareForCommit(container) { },
    /** 和prepareForCommit对应，在提交完成后被执行 */
    resetAfterCommit(container) { },
    /** 计算哪些属性需要更新 diff算法 */
    prepareUpdate(instance, type, oldProps, newProps, rootContainerInstance, hostContext) {
        if (oldProps === newProps) return null
        let result = null
        for (const key in newProps) {
            if (key === 'children') continue
            if (!isEqual(newProps[key], oldProps[key])) {
                if (!result) result = []
                result.push(key, newProps[key])
            }
        }
        return result
    },
    commitUpdate(instance, updatePayload, type, oldProps, newProps, internalInstanceHandle) {
        unity.applyUpdate(type, instance, updatePayload, oldProps, newProps, internalInstanceHandle)
    },
    shouldDeprioritizeSubtree(type, props) {
        return false
    },
    scheduleDeferredCallback(callback, options) {
        let timeout = 0
        if (options) timeout = options.timeout
        setTimeout(callback, timeout)
    },
    cancelDeferredCallback(callbackID) {
        clearTimeout(callbackID)
    },
    appendInitialChild(parent, child) {
        parent.appendChild(child);
    },
    appendChild(parent, child) {
        parent.appendChild(child);
    },
    appendChildToContainer(container, child) {
        container.appendChild(child);
    },
    removeChildFromContainer(container, child) {
        console.error('removeChildFromContainer');
        //container.removeChild(child).catch(e => {
        //    console.error('removeChildFromContainer , e:' + e.message);
        //});
    },
    removeChild(parent, child) {
        parent.removeChild(child);
    },
    /** 如果节点在*未挂载*状态下，会调用这个来添加子节点 */
    // appendInitialChild: unity.appendChild,
    // appendChild: unity.appendChild,
    // appendChildToContainer: unity.appendChildToContainer,
    // insertBefore: unity.insertBefore,
    // insertInContainerBefore: unity.insertBefore,
    // removeChild: unity.removeChild,
    // removeChildFromContainer: unity.removeChild,
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    noTimeout: -1,
    now: Date.now,
    isPrimaryRenderer: true,
    supportsMutation: true,
    supportsPersistence: false,
    supportsHydration: false,
}

const reconciler = Reconciler(hostConfig)

module.export = {
    render: function (reactElement) {
        if (world == undefined) {
            throw new Error("init with World first!");
        }
        const container = reconciler.createContainer(root, false, false);
        reconciler.updateContainer(reactElement, container, null, null);
        return root;
    }
}
