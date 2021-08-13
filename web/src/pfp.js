/**
 * @param {string} id
 * @returns {Promise<string>}
 */
function getPictureLink(id) {
    return fetch("/api/getpfp?id=" + id, { method: "GET" })
        .then(resp => { if (resp.ok) return resp; else throw resp; })
        .then(resp => resp.text());
}
/**@param {string} link*/
function showPicture(link) {
    const stolenPic = document.createElement("img");
    const linkContainer = document.createElement("a");
    linkContainer.href = link;
    linkContainer.appendChild(stolenPic);
    stolenPic.src = link;
    const pictureContainer = document.getElementById("picture");
    pictureContainer.childNodes.forEach(elem => elem.remove());
    pictureContainer.appendChild(linkContainer);
}
function showError() {
    const errorText = document.createElement("h3");
    errorText.innerText = "Some error happened. Are you sure you entered the correct ID?\nCheck the \"How do I use this?\" guide for more info.";
    const pictureContainer = document.getElementById("picture");
    pictureContainer.childNodes.forEach(elem => elem.remove());
    pictureContainer.appendChild(errorText);
}
function handleSubmit() {
    /**@type {HTMLInputElement}*/
    const input = document.getElementById("id-input");
    getPictureLink(input.value).then(showPicture, showError);
}