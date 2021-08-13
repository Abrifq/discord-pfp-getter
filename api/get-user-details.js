const process = require("process"), { get } = require("https");

//set TOKEN environment variable to use this
const discordAPIToken = process.env["TOKEN"];

if (!discordAPIToken)
    throw "API token is not found. Please make sure to set the TOKEN environment variable.";

/**
 * @param {string} id
 * @returns {Promise<string>}
 */
const getUserDetails = (id) => new Promise((resolve, reject) => {
    const request = get("https://discord.com/api/v9/users/" + id, { headers: { "Authorization": "Bot " + discordAPIToken } });
    request
        .on("response", rsp => {
            if (rsp.statusCode !== 200) reject(rsp.statusCode);
            const chunks = [];
            rsp
                .on("data", chunk => chunks.push(chunk))
                .once("error", reject)
                .once("end", () => resolve(chunks.map(chunk => chunk.toString()).join("")));
        })
        .on("abort", () => reject("aborted"))
        .on("timeout", () => reject("timed out"))
        .on("error", reject);
});
exports.getUserDetails = getUserDetails;

/**
 * @typedef SimplifiedDiscordUser - Waay simplified and stripped down version of User Object.
 * @prop {string} id - Snowflake ID of the user.
 * @prop {string} discriminator - The 4 digit hash of the user
 * @prop {string | null} avatar - The avatar hash of the user's avatar picture.
 * @prop {string | null} banner - The banner hash of the user.
 */
