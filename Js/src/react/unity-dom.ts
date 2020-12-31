import * as Reconciler from 'react-reconciler'
import * as cs from 'csharp'

function deepEquals(x: any, y: any) {
    if (x === y) return true;
    const xEqual = x.Equals;
    const yEqual = y.Equals;
    if (xEqual || yEqual) {
        return x.Equals(y);
    }
    if (!(x instanceof Object) || !(y instanceof Object)) return false;
    for (var p in x) { // all x[p] in y
        if (p === 'children') continue;
        if (!deepEquals(x[p], y[p])) return false;
    }
    for (var p in y) {
        if (p === 'children') continue;
        if (!x.hasOwnProperty(p)) return false;
    }
    return true;
}

const hostConfig: any = {
    /** 获取根容器的上下文信息, 只在根节点调用一次 */
    getRootHostContext(root: UnityElementRoot) {
        return {};
    },
    /** 获取子节点的上下文信息, 每遍历一个节点都会调用一次 */
    getChildHostContext(parentHostContext: any) {
        return parentHostContext;
    },
    /** 获取可公开的节点实例，即你愿意暴露给用户的节点信息，用户通过ref可以获取到这个对象。一般自定义渲染器原样返回即可, 除非你想有选择地给用户暴露信息 */
    getPublicInstance(instance: any) {
        return instance
    },
    clearContainer(container: any) {
        //GlobalGame.ClearChildren(container.gameObject)
    },
    /** 普通节点实例创建 */
    createInstance(type: any, props: any) {
        return new UnityElement(type, props);
    },
    /** 文本节点的创建 */
    createTextInstance(text: any) {
        return new UnityElement("UnityEngine.UI.Text", {});
    },
    /** 决定是否要处理子节点/子文本节点 */
    shouldSetTextContent(type: any, props: any) {
        return false;
    },
    resetTextContent(instance: any) { },
    /** 
     * 在完成所有子节点初始化时(所有子节点都appendInitialChild完毕)时被调用, 如果返回true，则commitMount将会被触发
     * ReactDOM通过这个属性和commitMount配置实现表单元素的autofocus功能
     */
    finalizeInitialChildren() {
        return false;
    },
    commitTextUpdate(textInstance: any, oldText: any, newText: any) {
        if (oldText !== newText) {
            textInstance.update({}, { Text: newText })
        }
    },
    // commitMount(instance, type, newProps, internalInstanceHandle) {
    //     //Some attributes like style need to be changed only after mount
    // },
    /**
     * 开始提交之前被调用，比如这里可以保存一些状态，在’提交‘完成后恢复状态。比如ReactDOM会保存当前元素的焦点状态，在提交后恢复 
     * 执行完prepareForCommit，就会开始执行Effects(节点更新)
     */
    prepareForCommit(container: any) { },
    /** 和prepareForCommit对应，在提交完成后被执行 */
    resetAfterCommit(container: any) { },
    /** 计算哪些属性需要更新 diff算法 */
    prepareUpdate(instance: any, type: any, oldProps: any, newProps: any) {
        try {
            return !deepEquals(oldProps, newProps);
        } catch (e) {
            console.error(e.message);
            return true;
        }
    },
    commitUpdate(instance: any, updatePayload: any, type: any, oldProps: any, newProps: any) {
        try {
            instance.update(oldProps, newProps);
        } catch (e) {
            console.error("commitUpdate fail!, " + e);
        }
    },
    shouldDeprioritizeSubtree() { },
    scheduleDeferredCallback() { },
    cancelDeferredCallback() { },
    appendInitialChild(parent: any, child: any) {
        parent.appendChild(child);
    },
    appendChild(parent: any, child: any) {
        parent.appendChild(child);
    },
    appendChildToContainer(container: any, child: any) {
        container.appendChild(child);
    },
    removeChildFromContainer(container: any, child: any) {
        container.removeChild(child);
    },
    removeChild(parent: any, child: any) {
        parent.removeChild(child);
    },
    insertBefore(parentInstance: any, child: any, beforeChild: any) {
        parentInstance.appendChild(child);
        child.nativePtr.transform.SetSiblingIndex(beforeChild.nativePtr.transform.GetSiblingIndex())
    },
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    noTimeout: -1,
    now: Date.now,
    isPrimaryRenderer: true,
    supportsMutation: true,
    supportsPersistence: false,
    supportsHydration: false,
}

class UnityElement {
    public nativePtr: cs.UnityEngine.GameObject;
    public type: any;
    public myPropsWillChange: any;
    public callBackWillAdd: any;
    constructor(type: any, props: any) {
        this.type = type;
        try {
            this.init(props);
        } catch (e) {
            console.error("create " + type + " throw " + e);
        }
    }
    init(props: any) {
        console.log('init ' + this.type)
        if (this.type === 'GameObject') {
            this.nativePtr = new cs.UnityEngine.GameObject();
        } else {
            this.myPropsWillChange = {};
            this.callBackWillAdd = {};
            for (const key in props) {
                let val = props[key];
                if (typeof val === 'function') {
                    this.callBackWillAdd[key] = val;
                } else if (key !== 'children') {
                    this.myPropsWillChange[key] = val;
                }
            }
        }
    }

    mergeComp() {

    }

    getComp(gameObject: any) {

    }

    bind(name: any, callback: any) {

    }

    update(oldProps: any, newProps: any) {
        this.myPropsWillChange = {};
        this.callBackWillAdd = {};

        let propChange = false;
        for (var key in newProps) {
            let oldProp = oldProps[key];
            let newProp = newProps[key];
            if (key !== 'children' && oldProp !== newProp) {
                if (typeof newProp === 'function') {
                    this.callBackWillAdd[key] = newProp;
                } else {
                    this.myPropsWillChange[key] = newProp;
                    propChange = true;
                }
            }
        }
        this.mergeComp();
    }

    unbind(name: any) {

    }

    unbindAll() {

    }

    appendChild(child: any) {

    }

    removeChild(child: any) {

    }
}

class UnityElementRoot {
    nativePtr: any;
    Added: boolean;

    constructor(nativePtr: cs.UnityEngine.GameObject) {
        this.nativePtr = nativePtr;
    }

    appendChild(child: any) {
        if (!child.nativePtr) {
            child.getComp(this.nativePtr);
            child.mergeComp();
        } else {
            console.log(child.nativePtr.transform.name)
            child.nativePtr.transform.SetParent(this.nativePtr.transform)
        }
    }

    removeChild(child: any) {
        child.unbindAll();
        if (child.compPtr) {
            cs.UnityEngine.Object.Destroy(child.compPtr);
        } else {
            child.nativePtr.transform.SetParent(null)
            cs.UnityEngine.Object.Destroy(child.nativePtr);
        }
    }

    addToViewport(z: any) {
        if (!this.Added) {
            this.Added = true;
        }
    }

    removeFromViewport() {
        this.Added = false;//?????
    }

    getWidget() {
        return this.nativePtr;
    }
}

const reconciler = Reconciler(hostConfig);

export const UnityDom = {
    render(
        element: React.ReactNode,
        rootUnityObj: cs.UnityEngine.GameObject,
        callback?: () => void,
    ): number {
        const container = reconciler.createContainer(new UnityElementRoot(rootUnityObj), false, false);
        return reconciler.updateContainer(element, container, null, callback);
    },
};