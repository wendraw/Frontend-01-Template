const express = require("express");
const router = express.Router();
const fs = require("fs");
const unzipper = require("unzipper");
const https = require("https");

/* GET home page. */
router.post("/", function (request, response, next) {
  // if (!request.query.filename) return;
  // let writeStream = fs.createWriteStream("../server/public/" + request.query.filename);

  console.log(request.headers.xtoken);
  const options = {
    hostname: "api.github.com",
    port: 443,
    path: "/user",
    headers: {
      Authorization: `token ${request.headers.xtoken}`,
      "User-Agent": "toy-publish-server",
    },
  };

  const req = https.request(options, (res) => {
    let body = "";
    res.on("data", (d) => {
      body += d.toString();
    });
    res.on("end", () => {
      let user = JSON.parse(body);
      console.log(user);
      // TODO: 权限检查

      let writeStream = unzipper.Extract({ path: "../server/public" });
      request.pipe(writeStream);

      request.on("end", () => {
        response.send("okay");
      });
    });
  });
  req.on("error", (err) => {
    console.log(err);
  });
  req.end();
});

router.get("/auth", (request, response) => {
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

          response.set("Content-Type", "text/html");
          response.send(
            `<a href="http://localhost:8080/publish?token=${access_token}">publish</a>`
          );
        } else {
          response.set("Content-Type", "text/string");
          response.send("error");
        }
      });
    });
    req.on("error", (e) => {
      console.error(e);
    });
    req.end();
  })();
});

module.exports = router;
