require("dotenv").config();
const http = require("http");
const app = require("./app");
const server = http.createServer(app);

const port = process.env.PORT;
server.listen(port, isConnect());

server.on("error", (e) => {
  if (e.code === "EADDRINUSE") {
    console.error("Address in use, retrying...");
    setTimeout(() => {
      server.close();
      server.listen(port, isConnect());
    }, 3000);
  }
});

function isConnect() {
  console.log("Connect to port: ", port);
}
