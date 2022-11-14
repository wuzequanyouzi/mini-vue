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