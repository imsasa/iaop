
// let bar=function(){
//     console.log("bar");
// };
// let wrapBar=throttle(bar,2000);
// wrapBar();
// setTimeout(function (){
//     wrapBar().then((ret)=>console.log(ret))
// },3000);
// import {before, after} from "../src/index";

//返回插入函数的值
// let warpFn=before(fn,function(arg){
//     console.log("log");
//     return 'from before fn';
// },true);
// warpFn();

import {before, after} from "../src/index";
function bizFn(arg) {
    console.log('execute the bizFn', arg);
}
let warpFn = before(bizFn, function () {
    console.log('will execute before bizFn')
}).after(function () {
    console.log('will execute after bizFn')
});
warpFn('foo');
