## what's this
这是一个js工具库，用来帮助你在函数执行前后插入操作（aop编程）;

## how to use

有函数 `fn` 和 `log`.
  ```javascript
  function fn(arg) {
    console.log("fn");
    return arg;
  }
  function log(arg){
      arg++;
      console.log("log：",arg);
  }
  ```

### 安装
```bash 
  npm i iaop 
  ````
### 在函数fn执行前执行log函数
- **方式1**

```javascript
let before=require('iaop').before;
let beforeFn=before(fn,log);
beforeFn();
```
- **方式2**

```javascript
let wrapFn=fn.before(log);
wrapFn();
```

### 在函数fn执行后执行log
**方式1**

```javascript
let after=require('iaop').after;
let afterFn=after(fn,log);
afterFn();
```
**方式2**

```javascript
let wrapFn=fn.after(log);
wrapFn();
```

	
### 链式调用

 ```javascript
require('iaop');
let wrapFn=fn.before(function(arg){
        console.log("1");
    }).after(function() {
      console.log("3");
    })
wrapFn();
```

### 异步

```javascript
let cnt=0;
function foo() {
    console.log(cnt);
}
let wrapFn = foo.before(function (arg) {
    return new Promise((resolve, reject)=> {
        cnt++;
        setTimeout(resolve,10);
    })
})
let ret=wrapFn();//ret 将是一个promise对象
```