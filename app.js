const server = require("@fbarda/dirty-serve"),
    { apiHandler: getBannerAPI } = require("./api/get-profile-banner"),
    { apiHandler: getPfpApi } = require("./api/get-profile-picture");

server.apiPageHandlers.add("/api/getpfp", getPfpApi);
server.apiPageHandlers.add("/api/getbanner", getBannerAPI);
server.staticServer.searchPath = "./web/";
server.port = require("process").env["PORT"] || 8080;
server.startServer();
