import { reactive, effect } from '../node_modules/@vue/reactivity/dist/reactivity.esm-browser.js';

const user = reactive({
    age: 10,
    info: {
        job: 'web'
    }
})

effect(() => {
    console.log(user.info.job);
})

user.info.job = 'web3.0';