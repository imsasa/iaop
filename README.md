## what's this
这是一个js工具库，用来帮助你在函数执行前后插入操作（aop编程）;

## how to use

- **假定有函数 `fn` 和 `log`**
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
- **安装**

  ```bash 
  npm i iaop 
  ````
- **在函数fn执行前执行log**

  ```javascript
  let before=require('iaop').before;
  let beforeFn=before(fn,log);
  beforeFn();
  ```
- **在函数fn执行后执行log**

  ```javascript
  let after=require('iaop').after;
  let afterFn=after(fn,log);
  afterFn();
  ```

- **传递插入函数执行后的返回值**

  默认情况下，`after` 和  `before` 的第二参数为false 。这时，插入的函数和原执行函数的执行时参数是一致的。`before` 函数的第二个参数为true时，会将插入函数的执行结果传递给执行函数；`after` 函数的第二个参数为true时，为将原执行函数的结果传递给after函数。

  ```javascript
  let before=require('iaop').before;
  let warpFn=before(fn,log,true);
  let ret=wrapFn(2); 
  // log函数的返回值会传递给fn,ret的值为3;
  ```
	
- **链式调用**

  ```javascript
  let before=require('iaop').before;
  let wrapFn=aop.before(fn,function(arg){
          console.log("1");
      })
      .after(function() {
          console.log("3");
      })
  ```
