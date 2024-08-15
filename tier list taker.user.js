// ==UserScript==
// @name         tier list taker
// @namespace    http://n.yla0.icu/
// @version      2024-08-15
// @description  copy the tier list data in json
// @author       NutchapolSal
// @match        https://slaimuda.github.io/ectl/
// @icon         https://slaimuda.github.io/ectl/favicon.ico
// @grant        none
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

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

    async function takeData() {
        const tagString = (Math.random() + 1).toString(36).slice(2,4)
        const stuff = []
        const tagsMap = new Map()
        const tabs = document.querySelectorAll('ul.nav-tabs a')
        for (const tab of tabs) {
            tab.click()
            await sleep(250)
            for (const tierBlock of document.querySelectorAll('div.card-body div:has( > h3.title)')) {
                for (const item of tierBlock.querySelectorAll("div.col-4")) {
                    const tags = item.querySelector("div.row > div.col > div").children
                    const tagTexts = []
                    for (const tag of tags) {
                        const tip = tag.dataset.tip
                        if (tip == null) {
                            tagTexts.push("/")
                            continue
                        }
                        tagTexts.push(tip)
                    }
                    stuff.push({type: tab.textContent, name: item.querySelector("p").textContent, tags: tagTexts, tier: tierBlock.querySelector("h3").textContent.slice(5)})
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