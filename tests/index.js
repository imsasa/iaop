let assert = require("assert");
import {before, after} from "../src/index";


describe('function before', function () {
    it("before", function () {
        let bar = 'bar';
        let cnt = 0;

        function foo() {
            return ++cnt;
        }

        let wrapFn = before(foo, () => {bar = 'barChged'});
        let ret    = wrapFn();
        assert(bar, "barChged");
        assert(true, ret === 1);
    });
    it("link", function () {
        function foo(arg) {
            return ++arg;
        }

        let wrapFn = before(foo, (arg) => arg + 2, true);
        // let wrapFn2 = before(wrapFn, (arg) =>arg + 2, true);
        let ret    = wrapFn(1);
        assert.equal(ret, 4);
    });

    it("multi", function () {
        let cnt = 0;
        let baz = "a";

        function foo() {
            return ++cnt;
        }

        let wrapFn  = before(foo, () => baz += "b");
        let wrapFn2 = before(wrapFn, () => baz += "c");
        let ret     = wrapFn2();
        assert.equal(baz, "acb");
        assert.equal(ret, 1);
    });
    it("param", function () {
        function foo(arg) {
            return arg;
        }

        let wrapFn  = before(foo, (arg) => arg);
        let wrapFn2 = before(wrapFn, (arg) => arg);
        let ret     = wrapFn2(2);
        assert.equal(ret, 2);
    });
});
describe('function after', function () {
    it("after", function () {
        let bar = 'bar';
        let cnt = 0;

        function foo() {
            return ++cnt;
        }

        let wrapFn = after(foo, () => {bar = 'barChged'});
        let ret    = wrapFn();
        assert(bar, "barChged");
        assert(true, ret === 1);
    });

    it("after multi", function () {
        let bar = 'bar';
        let cnt = 0;

        function foo() {
            return ++cnt;
        }

        foo     = after(foo, () => ++cnt).after(() => ++cnt);
        let ret = foo();
        assert(true, ret === 3);
    });

    it("pass", function () {
        function foo(arg) {
            return ++arg;
        }

        let wrapFn = after(foo, (arg) => arg + 2, true);
        let ret    = wrapFn(1);
        assert.equal(ret, 4);
    });
    it("chain", function () {
        function foo() {
            console.log('this is original fn');
        }
        let cnt    = 1;
        let wrapFn = before(foo, function (arg) {
            cnt++;
            assert.equal(cnt, 3);
        }).before(function () {
            cnt++;
            assert.equal(cnt, 2);
        }).after(function () {
            cnt++;
            assert.equal(cnt, 4);
        });
        wrapFn()
    });

});