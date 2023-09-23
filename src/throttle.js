/**
 * @module throttle - 函数节流
 */
/**
 * @private
 * @param {Function} fn - 要执行的函数
 * @param {Number|Object} opt
 * @param {Number} [opt.delay]- 延迟时间
 * @param {Boolean} [opt.leave] - 是否保留最后一次调用
 * @param {Boolean} [opt.instant] - 是否立即执行
 * @param {Boolean} [opt.prolong] - 是否延长等待时间
 * @returns {Function} retFn
 * @private
 */
function _throttle_(fn, opt) {
    let nextTask;
    const delay                  = opt.delay || 1000;
    const prolong                = opt.prolong || false;
    let {instant = true, leave,} = opt || {};
    let timer, t                 = 0, p, pres, prej, args;

    function _fn(ctx) {
        timer = undefined;
        if (nextTask) {
            pres(fn.apply(ctx, args));
            nextTask = undefined;
            pres     = prej = undefined;
        }
        p = undefined;
    }

    function _timer_(ctx) {
        let timestamp = Date.now();
        let timeout   = (timestamp - t - delay) > 0;
        t             = Date.now();
        if (instant && timeout) {
            pres(fn.apply(ctx, args));
        } else {
            if (!timeout && leave && !prolong) return;
            if (timer && prolong) {
                clearTimeout(timer);
                timer = undefined;
            }
            if (!leave) {
                nextTask = true;
            }
            if (!timer && (prolong || nextTask)) {
                console.log("delay", delay);
                timer = setTimeout(() => _fn(ctx), prolong ? delay : (delay + t - timestamp));
            }
        }
    }

    function retFn() {
        args = arguments;
        !p ? p = new Promise((res, rej) => {
            pres = res;
            prej = rej;
            _timer_(this);
        }) : _timer_(this);
        return p;
    }

    retFn.clear = () => {
        clearTimeout(timer) || (timer = undefined);
        pres = p = undefined;
        prej && prej("$rej$");
        prej = undefined;
        t    = 0;
        return retFn;
    };
    return retFn;
}

/**
 * **按指定时间间隔执行函数**
 * @param {Function} fn - 要执行的函数
 * @param {object} [$opt]
 * @param {Number} [$opt.delay] - 延迟时间
 * @param {Boolean} [$opt.leave] - 是否丢弃指定时间内的请求，true,如果在指定的时间内被调用多次，则全部丢弃；`false'，如果在指定的时间内被调用多次，最后一次将被执行
 * @returns {Function} ret - 被包装的函数
 * @returns {Function} ret.clear - 清除延迟调用
 * @example
 *  // 1.默认延迟时间500ms
 * let fn = throttle(your_function,{instant:false,delay:1500});
 *  */
export function throttle(fn, $opt = {}) {
    let opt = {delay: 500, leave: false, instant: true, prolong: false};
    if ($opt.delay) {
        opt.delay = $opt.delay;
    }
    if ($opt.instant !== undefined) {
        opt.instant = $opt.instant;
    }
    return _throttle_(fn, opt);
}

/**
 * 按指定间隔时间内的调用将延迟指定时间后执行
 * @param {Function} fn    - 要执行的函数
 * @param {Object} [$opt]
 * @param {Number} [$opt.delay] - 延迟时间
 * @param {Boolean} [$opt.leave] - 是否保留最后一次调用
 * @param {Boolean} [$opt.instant] - 是否立即执行  默认false
 * @returns {Function} ret - 被包装的函数
 * @returns {Function} ret.clear - 清除延迟调用
 * @example
 * // 1.默认延迟时间500ms
 * let fn = debounce(your_function,{instant:false,delay:1500});
 */
export function debounce(fn, $opt) {
    let opt = {delay: 500, leave: false, instant: true, prolong: true};
    if ($opt.delay) {
        opt.delay = $opt.delay;
    }
    if ($opt.instant !== undefined) {
        opt.instant = $opt.instant;
    }
    return _throttle_(fn, opt);
}

// test
// let fn = (arg) => console.log("fn", arg);
// let t  = throttle(fn, {delay: 3000, leave: false, instant: false});
// t(1);
// t(2);
// t(3);
// setTimeout(()=>t(4),3000);
// default {throttle, debounce}
// let ct = 1;
// setInterval(()=>console.log('ct',ct++),1000);
// let t  = debounce(fn, {delay: 3000, leave: true});
// t(1);
// setTimeout(() => t(2), 2000);
// setTimeout(() => t(3), 3000);
// setTimeout(() => t(4), 4000);