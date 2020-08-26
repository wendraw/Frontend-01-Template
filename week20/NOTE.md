# 每周总结可以写在这里

## lint 与 PhantomJS

lint 是工具链的一个小环节，用来统一团队的代码风格的。前端一般用的是 ESLint。

PhantomJS 是一个「无头浏览器」，与正常浏览器的差别就是不会将页面渲染出来。一般是用来完善 mocha 的单元测试能力，因为 mocha 是不能测试 UI 的。如果没有一个自动化测试工具，就需要我们手动的去测试每个页面，还可能会存在漏侧的情况。

PhantomJS 的用法就是，我们可以得到页面的 DOM 树，然后写代码去对比与我们预期的 DOM 树是不是一致的。

> PhantomJS 不足的地方就是它支持的 Node 版本太低了，并且很多年没有人维护了，会有很多 bug。 winter 老师在课上也没能成功跑起来 orz

## OAuth

我们上一节做的发布系统，目前是任何人都能直接打包上传。这个在真正的开发很明显是不行的，因此我们需要一个权限管理系统来处理权限的问题。

OAuth 其实是一个开源的权限管理系统，很多大公司的权限系统都支持这个。因此我们只学习 GitHub 的权限系统，就能使用其他公司的。而且这个东西其实很简单，我们重在理解整个流程。

这个授权的流程，网上有个大佬讲的特别明白，可以看看 https://justauth.wiki/#/quickstart/oauth

不过在我们的发布系统里，需要讲的更细一点。

1. 创建 GitHub OAuth App，地址在 https://github.com/settings/apps，主要是要配置 `Homepage URL` 和 `User authorization callback URL`，Webhook 一般不需要用取消这个配置。

2. publish-tool 向 GitHub 发起身份请求。其中 client_id 是上一步创建 App 得到的，具体的做法：https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#1-request-a-users-github-identity。

3. 用户登陆账号，并授权给我们的 GitHub App。然后就会跳转到我们第一步填好的 http://localhost:8081/auth，并且会带上一个 code 参数。http://localhost:8081 这个地址其实就是我们的服务器地址。

4. 处理 /auth 请求。我们在请求的 URL 上能得到用户的 code，通过这个 code 我们就可以来请求用户的 access_token，因此我们需要按照规则给 GitHub 发送一个 HTTPS 的 POST 请求。然后就拿到了用户的 access_token。详细的做法可以看 https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#2-users-are-redirected-back-to-your-site-by-github

5. 将 access_token 通过浏览器传回给 publish-tool，我们这里 server 是给 浏览器返回了一个 a 标签（`<a href="http://localhost:8080/publish?token=${access_token}">publish</a>`）。我们的 publish-tool 有一个 http://localhost:8080 服务，因此用户点击这个链接时，publish-tool 可以得到这个 access_token。

6. tool 给 server 发送请求，access_token 要丢在 headers 里面，并且把代码压缩用流的方式传过去。 

7. server 收到 tool 的请求，并且从 headers 里面拿到了 access_token。将 access_token 传到 GitHub API 请求用户的基本信息。具体做法 https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#3-use-the-access-token-to-access-the-api

8. 验证用户权限。（这个需要配合公司的权限系统）

9. 接收 tool 传过来的代码包，并且解压到目标文件夹（这个一般是线上服务器）。
