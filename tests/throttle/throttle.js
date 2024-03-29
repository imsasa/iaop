import {debounce, throttle} from "../../src/throttle.js";
import assert from "assert";
describe("debounce", function () {
    it("execute after 1s", function () {
        let fn = throttle(function () {
            console.log("Date.now()",Date.now());
            return Date.now();
        },{instant:false,delay:1300});
        let t  = Date.now();
        return fn().then(function (val) {
            console.log('dddd',val - t);
            assert.equal(true, val - t >= 1200);
        });
    });
    it("leaveFlag is true", function (done) {
        let fn = throttle(function (arg) {
            return arg;
        },{leave:true,delay:1200});
        fn(1).then(function (val) {
            assert.equal(1, val);
        });
        fn(2).then(function (val) {
            assert.equal(1, val);
        });
        fn(3).then(function (val) {
            assert.equal(1, val);
            done();
        });
    });
    it("call multi,execute one", function (done) {
        let exeCnt = 0;
        let fn     = throttle(function () {
            return ++exeCnt;
        },1000);
        let cnt    = 0;
        let inter  = setInterval(function () {
            cnt++;
            if (cnt >= 5) {
                done();
                clearInterval(inter);
            }
            fn().then(function (val) {
                assert.equal(1, val);
            });
        }, 100)
    });
    it("execute Immediately", function (done) {
        let exeCnt = 0, cnt = 0;
        this.timeout(5000);
        let fn1 = throttle(function () {
            exeCnt++;
            return exeCnt;
        }, 3000);
        fn1().then(() => assert.equal(1, exeCnt));
        let inter = setInterval(function () {
            cnt++;
            if (cnt >= 15) {
                clearInterval(inter);
                done();
            }
            fn1().then(function (val) {
                assert.equal(2, val);
            });
        }, 100)
    });
    it("clear", function (done) {
        let  exeCnt = 0;
        this.timeout(5000);
        let fn2     = throttle(function () {
            exeCnt++;
            return exeCnt;
        },3000);
        setTimeout(()=>fn2.clear(),2000);
        setTimeout(()=>{
            assert.equal(0,exeCnt);
            done()
        },{delay:4000});
    });

    it("execute multi times without promise", function (done) {
        let cnt=1;
        let t=Date.now();
        let fn = throttle(function () {
            assert.equal(true, Date.now() - t < 1500);
            assert.equal(cnt,1);
            cnt++;
            done()
        },{});
        fn();
        fn();
        setTimeout(function (){
            fn();
        }, 500);
    });
});