/**
 *  Define a function that filters the execution of another function based on a condition
 * @param fn
 * @param filter
 * @param ctx
 * @return {Function}
 */
export function filter(fn, filter, ctx) {
    let ths = ctx || this;
    return function () {
        let ret = filter.apply(ths, arguments);
        if (ret?.then) {
            return ret.then(ret => {
                if (ret === false) return;
                return fn.apply(ths, arguments);
            });
        } else if (ret !== false) {
            return fn.apply(ths, arguments);
        }
    }
}

/**
 * Add a filter method to the Function prototype that allows filtering of function execution
 * @param filter {function} return false to stop the function
 * @param ctx
 * @return {Function}
 */
Function.prototype.filter = function (filter, ctx) {
    return filter(this, filter, ctx);
};
