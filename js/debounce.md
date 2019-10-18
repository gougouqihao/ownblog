### 防抖事件 和 节流事件
在前端开发中会遇到一些频繁的事件触发，比如：

window 的 resize、scroll
mousedown、mousemove
keyup、keydown
……

**防抖的原理就是：**

  你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，那我就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件，我才执行，真是任性呐!

为此，我们举个示例代码来了解事件如何频繁的触发：

我们写个 index.html 文件：

```javascript
<!DOCTYPE html>
<html lang="zh-cmn-Hans">

<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="IE=edge, chrome=1">
  <title>debounce</title>
  <style>
    #container {
      width: 100%; 
      height: 400px; 
      line-height: 400px; 
      text-align: center; 
      color: #fff; 
      background-color: #444; 
      font-size: 30px;
    }
  </style>
</head>

<body>
    <div id="container"></div>
    <script src="debounce.js"></script>
</body>

</html>
```

debounce.js 文件的代码如下：
  
```javascript

  var count = 1;
  var container = document.getElementById('container');

  function getUserAction(e) {
    container.innerHTML = count++;
  };

  var setUseAction = debounce(getUserAction, 10000, true);

  container.onmousemove = setUseAction;

  document.getElementById("button").addEventListener('click', function(){
    setUseAction.cancel();
  })

  function debounce(func, wait, immediate) {
    let timeout;
    let result;
    var debounced = function () {
      var context = this;
      var args = arguments;

      if (timeout) clearTimeout(timeout);
      if (immediate) {
        // 如果已经执行过，不再执行
        var callNow = !timeout;
        timeout = setTimeout(function(){
          timeout = null;
        }, wait)
        if (callNow) result = func.apply(context, args)
      } else {
        timeout = setTimeout(function(){
          func.apply(context, args)
        }, wait);
      }
      return result;
    };

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = null;
    };
    return debounced;
  }

```

**节流的原理很简单：**

  如果你持续触发事件，每隔一段时间，只执行一次事件。根据首次是否执行以及结束后是否执行，效果有所不同，实现的方式也有所不同。
  我们用 leading 代表首次是否执行，trailing 代表结束后是否再执行一次。

  关于节流的实现，有两种主流的实现方式，一种是使用时间戳，一种是设置定时器。

  **使用时间戳**

    当触发事件的时候，我们取出当前的时间戳，然后减去之前的时间戳，如果大于设置的时间周期，就执行函数，然后更新时间戳为当前的时间戳，如果小于，就不执行。

    代码实现：

  ```jsx

    container.onmousemove = throttle(getUserAction, 1000);

    function throttle(func, wait) {
      var context, args;
      var previous = 0;

      return function() {
        var now = +new Date();
        context = this;
        args = arguments;
        if (now - previous > wait) {
          func.apply(context, args);
          previous = now;
        }
      }
    }

    function getUserAction(e) {
      container.innerHTML = count++;
    };

  ```

   **使用定时器**

   当触发事件的时候，我们设置一个定时器，再触发事件的时候，如果定时器存在，就不执行，直到定时器执行，然后执行函数，清空定时器，这样就可以设置下个定时器。

   ```jsx
    container.onmousemove = throttle(getUserAction, 1000);
    function throttle(func, wait) {
      var timeout;
      var previous = 0;

      return function() {
        context = this;
        args = arguments;
        if (!timeout) {
          timeout = setTimeout(function(){
            timeout = null;
            func.apply(context, args)
          }, wait)
        }
      }
    }

    function getUserAction(e) {
      container.innerHTML = count++;
    };

   ```


第一种事件会立刻执行，第二种事件会在 n 秒后第一次执行
第一种事件停止触发后没有办法再执行事件，第二种事件停止触发后依然会再执行一次事件

那我们想要一个什么样的呢？

有人就说了：无头有尾，或者有头无尾, 这个咋办？

options 作为第三个参数，然后根据传的值判断到底哪种效果，我们约定:

leading：false 表示禁用第一次执行
trailing: false 表示禁用停止触发的回调

所以我们综合两者的优势，然后双剑合璧，写一版代码：

**leading：false 和 trailing: false 不能同时设置**

  如果同时设置的话，比如当你将鼠标移出的时候，因为 trailing 设置为 false，停止触发的时候不会设置定时器，
  所以只要再过了设置的时间，再移入的话，就会立刻执行，就违反了 leading: false，bug 就出来了，

  ```jsx

  var container = document.getElementById('container');
    container.onmousemove = throttle(getUserAction, 1000);
    container.onmousemove = throttle(getUserAction, 1000, { leading: false });
    container.onmousemove = throttle(getUserAction, 1000, { trailing: false });
    function throttle(func, wait, options) {
      var timeout, context, args, result;
      var previous = 0;
      if (!options) options = {};

      var later = function() {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        func.apply(context, args);
        if (!timeout) context = args = null;
      };

      var throttled = function() {
        var now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        console.log(previous, 'previous')
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          previous = now;
          func.apply(context, args);
          if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
      };
      return throttled;
    }

    function getUserAction(e) {
      container.innerHTML = count++;
    };

  ```

