import './index.scss';

const print = (...msg) => {
    console.log(...msg)
}

const data = {
    a: 1,
    b: 2
}

let a = data.a ?? 'aaa'
let b = data.b ?? 'bbb'
let c = data.c ?? 'ccc'
let d = data?.a
let f = data?.c

print(a, b, c, d, f)