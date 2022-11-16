// import { ref, effect } from 'vue';
// const a = ref(0);
// effect(() => {console.log(a.value)})
// a.value = 30;

export class Dep {
    constructor(val) {
        this._val = val;
        this.deps = new Set();
    }

    // 触发依赖收集
    get value() {
        this.addDeps();
        return this._val;
    }

    // 触发依赖分发
    set value(val) {
        this._val = val;
        this.notice();
    }

    // 收集依赖
    addDeps() {
        if (currentEffect) {
            this.deps.add(currentEffect);
        }
    }

    // 依赖分发
    notice() {
        this.deps.forEach(item => item());
    }
    
}

// 当前搜集的依赖
let currentEffect = null;

// 依赖收集方法
export function effectWatch(fn) {
    currentEffect = fn;
    fn();
    currentEffect = null;
}

const effectMap = new Map();

const getDep = (target, key) => {
    // 获取对应的依赖列表
    // target 可能为对象？ 还是必须为对象
    let deps = effectMap.get(target);

    // 不存在依赖操作者列表，创建
    if (!deps) {
        deps = new Map();
        effectMap.set(target, deps)
    }

    // 获取对应key的依赖者
    let dep = deps.get(key)
    if (!dep) {
        dep = new Dep();
    }
    deps.set(key, dep);
    return dep;
}

export function reactive(obj) {
    return new Proxy(obj, {
        get(target, key) {
            let value = Reflect.get(target, key);
            if (target[key] instanceof Object) {
                value = reactive(target[key])
            }
            const dep = getDep(target, key)
            // 收集依赖
            dep.addDeps();
            return value;
        },

        set(target, key, value) {
            const dep = getDep(target, key);
            const result = Reflect.set(target, key, value);
            // 数据变化，通知依赖者执行收集的依赖
            dep.notice();
            return result;
        }
    })
}