# 每周总结可以写在这里

在上节介绍过浏览器访问网页的工作流程，第一步就是通过 HTTP 协议向服务器发送 URL 文本。

## HTTP 协议

HTTP 的标准是由 IETF 组织制定，跟它相关的标准主要有两份：

- HTTP1.1: [rfc2612](https://tools.ietf.org/html/rfc2616) Hypertext Transfer Protocol -- HTTP/1.1
- HTTP1.1: [rfc7234](https://tools.ietf.org/html/rfc7234) Hypertext Transfer Protocol (HTTP/1.1): Caching

我们前面已经介绍过了 TCP 是一个流，只会保证所有数据包是按照顺序传递过来的。HTTP 协议是基于 TCP 协议实现的，在 TCP 的基础上规定了一个 Request-Response 的模式。这个模式就是客户端发送消息给服务端，服务端才能返回消息给客户端，服务端不能主动发送消息。

### HTTP 协议格式

HTTP 协议大概可以划分成 Request 和 Response。

#### Request

Request 是客户端需要发送到服务端的数据，可以分成下面这三部分：

- Request-Line（请求行）
  - method（方法）
  - URL
  - version（版本）
- request-header（头）
- message-body（实体）

具体的数据格式是这样子：

![HTTP 请求数据格式](https://static001.geekbang.org/resource/image/10/74/10ff27d1032bf32393195f23ef2f9874.jpg)

##### Request-Line（请求行）

其中请求行可以分为 method、URL、version。其中 `URL` 就是我们想要访问的地址。`version` 就是使用的 HTTP 的版本号，如：HTTP 1.1。

比较复杂的是 `method`，在 rfc2612 中定义了下面这些：

![2ad8fe965269b6f20e36e040f8a9d743.png](evernotecid://24D8BB77-62B0-48F2-A4FF-D42E38FEAED8/appyinxiangcom/24132492/ENResource/p516)

通过浏览器地址栏访问页面都是 `GET` 方法。

表单提交会产生 `POST` 方法。

`HEAD` 则是跟 GET 类似，只返回请求头，多数由 JavaScript 发起。

`PUT` 和 `DELETE` 分别表示添加资源和删除资源，但实际上这只是语义上的约定，没有强制约束，具体还是要看服务端怎么实现。

`CONNECT` 现在多用于 HTTPS 和 WebSocket。

`OPTIONS` 和 `TRACE` 一般用于调试，多数线上服务器不会支持。

还有就是可以定义自己的 method 字段。

##### Request Header（请求头）

Request Header 可以看作一个键值对。原则上，请求头是一种数据可以自己定义。不过在 rfc2612 中，已经规定了一些特殊的请求头，详细的可以看 [5.3 Request Header Fields](https://tools.ietf.org/html/rfc2616#section-5.3)。

重点的需要记住下面这些：
![Request Header](https://static001.geekbang.org/resource/image/2b/a2/2be3e2457f08bdf624837dfaee01e4a2.png)

##### Request Body（请求体）

HTTP 的请求体主要用于表单提交的场景。其实，HTTP 标准对请求体没什么要求，只要浏览器端发送的 body 服务端认可就可以了。一些常见的 body 格式是：

- application/json
- application/x-www-form-urlencoded
- multipart/form-data
- text/xml

其中，我们使用 HTML 的 form 标签提交，产生的 HTTP 请求默认会产生 application/x-www-form-urlencoded 的数据格式。当有文件上传时，会使用 multipart/form-data。

#### Response

Response 是服务端返回给客户端的数据，对应的也可以分成三部分：

- Response Line（响应行）
  - version（版本）
  - status code（状态码）
  - status text（状态文本）
- Response Header（响应头）
- message-body（实体）

具体的数据格式是这样子：

![HTTP 响应数据格式](https://static001.geekbang.org/resource/image/1c/c1/1c2cfd4326d0dfca652ac8501321fac1.jpg)

##### Response Line（响应行）

响应行又可以分为 version、status code、status text。version 跟 Request 一致，重要要介绍后两个，这部分在 rfc2612 中有详细的定义 [6.1.1 Status Code and Reason Phrase](https://tools.ietf.org/html/rfc2616#section-6.1.1)。

常见的有以下几种：

- 1xx：临时回应，表示客户端请继续。
- 2xx：请求成功。
  - 200：请求成功。状态文本 OK
- 3xx：表示请求的目标有变化，希望客户端进一步处理。
  - 301：永久性的跳转。状态文本 Moved Permanently
  - 302：临时性的跳转。状态文本 Found
  - 304：跟客户端缓存没有更新。状态文本 Not Modified
- 4xx：客户端请求错误。
  - 403：无权限。状态文本 Forbidden
  - 404：请求的页面不存在 Not Found
  - 418：It’s a teapot. 这是一个彩蛋，来自 ietf 的一个愚人节玩笑。（[超文本咖啡壶控制协议](https://tools.ietf.org/html/rfc2324)）
- 5xx：服务端错误
  - 500：服务端错误。状态文本 Internal Server Error
  - 503：服务端暂时性错误，可以稍后再试。状态文本 Service Unavailable

1xx 系列的状态直接被浏览器的 HTTP 库处理了，上层代码不会收到。

##### Response Header（响应头）

响应头跟请求头类似，字段有一些不一样。主要是下面这些需要记住：
![Response Header](https://static001.geekbang.org/resource/image/ef/c9/efdeadf27313e08bf0789a3b5480f7c9.png)

##### Response Body

Response Body 就是服务端给返回的 HTML 代码了。
