import co from '../src/co.js';
import assert from 'assert';
describe('co function', function() {
    it('should execute a function with concurrency of 1', async function() {
        let func = function(x) {
            return x * 2;
        }.co(1);
        let res = await func(2);
        assert.strictEqual(res, 4);
    });

    it('should respect the concurrency limit', async function() {
        let counter = 0;
        let func = async function() {
            counter++;
            await new Promise(res => setTimeout(res, 100));
            counter--;
            return counter;
        }.co(2);
        let promises = [func(), func(), func()];
        let results = await Promise.all(promises);
        assert.deepStrictEqual(results, [1, 1, 0]);
    });

    it('should respect the wait time between executions', async function() {
        let timestamps = [];
        let func = async function() {
            timestamps.push(Date.now());
        }.co(1, 100);

        await func();
        await func();
        assert.ok(timestamps[1] - timestamps[0] >= 100);
    });

    it('should respect the wait time between executions2', async function() {
        let timestamps = [];
        let func = async function() {
            timestamps.push(Date.now());
        }.co(2, 100);

        await func();
        await func();
        assert.ok(timestamps[1] - timestamps[0] < 10);
    });

    it('should stop execution when stop is called', async function() {
        let counter = 0;
        let func = async function() {
            counter++;
            await new Promise(res => setTimeout(res, 100));
            counter--;
            return counter;
        }.co(1);

        let promise1 = func();
        let promise2 = func();
        func.stop();
        let res1 = await promise1;
        let res2 = await promise2;
        assert.strictEqual(res1, 0);
        assert.strictEqual(res2, undefined);
    });

});
