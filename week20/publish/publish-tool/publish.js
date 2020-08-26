const http = require("http");
const fs = require("fs");
const archiver = require("archiver");
const child_process = require("child_process");

let redirect_uri = encodeURIComponent("http://localhost:8081/auth");
child_process.exec(
  `open https://github.com/login/oauth/authorize?client_id=Iv1.8513d6aade92ce5a&redirect_uri=${redirect_uri}&scope=read:user&state=abc123`
);

const server = http.createServer((request, response) => {
  if (request.url.match(/\/favicon.ico$/)) {
    response.writeHead(404, { "Content-Type": "text/plain" });
    response.end("not found");
    return;
  }

  let token = request.url.match(/token=([^&]+)/)[1];
  console.log(request.url);
  console.log("real publish!!!");

  const options = {
    host: "localhost",
    port: 8081,
    path: "/?filename=" + "package.zip",
    method: "POST",
    header: {
      "xToken": token,
      "Content-Type": "application/octet-stream",
    },
  };

  // Make a request
  const req = http.request(options, (res) => {
    console.log(res);
  });

  req.on("error", (err) => {
    console.error(err);
  });

  let packageName = "./package";
  let archive = archiver("zip", {
    zlib: { level: 9 }, // compression level
  });
  archive.directory(packageName, false);
  archive.pipe(req);
  archive.finalize();

  archive.on("end", () => {
    req.end();
    console.log("publish success!!");
    response.end("publish success!!");
    server.close();
  });
});
server.listen(8080);
