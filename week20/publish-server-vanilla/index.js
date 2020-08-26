const http = require("http");
const unzipper = require("unzipper");
const https = require("https");

const server = http.createServer((request, response) => {
  if (request.url.match(/\/auth/)) {
    return auth(request, response);
  }

  if (request.url.match(/\/$/)) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("not found");
    return;
  }

  const options = {
    hostname: "api.github.com",
    port: 443,
    path: "/user",
    headers: {
      Authorization: `token ${request.headers.xToken}`, // 这里得不到 token
      "User-Agent": "toy-publish-server",
    },
  };

  let writeStream = unzipper.Extract({ path: "../server/public" });
  request.pipe(writeStream);

  request.on("end", () => {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("okay");
  });

  //   const req = http.request(options, (res) => {
  //     let body = "";
  //     res.on("data", (d) => {
  //       body += d.toString();
  //     });
  //     res.on("end", () => {
  //       let user = JSON.parse(body);
  //       console.log(user);
  //       // TODO: 权限检查

  //       let writeStream = unzipper.Extract({ path: "../server/public" });
  //       request.pipe(writeStream);

  //       request.on("end", () => {
  //         response.writeHead(404, { "Content-Type": "text/plain" });
  //         response.end("okay");
  //       });
  //     });
  //   });
  //   req.on("error", (e) => {
  //     console.log(e);
  //   });
  //   req.end();
});

function auth(request, response) {
  let code = request.url.match(/code=([^&]+)/)[1];
  let client_id = "Iv1.8513d6aade92ce5a";
  let redirect_uri = encodeURIComponent("http://localhost:8081/auth");
  let state = "abc123";
  let client_secret = "1b08a5b1759769c4cd26a55426305f76d294f9b0";

  let params = `code=${code}&redirect_uri=${redirect_uri}&state=${state}&client_id=${client_id}&client_secret=${client_secret}`;
  let url = `https://github.com/login/oauth/access_token?${params}`;

  (() => {
    const options = {
      hostname: "github.com",
      port: 443,
      path: `/login/oauth/access_token?${params}`,
      method: "POST",
    };
    const req = https.request(options, (res) => {
      res.on("data", (d) => {
        let matched = d.toString().match(/access_token=([^&]+)/);

        if (matched) {
          let access_token = matched[1];
          console.log(access_token);

          response.writeHead(200, {
            access_token: access_token,
            "Content-Type": "text/html",
          });
          response.end(
            `<a href="http://localhost:8080/publish?token=${access_token}" target="_blank">publish</a>`
          );
        } else {
          response.writeHead(200, { "Content-Type": "text/plain" });
          response.end("error");
        }
      });
    });
    req.on("error", (e) => {
      console.error(e);
    });
    req.end();
  })();
}

server.listen(8081);
