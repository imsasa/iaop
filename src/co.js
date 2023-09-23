//让函数并发执行
/**
 * 创建一个具有并发控制和等待时间选项的函数
 * @export
 * @param {function} func - 要协作执行的函数
 * @param {number} [concurrency=1] - 允许的最大并发执行数
 * @param {number} [wt=0] - 每次函数执行后的等待时间（以毫秒为单位）
 * @return {function} - 返回一个新的函数，该函数接受原始函数的参数并返回一个promise
 */
export function co(func, concurrency=1, wt = 0) {
    let queue   = [];
    let canceled, workers = new Set();
    function finish() {
        if (!canceled && fn.complete) {
            fn.complete();
        }
        fn.finish && fn.finish(canceled);
        canceled = undefined;
    }
    /**
     * 从队列中取出任务并执行它们，直到队列为空
     *
     * @param {Array} queue - 任务队列
     * @param {function} func - 要执行的函数
     */
    async function exec(queue,func) {
        while (queue.length > 0) {
            const {args, resolve, reject} = queue.shift();
            let ret = canceled?undefined:await func(...args);
            resolve(ret);
            if(wt&&!canceled){
                await new Promise(res =>setTimeout(res, wt));
            }
        }
    }
    /**
     * 包装的函数，将参数放入队列并根据并发限制启动新的工作程序
     *
     * @param {...any} args - 传递给原函数的参数
     * @return {Promise} - 一个promise，它将在原函数的结果上解析
     */
    function fn(...args) {
        return new Promise(async (resolve, reject) => {
            queue.push({args, resolve, reject});
            if (workers.size >= concurrency) return;
            let worker=exec(queue,func).then(() =>workers.delete(worker)).finally(()=>workers.size===0&&finish());
            workers.add(worker);
        });
    }
    /**
     * 停止所有当前的和未来的执行
     */
    fn.stop = () => {
        if (queue.length) {
            canceled = true;
            fn.break && fn.break();
        }
    }
    return fn;
}

/**
 * 为Function原型添加一个新的方法，允许使用co函数轻松包装任何函数
 *
 * @param {number} [concurrency=1] - 允许的最大并发执行数
 * @param {number} [waitTime=0] - 每次函数执行后的等待时间（以毫秒为单位）
 * @return {function} - 返回一个新的函数，该函数接受原始函数的参数并返回一个promise
 */
Function.prototype.co = function (concurrency, waitTime = 0) {
    return co(this, concurrency, waitTime);
}
export default co;