## what's this
这是一个js工具库，用来帮助你在函数执行前后插入操作（aop编程）;

##api
https://imsasa.github.io/iaop/index.html

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
  npm i https://github.com/imsasa/iaop.git
  ````

### 使用方式
- **方式1**

```javascript
import {before} from 'iaop';
let beforeFn=before(fn,log);
beforeFn();
```
- **方式2**

```javascript
import 'iaop'
let fn=()=>console.log('dosth');
let wrapFn=fn.before(log);
wrapFn();
```

### api
- before， 在函数执行前增加一个执行函数；
- after, 在函数执行后增加一个执行函数；
- pip, 在函数执行后增加一个执行函数fn,fn的入参是将前一个函数的执行结果；
- fitler， 在函数执行前增加一个执行函数fn，如果fn返回false则不执行函数；
- unshift, 在函数执行前增加一个执行函数fn，fn的执行结果是函数的入参；
- co , 函数可并发执行；



