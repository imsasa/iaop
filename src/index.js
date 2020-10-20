/**
 *  @typedef {Function} before
 *  @param fn {function}
 *  @param b4fn  {function}
 *  @param ctx {object}  Info on the page you want to request
 *  @param [stopIf] {any} Function executed when page is retrieved
 */

function before(fn, b4fn, ctx, stopIf) {
    let isContinue = arguments.length === 2;
    return function () {
        let b4val = b4fn.apply(ctx || globalThis, arguments);
        let tmp   = (val) => {
            if (!isContinue) {
                isContinue = typeof stopIf === "function" ? stopIf(val) : val !== stopIf;
            }
            if (!isContinue) return val;
            if (!(val && typeof val === 'object' && val.length !== undefined)) {
                val = [val];
            }
            return fn.apply(ctx || globalThis, val);
        };
        return b4val && b4val.then ? b4val.then(val => tmp(val)) : tmp(b4val);
    };
}

Function.prototype.before = function (b4fn, ctx, stopIf) {
    return before(this, b4fn, ctx, stopIf);
}

/**
 *  @typedef after_  {Function}  like function after，but just need two params
 *  @param fn {function}
 *  @param afn {function}  the function you want to execute after
 *  @param [ctx] {object}
 *  @param [stopIf] {any}
 */
function after(fn, afn, ctx, stopIf) {
    let isContinue = arguments.length === 2;
    return function () {
        let val = fn.apply(ctx, arguments);
        if (isContinue) {
            isContinue = typeof stopIf === "function" ? stopIf(val) : val !== stopIf;
        }
        if (!isContinue) return val;
        if (!(val && typeof val === 'object' && val.length !== undefined)) {
            val = [val];
        }
        return afn.apply(ctx || globalThis, val);
    };
}

Function.prototype.after = function (afn, ctx, stopIf) {
    return after(this, afn, ctx, stopIf);
}

module.exports.before = before

module.exports.after = after