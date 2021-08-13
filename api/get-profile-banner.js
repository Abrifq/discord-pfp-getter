const { getUserDetails } = require('./get-user-details');

/**
 * @param {string} userJSON 
 * @returns {string}
 */
function bannerLinkCreator(userJSON) {
    /**@type {import('./get-user-details').SimplifiedDiscordUser} */
    const userOBJ = JSON.parse(userJSON);
    if (userOBJ.banner)
        if (userOBJ.banner.startsWith("a_")) //Animated banner
            return `https://cdn.discordapp.com/banners/${userOBJ.id}/${userOBJ.banner}.gif?size=4096`;

        else //Still banner
            return `https://cdn.discordapp.com/banners/${userOBJ.id}/${userOBJ.banner}.png?size=4096`;

    else //No banner
        return "This user does not use a banner.";
}

const idParserRegexp = /id\=(.*)/;

/**@type {import("@fbarda/dirty-serve").APICallback} */
function handleApi(request, response) {
    const id = idParserRegexp.exec(request.url)[1];
    return getUserDetails(id).then(bannerLinkCreator).then(
        link => {
            response.writeHead(200, "OK", { "Content-Type": "text/plain" });
            response.write(link);
            response.end();
        },
        err => {
            response.writeHead(500, "Internal Server Error", { "Content-Type": "text/plain; charset=utf-8" });
            response.write("Some error happened lol I'm lazy. Make sure you have entered the correct ID or the user has a banner. Refer to the howto page for more details.");
            response.end();
            console.log("API FAILED WITH ID '" + id + "' AND ERROR: " + err.message ? err.message : err);
        });
}

exports.apiHandler = handleApi;