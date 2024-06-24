// ==UserScript==
// @name         tier list taker
// @namespace    http://n.yla0.icu/
// @version      2024-01-15
// @description  copy the tier list data in json
// @author       NutchapolSal
// @match        https://slaimuda.github.io/ectl/
// @icon         https://slaimuda.github.io/ectl/favicon.ico
// @grant        none
// ==/UserScript==


function bytesToBase64(bytes) {
  const binString = String.fromCodePoint(...(new Uint8Array(bytes)));
  return btoa(binString);
}

async function compressify(str) {
    const utf8bytes = new TextEncoder().encode(str)
    const cs = new CompressionStream("gzip");
    const writer = cs.writable.getWriter();
    writer.write(utf8bytes);
    writer.close();
    const gzipBuf = await new Response(cs.readable).arrayBuffer();
    return bytesToBase64(gzipBuf)
}

(function() {
    'use strict';

    let copyButton = document.createElement("div")
    copyButton.innerText = "copy tier list data"
    copyButton.style.background = "rgba(255, 255, 255, 0.4)"
    copyButton.style.position = "fixed"
    copyButton.style.bottom = "20px"
    copyButton.style.cursor = "pointer"

    function takeData() {
        const tagString = (Math.random() + 1).toString(36).slice(2,4)
        const stuff = []
        const tagsMap = new Map()
        const tabs = document.querySelector("ul[role='tablist']").children
        const panes = document.querySelector("div.tab-content.text-center").children
        for (let i = 0; i < panes.length; i++) {
            const tab = tabs[i]
            const pane = panes[i]
            const innerStuff = {type: tab.innerText, list: []}
            for (const tierHeader of pane.querySelectorAll("div > h3")) {
                const tierItems = tierHeader.parentElement.children[1].children
                for (const item of tierItems) {
                    const tags = item.children[0].children[0].children[0].children
                    const tagTexts = []
                    for (const tag of tags) {
                        const tip = tag.dataset.tip
                        if (tip == null) {
                            tagTexts.push("/")
                            continue
                        }
                        tagTexts.push(tip)
                    }
                    stuff.push({type: tab.innerText, name: item.children[2].textContent, tags: tagTexts, tier: tierHeader.textContent.slice(5)})
                }
            }
        }

        copyButton.style.background = "rgba(127, 255, 127, 0.4)"
        copyButton.innerText = "done"
        setTimeout(() => {
            copyButton.style.background = "rgba(255, 255, 255, 0.4)";
            copyButton.innerText = "copy tier list data"
        }, 3000)
        compressify(JSON.stringify(stuff)).then(v => navigator.clipboard.writeText(v))
    }

    copyButton.addEventListener("click", takeData);
    document.querySelector("body").append(copyButton)

})();