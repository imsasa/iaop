/**
 *  @typedef {Function} before
 *  @param fn {function}
 *  @param b4fn  {function}
 *  @param ctx {object}  Info on the page you want to request

 */

export function before(fn, b4fn, ctx) {
    return function () {
        let args  = arguments;
        let ths   = ctx || this;
        let b4val = b4fn.apply(ths, args);
        return b4val?.then ? b4val.then((val) => fn.apply(ths, args)) : fn.apply(ths, args);
    };
}

Function.prototype.before = function (b4fn, ctx) {
    return before(this, b4fn, ctx);
};

export function unshift(fn, b4fn, ctx) {
    return function () {
        let ths   = ctx || this;
        let b4val = b4fn.apply(ths, arguments);
        return b4val?.then ? b4val.then((val) => fn.apply(ths, [val])) : fn.apply(ths, [b4val]);
    };
}

Function.prototype.unshift = function (b4fn, ctx) {
    return unshift(this, b4fn, ctx);
};

/**
 *  @typedef after {Function}
 *  @param fn {function}
 *  @param afn {function}  the function you want to execute after, it will get 2 arguments, the first is the return value of fn, the second is the arguments of fn
 *  @param [ctx] {object}
 */
export function after(fn, afn, ctx) {
    /**
     * @param afn   {function}
     */
    return function () {
        let ths    = ctx || this;
        let val    = fn.apply(ths, arguments);
        let retAfn = val?.then ? val.then((val) => afn.apply(ths, arguments)) : afn.apply(ths, arguments);
        return retAfn?.then ? retAfn.then(() => val) : val;
    };
}

Function.prototype.after = function (afn, ctx) {
    return after(this, afn, ctx);
};

export function pipe(fn, afn, ctx) {
    let ths = ctx || this;
    return function (){
        return afn.apply(ths, [fn.apply(ths, arguments)]);
    }

}

Function.prototype.pipe = function (afn, ctx) {
    return pipe(this, afn, ctx);
};

/**
 * Wraps a function with before and after functions.
 *
 * @param {Function} fn - The function to wrap.
 * @param {Function} b4fn - The function to execute before the wrapped function.
 * @param {Function} afn - The function to execute after the wrapped function.
 * @param {Object} [ctx] - The context to use when calling the functions.
 * @returns {Function} - The wrapped function.
 */
export function around(fn, b4fn, afn, ctx) {
    return function () {
        let ths    = ctx || this;
        let b4val  = b4fn.apply(ths, arguments);
        let ret    = b4val?.then ? b4val.then(() => fn.apply(ths, arguments)) : fn.apply(ths, arguments);
        let aftRet = ret?.then ? ret.then((val) => afn.apply(ths, arguments)) : afn.apply(ths, arguments);
        return aftRet?.then ? aftRet.then(() => ret) : ret;
    };
}

Function.prototype.around = function (b4fn, afn, ctx) {
    return around(this, b4fn, afn, ctx);
};

/**
 * wrap a function with before and after functions,
 * function b4fn will be executed before the function,
 * the return value of before function will be passed to the function,
 * function afn will be executed after the function fn;
 * @param fn
 * @param b4fn
 * @param afn
 * @param ctx
 * @return {function(): *}
 */
export function wrapper(fn, b4fn, afn, ctx) {
    afn ||= (val) => val;
    return function () {
        let ths   = ctx || this;
        let b4ret = b4fn?.apply(ths, arguments);
        let _fn   = b4ret => {
            let ret = fn.apply(ths, [b4ret]);
            return ret?.then ? ret.then(afn) : afn(b4ret);
        };
        return b4ret?.then ? b4ret.then(_fn) : _fn(b4ret);
    };
}


// Add a wrapper method to the Function prototype that wraps a function with before and after functions
Function.prototype.wrapper = function (b4fn, afn, ctx) {
    return wrapper(this, b4fn, afn, ctx);
};


// let t=co(function(){
//   console.log('co1',Date.now());
// },1,1000);
// let arr=new Array(6).fill(1);
// arr.forEach((v)=>{
//   return t(v);
// });
// setTimeout(()=>{
//     t.clear();
// },3000);
// function testFn(arg1, arg2) {
//     console.log('tfn', arg1, arg2);
//     return 20;
// }

// let fn = testFn.wrapper((arg1, arg2) => {
//     console.log('filter', arg1, arg2);
//     return [arg1 + 2, arg2 + 2];
// }, function (arg1, arg2) {
//     return arg2;
// })

// let ret = fn(1, 2);
// console.log('ret', ret);
