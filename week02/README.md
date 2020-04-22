# Week 02

## 总结

[Week02 总结](https://github.com/wendraw/Frontend-01-Template/blob/master/week02/NOTE.md)

## HomeWork

写一个正则表达式 匹配所有 Number 直接量

```JavaScript
var re = /((((0|[1-9]([0-9]+)?)\.([0-9]+)?([eE][+-]?[0-9]+)?|\.[0-9]+([eE][+-]?[0-9]+)?|(0|[1-9]([0-9]+)?)([eE][+-]?[0-9]+)?)|0[bB][01]+|0[oO][0-7]+|0[xX][0-9a-fA-F]+))/
```

写一个正则表达式，匹配所有的字符串直接量，单引号和双引号

```JavaScript
var re = /(("([^"\r\n\u2028\u2029\\]|\u2028|\u2029|\\((['"\bfnrtv]|[^'"\bfnrtvdxu\r\n\u2028\u2029])|0(?!d)|x[0-9a-fA-F][0-9a-fA-F]|(u[0-9a-fA-F]{4}|u{(0[0-9a-fA-F]{5}|10[0-9a-fA-F]{4}|[0-9a-fA-F]{1,4})}))|\\(\r\n|[\r\n\u2028\u2029]))*"|'([^'\r\n\u2028\u2029\\]|\u2028|\u2029|\\((['"\bfnrtv]|[^'"\bfnrtvdxu\r\n\u2028\u2029])|0(?!d)|x[0-9a-fA-F][0-9a-fA-F]|(u[0-9a-fA-F]{4}|u{(0[0-9a-fA-F]{5}|10[0-9a-fA-F]{4}|[0-9a-fA-F]{1,4})}))|\\(\r\n|[\r\n\u2028\u2029]))*'))/
```

写一个 UTF-8 Encoding 的函数

[UTF-8 Encode](https://github.com/wendraw/Frontend-01-Template/blob/master/week02/codes/utf8.js)
