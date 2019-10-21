### JavaScript专题之数组去重

**双层循环**

  也许我们首先想到的是使用 indexOf 来循环判断一遍，但在这个方法之前，让我们先看看最原始的方法：

```javascript
  var array = [1, 1, '1', '1'];

  function unique(array) {
    // res用来存储结果
    var res = [];
    for (var i = 0, arrayLen = array.length; i < arrayLen; i++) {
      for (var j = 0, resLen = res.length; j < resLen; j++ ) {
        if (array[i] === res[j]) {
          break;
        }
      }
        // 如果array[i]是唯一的，那么执行完循环，j等于resLen
        if (j === resLen) {
          res.push(array[i])
        }
    }
    return res;
  }

  console.log(unique(array)); // [1, "1"]
```

在这个方法中，我们使用循环嵌套，最外层循环 array，里面循环 res，如果 array[i] 的值跟 res[j] 的值相等，就跳出循环，如果都不等于，说明元素是唯一的，这时候 j 的值就会等于 res 的长度，根据这个特点进行判断，将值添加进 res。

看起来很简单吧，之所以要讲一讲这个方法，是因为——————兼容性好！


**indexOf**

我们可以用 indexOf 简化内层的循环：
  
```javascript

  var array = [1, 1, '1'];

  function unique(array) {
    var res = [];
    for (var i = 0, len = array.length; i < len; i++) {
      var current = array[i];
      if (res.indexOf(current) === -1) {
        res.push(current)
      }
    }
    return res;
  }

  console.log(unique(array));

```

**排序后去重**

  试想我们先将要去重的数组使用 sort 方法排序后，相同的值就会被排在一起，然后我们就可以只判断当前元素与上一个元素是否相同，相同就说明重复，不相同就添加进 res，让我们写个 demo：

  ```jsx
  var array = [1, 1, '1'];

  function unique(array) {
    var res = [];
    var sortedArray = array.concat().sort();
    var seen;
    for (var i = 0, len = sortedArray.length; i < len; i++) {
      // 如果是第一个元素或者相邻的元素不相同
      if (!i || seen !== sortedArray[i]) {
          res.push(sortedArray[i])
      }
      seen = sortedArray[i];
    }
    return res;
  }

  console.log(unique(array));
  ```
  如果我们对一个已经排好序的数组去重，这种方法效率肯定高于使用 indexOf。

  **unique API**

    知道了这两种方法后，我们可以去尝试写一个名为 unique 的工具函数，我们根据一个参数 isSorted 判断传入的数组是否是已排序的，如果为 true，我们就判断相邻元素是否相同，如果为 false，我们就使用 indexOf 进行判断：

  ```jsx

    var array1 = [1, 2, '1', 2, 1];
    var array2 = [1, 1, '1', 2, 2];

    // 第一版
    function unique(array, isSorted) {
        var res = [];
        var seen = [];

        for (var i = 0, len = array.length; i < len; i++) {
            var value = array[i];
            if (isSorted) {
                if (!i || seen !== value) {
                    res.push(value)
                }
                seen = value;
            }
            else if (res.indexOf(value) === -1) {
                res.push(value);
            }        
        }
        return res;
    }

    console.log(unique(array1)); // [1, 2, "1"]
    console.log(unique(array2, true)); // [1, "1", 2]

  ```

  **优化**

  尽管 unqique 已经可以试下去重功能，但是为了让这个 API 更加强大，我们来考虑一个需求：

  新需求：字母的大小写视为一致，比如'a'和'A'，保留一个就可以了！

  虽然我们可以先处理数组中的所有数据，比如将所有的字母转成小写，然后再传入unique函数，但是有没有方法可以省掉处理数组的这一遍循环，直接就在去重的循环中做呢？让我们去完成这个需求：

   ```jsx
    var array3 = [1, 1, 'a', 'A', 2, 2];

    // 第二版
    // iteratee 英文释义：迭代 重复
    function unique(array, isSorted, iteratee) {
      var res = [];
      var seen = [];

      for (var i = 0, len = array.length; i < len; i++) {
        var value = array[i];
        var computed = iteratee ? iteratee(value, i, array) : value;
        if (isSorted) {
          if (!i || seen !== computed) {
              res.push(value)
          }
          seen = computed;
        }
        else if (iteratee) {
          if (seen.indexOf(computed) === -1) {
            seen.push(computed);
            res.push(value);
          }
        }
        else if (res.indexOf(value) === -1) {
          res.push(value);
        }        
      }
      return res;
    }

    console.log(unique(array3, false, function(item){
      return typeof item == 'string' ? item.toLowerCase() : item
    })); // [1, "a", 2]

   ```

**filter**

ES5 提供了 filter 方法，我们可以用来简化外层循环：

比如使用 indexOf 的方法：

```jsx

  var array = [1, 2, 1, 1, '1'];

  function unique(array) {
    var res = array.filter(function(item, index, array){
      return array.indexOf(item) === index;
    })
    return res;
  }

  console.log(unique(array));
  // 排序去重的方法：

  var array = [1, 2, 1, 1, '1'];

  function unique(array) {
    return array.concat().sort().filter(function(item, index, array){
      return !index || item !== array[index - 1]
    })
  }

  console.log(unique(array));

```

**Object 键值对**


这种方法是利用一个空的 Object 对象，我们把数组的值存成 Object 的 key 值，比如 Object[value1] = true，在判断另一个值的时候，如果 Object[value2]存在的话，就说明该值是重复的。示例代码如下：

```jsx

var array = [1, 2, 1, 1, '1'];

function unique(array) {
    var obj = {};
    return array.filter(function(item, index, array){
        return obj.hasOwnProperty(item) ? false : (obj[item] = true)
    })
}
console.log(unique(array)); // [1, 2]

```


我们可以发现，是有问题的，因为 1 和 '1' 是不同的，但是这种方法会判断为同一个值，这是因为对象的键值只能是字符串，所以我们可以使用 typeof item + item 拼成字符串作为 key 值来避免这个问题：

```jsx

var array = [1, 2, 1, 1, '1'];

function unique(array) {
    var obj = {};
    return array.filter(function(item, index, array){
        return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
    })
}

console.log(unique(array)); // [1, 2, "1"]

```

然而，即便如此，我们依然无法正确区分出两个对象，比如 {value: 1} 和 {value: 2}，因为 typeof item + item 的结果都会是 object[object Object]，不过我们可以使用 JSON.stringify 将对象序列化：

```jsx

var array = [{value: 1}, {value: 1}, {value: 2}];

function unique(array) {
    var obj = {};
    return array.filter(function(item, index, array){
        console.log(typeof item + JSON.stringify(item))
        return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ? false : (obj[typeof item + JSON.stringify(item)] = true)
    })
}

console.log(unique(array)); // [{value: 1}, {value: 2}]

```

**ES6**

随着 ES6 的到来，去重的方法又有了进展，比如我们可以使用 Set 和 Map 数据结构，以 Set 为例，ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

是不是感觉就像是为去重而准备的？让我们来写一版：

```jsx

var array = [1, 2, 1, 1, '1'];

function unique(array) {
   return Array.from(new Set(array));
}

console.log(unique(array)); // [1, 2, "1"]
// 甚至可以再简化下：

function unique(array) {
    return [...new Set(array)];
}
// 还可以再简化下：

var unique = (a) => [...new Set(a)]
// 此外，如果用 Map 的话：

function unique (arr) {
    const seen = new Map()
    return arr.filter((a) => !seen.has(a) && seen.set(a, 1))
}


```
