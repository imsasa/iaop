/**
 *  Define a function that filters the execution of another function based on a condition
 * @param fn
 * @param filter
 * @param ctx
 * @return {Function}
 */
export default function filter(fn, filter, ctx) {
    return function () {
        let ths = ctx || this;
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
 * @param fn {function} filter function that return false to stop the function
 * @param [ctx]
 * @return {Function}
 */
Function.prototype.filter = function (fn, ctx) {
    return filter(this, fn, ctx);
};
