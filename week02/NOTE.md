# 编程语言通识

## 语言按语法分类

- 非形式语言
  - 中文、英文、阿拉伯文
- 形式语言（乔姆斯基谱系）
  - 0 型：无限制文法
    - 不是真正的无限制，还是有严格的定义
    - ?::=?
      - 意思就是等号左右两边是没有限制的，可以写任何东西，有任意多个，如：<a> <b> ::= "c" <d> <e>
  - 1 型：上下文相关文法
    - 就是一个词放在不同的上下文会有不同的语义
    - ?<A>?::=?<B>?
      - 虽然产生式两边可以有多个，但是只有可以非终结符可以变化。如："a" <b> "c" ::= "a" "x" "c"，就是在 "a" "c" 之间 "x" 会被解析为 <b>
  - 2 型：上下文无关文法
    - 就是放在不同的上下文表达的是同一个意思
    - <A>::=?
      - 等号左边只能有一个非终结符，就可以理解为 <A> 不管放在哪里都是表示右边这些字符。
  - 3 型：正则文法
    - 简单概括，就是能用正则表达式解析的文法
    - <A>::=<A>?（<A>::=?<A> 是非法表达式）
      - 意思就是正则文法只允许左递归，我们通常的递归符合「+\*」之类的都只能跟在字符的后边。

现代编程语言都会将所有「文法」分成「词法」和「语法」，都会先用正则表达式进行一遍粗略的处理，将语言变成单个的词，最后将这个词去进行语法分析。

### 产生式（BNF）

用尖括号括起来的名称，来表示语法结构名

语法结构分成「基础结构」和需要用其他语法结构定义的「复合结构」。

- 基础结构称为「终结符」
- 复合结构称为「非终结符」

引号和中间的字符表示终结符（就是字符串的形式）

可以有括号

\* 表示重复多次

｜表示或

- **表示至少一次**

**思考题：**

将上面的文法用正则写一下

**练习**：

尽可能的寻找你知道的计算机语言，尝试把它们分类

---

```dnf
<Number> = "0" | "1" | "2" | ... | "9"

<DecimalNumber> = "0" | (("1" | "2" | ... | "9") <Number>*)

<PrimaryExpression> ::= <DecimalNumber> |
    "(" <LogicalExpression> ")"

<MultiplicationExpression> ::= <PrimaryExpression> |
    <MultiplicationExpression> "*" <PrimaryExpression> |
    <MultiplicationExpression> "/" <PrimaryExpression>


<AdditionExpression> ::= <MultiplicationExpression> |
    <AdditionExpression> "+" <MultiplicationExpression> |
    <AdditionExpression> "-" <MultiplicationExpression>

<LogicalExpression> ::= <AdditionExpression> |
    <LogicalExpression> "||" <AdditionExpression> |
    <LogicalExpression> "&&" <AdditionExpression>
```

第一个是单个的数字，只能是 0 ～ 9。

第二个是十进制数字，不能以 0 开头。

第三个是最基本的表达式，不带括号时只能是一个数字，带括号时中间可以放一个逻辑运算。

第四个是乘法表达式，第一行是说乘法表达式中的基本单元是 PrimaryExpression，这就意味着 () 的优先级比乘除高。_ 和 / 的表达式都叫做乘法表达式，并且是左结合的（也就是说有连 _ / 的时候从左边开始两两组合先计算）。

第五个是加法表达式，第一行是说最基本单元是乘法表达式，这就意味着乘除的优先级比加减高。然后 + - 的表达式都叫做加法表达式，并且是左结合的。

第六个是逻辑运算表达式，第一行是说最基本单元是加法表达式，也就是加减的优先级比 || && 高。然后有 || && 的表达式都叫做逻辑运算表达式，并且是左结合的。

在 JS 的词法标准中所有的值都可以用 Unicode 来表示，在 ECMA 标准中就叫做 SourceCharacter，这个东西就是 Unicode 字符，用法就是 \u(unicode code point)。如：`u\0041` 就表示字符 A。

然后还有就是 InputElement（输入元素），主要有 5 种类型：

- Whitespace
- LineTerminal
- Comment
- Token

## Unicode

Unicode 是一种字符集，又叫做万国码、国际码、统一码、单一码。收录了目前其他所有的方式的编码类型。

虽然 JavaScript 支持有所的 Unicode 编码，但是最好是保证所有使用的字符都在 ASCII 编码范围内，最多能在 BMP 内使用。

## Whitespace

在 JS 中只有 Unicode 字符编码，所以空白符其实是支持有所的 <USP>（[Unicode Space](https://www.fileformat.info/info/unicode/category/Zs/list.htm)），在 ECMA 标准中着重介绍了下面这 6 中空白符：

- <TAB>
- <VT>
- <FF>
- <SP>
- <NBSP>
- <ZWNBSP>

<TAB> 全称叫做 `CHARACTER TABULATION`，就是「制表符」，键盘上的 tab 键，按下之后有一个特性，会补充前面的字符直到 4 个字符（也有的是 8 个字符，取决于编译器）。

tab 的最开始的作用就是用来制表，通过 tab 补充空格之后，所有的值会对应的非常整齐。如下：

```
12  34  wee
ass 567 345
1   dfh 346
```

<VT> 全称叫做 `LINE TABULATION`，就是「**纵向**制表符」，在 JS 中就是用 "\v" 字符来表示。在 JS 中没有什么特别的作用。

<FF> 全称叫做 `FORM FEED`，。。。。。。。。。。

<SP> 全称叫做 `SPACE`，也就是普通的空格。

<NBSP> 全称叫做 `NO-BREAK SPACE`，显示的效果是一个空格，但其实还有一个分词的效果。用 <NBSP> 分开的两个词，在显示框宽度不够需要分词时，会将这两个单词看作一个整体。

<ZWNBSP> 的全称叫做 `ZERO WIDTH NO-BREAK SPACE`，就是「零宽空格」，也叫做 [BOM (Byte order mask) ](https://en.wikipedia.org/wiki/Byte_order_mark) 是微软搞出来的一种区分文件编码格式的方式，会在文件的最前面插入一个零宽空格。

在平时工作中，尽量只使用 <SP>。

## LineTerminal

LineTerminal 就是我们说的换行符了，同样所有的 Unicode 的换行符都是支持的，但是在 ECMA 中主要是介绍了下面 4 种：

- <LF>
- <CR>
- <LS>
- <PS>

<LF> 全称叫做 `LINE FEED`，也就是「换行」，在 JS 中就是 "\r"。

<CR> 全称叫做 `CARRIAGE RETURN`，就是「回车」，在 JS 中就是 "\n"。

<LS> 全称叫做 `LINE SEPARATOR`，就是「分行符」。

<PS> 全称叫做 `PARAGRAPH SEPARATOR`，就是「分段符」。

在工作中只要用 <LF> 和 <CR> 即可。

## Comment

Comment 就是我们用的最多的注释了，主要包含「单行注释」和「多行注释」。

其中多行注释的 \* 不能使用 Unicode 编码（"\u002a"）来代替。而且不能使用嵌套。

## Token

Token 没有比较好的中文翻译，我们理解成「有效的输入元素」即可，虽然 ECMA 里面介绍了很多类型，但是我们主要可以分成以下几类：

- Keywords
- Punctuator
- Identifier
- Literal

Identifier 就是标识符，也就是一个名字。其实 Identifier 还可以分为「变量名」和「属性名」，其中变量名不能包含「关键字」，但是「属性名」是可以的。因为引擎在扫描时都会识别为一个 IdentifierName，不会管是不是关键字，只有到执行时才会去分析是不是关键字。比如 get、class 等，放在特定的地方是关键字，但是又可以当作变量名来申明。

```JavaScript
var get = 1; // 变量名
{
    get a(){} // 关键字
}

document.body.class = 10;   // 变量名

// 关键字，需要用 className 读取
document.body.setAttribute('class', 100)
document.body.className // "100"
```

所以 ECMA 中是这样分的。

- IdentifierName
  - Keywords
  - Identifier

Punctuator 就是符号，也就是我们常用 ; + 等等。

Literal 就是直接量，也就是我们常用的 1、"aa"、true、null 等等。

keywords 就是关键字，也就是我们常用的 if、for 等等。
