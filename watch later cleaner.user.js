// ==UserScript==
// @name         watch later cleaner
// @namespace    http://n.yla0.icu/
// @version      2024-01-07
// @description  try to take over the watch later list
// @author       NutchapolSal
// @match        https://www.youtube.com/playlist?list=WL
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at       context-menu
// ==/UserScript==

// @run-at       document-idle
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms))
}

function random(min, max) {
    return Math.floor(Math.random() * (max-min) + min)
}

async function runCleaner() {
    const listItems = document.querySelectorAll("ytd-playlist-video-renderer")
    const allRemoveItems = []
    let possiBreak = -1
    for (const v of listItems) {
        if (v.querySelector("ytd-thumbnail #progress") == null) {
            if (-1 < possiBreak) {
                break
            }
            possiBreak = 0
        } else {
            if (-1 < possiBreak) {
                possiBreak++
            }
            if (3 <= possiBreak) {
                possiBreak = -1
            }
        }
        allRemoveItems.push(v)
    }
    const removeItems = allRemoveItems.slice(0,-5 - (possiBreak + 1))
    for (const v of removeItems) {
        v.style.backgroundColor = "#ff000033"
    }
    for (const v of removeItems) {
        v.querySelector("ytd-menu-renderer yt-icon-button button").click()
        await sleep(random(750,1250))
        document.querySelectorAll("ytd-popup-container tp-yt-paper-item")[2].click()
        await sleep(random(2500,7500))
    }
}

(function() {
    'use strict';
    if (document.querySelector("ytd-playlist-video-renderer") != null) {
        setTimeout(async () => {
            await runCleaner().catch(console.error)
        }, 2000)
    } else {
        const observer = new MutationObserver((records, observer) => {
            outer: for (const record of records) {
                for (const v of record.addedNodes) {
                    if (v.nodeName == "ytd-playlist-video-renderer".toUpperCase()) {
                        setTimeout(async () => {
                            await runCleaner().catch(console.error)
                        }, 10000)
                        observer.disconnect()
                        break outer
                    }
                }
            }
        })
        observer.observe(document.body, {childList: true, subtree:true})
    }

})();