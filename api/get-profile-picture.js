const { getUserDetails } = require("./get-user-details");

/**
 * @param {string} userJSON 
 * @returns {string}
 */
function pictureLinkCreator(userJSON) {
    /**@type {import('./get-user-details').SimplifiedDiscordUser} */
    const userOBJ = JSON.parse(userJSON);
    if (userOBJ.avatar)
        if (userOBJ.avatar.startsWith("a_")) //Animated avatar
            return `https://cdn.discordapp.com/avatars/${userOBJ.id}/${userOBJ.avatar}.gif?size=4096`;

        else //Still avatar
            return `https://cdn.discordapp.com/avatars/${userOBJ.id}/${userOBJ.avatar}.webp?size=4096`;

    else //No avatar
        return `https://cdn.discordapp.com/embed/avatars/${Number(userOBJ.discriminator) % 5}.png`;
}

const idParserRegexp = /id\=(.*)/;

/**@type {import("@fbarda/dirty-serve").APICallback} */
function handleApi(request, response) {
    const id = idParserRegexp.exec(request.url)[1];
    return getUserDetails(id).then(pictureLinkCreator).then(
        link => {
            response.writeHead(200, "OK", { "Content-Type": "text/plain" });
            response.write(link);
            response.end();
        },
        err => {
            response.writeHead(500, "Internal Server Error", { "Content-Type": "text/plain; charset=utf-8" });
            response.write("Some error happened lol I'm lazy. Make sure you have entered the correct ID. Refer to the howto page for more details.");
            response.end();
            console.log("API FAILED WITH ID '" + id + "' AND ERROR: " + err.message ? err.message : err);
        });
}

exports.apiHandler = handleApi;
