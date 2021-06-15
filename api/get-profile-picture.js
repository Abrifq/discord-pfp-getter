const process = require("process"), { get } = require("https");

//set TOKEN environment variable to use this
const discordAPIToken = process.env["TOKEN"];

if (!discordAPIToken)
    throw "API token is not found. Please make sure to set the TOKEN environment variable.";

/**
 * @param {string} userJSON 
 * @returns {string}
 */
function pictureLinkCreator(userJSON) {
    /**@type {SimplifiedDiscordUser} */
    const userOBJ = JSON.parse(userJSON);
    if (userOBJ.avatar)
        if (userOBJ.avatar.startsWith("a_")) //Animated avatar
            return `https://cdn.discordapp.com/avatars/${userOBJ.id}/${userOBJ.avatar}.gif?size=4096`;

        else //Still avatar
            return `https://cdn.discordapp.com/avatars/${userOBJ.id}/${userOBJ.avatar}.webp?size=4096`;

    else //No avatar
        return `https://cdn.discordapp.com/embed/avatars/${Number(userOBJ.discriminator) % 5}.png`;
}

/**
 * @param {string} id 
 * @returns {Promise<string>}
 */
function getProfilePicture(id) {
    return new Promise((resolve, reject) => {
        const request = get("https://discord.com/api/v9/users/" + id, { headers: { "Authorization": "Bot " + discordAPIToken } });
        request
            .on("response", rsp => {
                const chunks = [];
                rsp
                    .on("data", chunk => chunks.push(chunk))
                    .once("error", reject)
                    .once("end", () => resolve(chunks.map(chunk => chunk.toString()).join("")));
            })
            .on("abort", () => reject("aborted"))
            .on("timeout", () => reject("timed out"))
            .on("error", reject);
    }).then(pictureLinkCreator);
}


const idParserRegexp = /id\=(\d+)/;

/**@type {import("../gitmodules/serve-module/apiHandlerPool").APICallback} */
function handleApi(request, response) {
    const id = idParserRegexp.exec(request.url.split("?")[1])[1];
    return getProfilePicture(id).then(
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

/**
 * @typedef SimplifiedDiscordUser - Waay simplified and stripped down version of User Object.
 * @prop {string} id - Snowflake ID of the user.
 * @prop {string} discriminator - The 4 digit hash of the user
 * @prop {string | null} avatar - The avatar hash of the user's avatar picture.
 */