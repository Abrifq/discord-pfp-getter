const server = require("./gitmodules/serve-module"),
    { apiHandler: getPfpApi } = require("./api/get-profile-picture");

server.apiPageHandlers.add("/api/getpfp", getPfpApi);
server.staticServer.searchPath = "./web/";
server.port = require("process").env["PORT"] || 8080;
server.startServer();