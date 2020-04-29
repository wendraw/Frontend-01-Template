# 每周总结可以写在这里

## 找出 JS 中所有个特殊对象

在 ECMA 中特殊对象叫做 exotic object，其定义是：

> An exotic object is any form of object whose property semantics differ in any way from the default semantics.

大意是说 exotic object 是属性和语义与一般的 object 有不同的对象。

这些对象有一些奇怪的属性跟行为，而且我们还无法用 JS 代码模拟。那么 JS 中到底有多少这样的对象呢？在 ECMA 标准中有总结出来，在 9.4 Built-in Exotic Object Internal Methods and Slots 这一节。

### 9.4.1 Bound Function Exotic Objects

ECMA 的介绍如下：

> A bound function is an exotic object that wraps another function object. A bound function is callable (it has a [[Call]] internal method and may have a [[Construct]] internal method). Calling a bound function generally results in a call of its wrapped function.
> 
> Bound function objects do not have the internal slots of ECMAScript function objects defined in Table 27. Instead they have the internal slots defined in Table 28.

由这个我们可以得知，第一个特殊的对象就是用 `Function.prototype.bind()` 绑定之后返回的**函数对象**。这个还是还是可以被调用，因为它有 [[Call]] 和 [[Construct]]。

但是没有一般的 Function 对象那些属性，而是有下面这三个属性。

* [[BoundTargetFunction]] 包装过的函数对象。
* [[BoundThis]] 当调用包装过的函数对象时，始终以this值形式传递的值。
* [[BoundArguments]] 值列表，其元素用作对包装函数的任何调用的第一个参数。

### 9.4.2 Array Exotic Objects

这个特殊对象就是 JS 中的 `Array` 数组，也是我们非常熟悉的对象。

它的特殊行为是，length 属性会根据最大的下标值发生变化。

```js
let arr = [];
arr[100] = 10;
arr.length; // 101
```

### 9.4.3 String Exotic Objects

ECMA 的介绍如下：

> A String object is an exotic object that encapsulates a String value and exposes virtual integer-indexed data properties corresponding to the individual code unit elements of the String value. String exotic objects always have a data property named "length" whose value is the number of code unit elements in the encapsulated String value. Both the code unit data properties and the "length" property are non-writable and non-configurable.
> 
> String exotic objects have the same internal slots as ordinary objects. They also have a [[StringData]] internal slot.

由此我们可以得知，日常用的最多的 `String` 对象也是一个特殊的对象。

它也有一个 length 属性，记录了字符串中有多少个字符，可以支持像数组一样通过下标访问对应位置的字符。并且这个 length 是 non-writable and non-configurable，也就是不可写，不可设置的。

除了拥有和普通对象一样的 internal slots（内部属性）外，还有一个 [[StringData]] 的属性。

### 9.4.4 Arguments Exotic Objects

ECMA 的介绍如下：

> Most ECMAScript functions make an arguments object available to their code. Depending upon the characteristics of the function definition, its arguments object is either an ordinary object or an arguments exotic object. An arguments exotic object is an exotic object whose array index properties map to the formal parameters bindings of an invocation of its associated ECMAScript function.
> 
> Arguments exotic objects have the same internal slots as ordinary objects. They also have a [[ParameterMap]] internal slot. Ordinary arguments objects also have a [[ParameterMap]] internal slot whose value is always undefined. For ordinary argument objects the [[ParameterMap]] internal slot is only used by Object.prototype.toString (19.1.3.6) to identify them as such.

这一个特殊对象就是 `Arguments` 对象，它将函数中的参数集合到了一起，并且映射成数组下标的形式，也就是可以像数组一样通过 arguments 访问对应的参数。

### 9.4.5 Integer-Indexed Exotic Objects

ECMA 的介绍如下：

> An Integer-Indexed exotic object is an exotic object that performs special handling of integer index property keys. 
> 
> Integer-Indexed exotic objects have the same internal slots as ordinary objects and additionally [[ViewedArrayBuffer]], [[ArrayLength]], [[ByteOffset]], and [[TypedArrayName]] internal slots.

这个介绍说的比较含糊，我们只知道它是会对 integer 型下标索引进行特殊处理，并且有 [[ViewedArrayBuffer]], [[ArrayLength]], [[ByteOffset]] 和 [[TypedArrayName]] 几个内部属性。通过这几个属性往下查找很容易就知道，将的就是 `ArrayBuffer` 和 `TypeArray` 这一系列的对象。

ArrayBuffer 和 TypeArray 跟内存块相关联，下标运算比较特殊。

### 9.4.6 Module Namespace Exotic Objects

ECMA 的介绍如下：

> A module namespace object is an exotic object that exposes the bindings exported from an ECMAScript Module (See 15.2.3). There is a one-to-one correspondence between the String-keyed own properties of a module namespace exotic object and the binding names exported by the Module. The exported bindings include any bindings that are indirectly exported using export * export items. Each String-valued own property key is the StringValue of the corresponding exported binding name. These are the only String-keyed properties of a module namespace exotic object. Each such property has the attributes { [[Writable]]: true, [[Enumerable]]: true, [[Configurable]]: false }. Module namespace objects are not extensible.

这个特殊对象就是模块的 `namespace`，跟普通对象差别非常大，我没有用过不太了解这个对象。winter 老师建议用 import 而不是 namespace。

### 9.4.7 Immutable Prototype Exotic Objects

ECMA 的介绍如下：

> An immutable prototype exotic object is an exotic object that has a [[Prototype]] internal slot that will not change once it is initialized.
> 
> Immutable prototype exotic objects have the same internal slots as ordinary objects. They are exotic only in the following internal methods. All other internal methods of immutable prototype exotic objects that are not explicitly defined below are instead defined as in ordinary objects.

最后一个特殊对象介绍的是所有对象的祖先 `Object.prototype`。当调用 SetPrototypeOf 给 Object.prototype 设置一个原型时，就会抛出错误提示不能为其设置原型。