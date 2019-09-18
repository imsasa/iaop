/**
 * @typedef {Function} wraped
 * @property {before} before ID of the page you want.
 * @property {after} after Name of the page you want.
 */

/**
 * @typedef {Function} _before_
 * @param b4fn {Function}  Info on the page you want to request
 * @param [mode] {boolean} Function executed when page is retrieved
 */
function _before_(b4fn, mode) {
    let fn        = this;
    let wrapFn    = function () {
        let b4Val = b4fn.apply(this, arguments);
        return mode === true ? fn.call(this, b4Val) : fn.apply(this, arguments);
    };
    wrapFn.before = _before_;
    wrapFn.after  = _after_;
    return wrapFn;
}

/**
 * @typedef _after_  {Function}  like function after，but just need two params
 * @param afn {Function}  the function you want to execute after
 * @param [mode] {boolean}
 */
function _after_(afn, mode) {
    let fn        = this;
    let wrapFn    = function () {
        let val = fn.apply(this, arguments);
        mode ? (val = afn.call(this, val)) : afn.apply(this, arguments);
        return val;
    };
    wrapFn.after  = _after_;
    wrapFn.before = _before_;
    return wrapFn;
}


/**
 * If you want deal with sth before a predefined function ,you can use it
 * @param fn {Function} the predefined function
 * @param b4fn {Function} the function you want to execute before fn
 * @param [mode] {boolean} if true fn will get the result of b4fn as argument,else, fn's arguments is what you passed;
 * @return {wraped}
 */

export function before(fn, b4fn, mode) {
    return _before_.call(fn, b4fn, mode);
}


/**
 * If you want deal with sth after a predefined function ,you can use it
 * @param fn {function} the predefined function
 * @param afn {function} the function you want to execute after fn
 * @param [mode] {boolean}  if true,afn will get the result of fn as argument,else, afn's arguments is what you passed;
 * @return {wraped}
 */
export function after(fn, afn, mode) {
    return _after_.call(fn, afn, mode);
}