// ==UserScript==
// @name         twitter unfucker
// @namespace    http://n.yla0.icu/
// @version      2023-02-11
// @description  try to take over twitter
// @author       NutchapolSal
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// ==/UserScript==

const actions = [
    {
        description: "trending sidebar",
        check: (e) => e.nodeName == 'DIV' && e.ariaLabel == 'Timeline: Trending now',
        kill: (e) => e.parentElement.parentElement.parentElement.remove()
    },
    {
        description: "sub to premium sidebar",
        check: (e) => e.nodeName == 'ASIDE' && e.ariaLabel == 'Subscribe to Premium',
        kill: (e) => e.parentElement.remove()
    },
    {
        description: "who to follow sidebar",
        check: (e) => e.nodeName == 'ASIDE' && e.ariaLabel == 'Who to follow',
        kill: (e) => e.parentElement.parentElement.remove()
    },
    {
        description: "twitter premium",
        check: (e) => e.nodeName == 'A' && e.href.endsWith('/verified-choose'),
        kill: (e) => e.remove()
    },
    {
        description: "notification number",
        check: (e) => e.nodeName == 'DIV' && /unread item/.test(e.ariaLabel) && e.ariaLive == 'polite',
        kill: (e) => e.remove()
    },
];

function checkElemAndChildren(e) {
    for (const a of actions) {
        if (a.check(e)) {
            console.log(`${a.description} killed`)
            a.kill(e)
            return
        }
    }
    if (e.children != null) {
        for (const v of e.children) {
            checkElemAndChildren(v)
        }
    }
}

function run() {
    'use strict';
    //notifDelete()
    //trendsDelete()
    //blueDelete()
    const observer = new MutationObserver((mutations) => {for (const v of mutations) {
        if (v.type == 'childList') {
            for (const v2 of v.addedNodes) {
                checkElemAndChildren(v2)
            }
        } else if (v.type == 'attributes') {
            for (const a of actions) {
                if (a.check(v.target)) {
                    console.log(`${a.description} killed`)
                    a.kill(v.target)
                    break
                }
            }
        }
    }})
    observer.observe(document.querySelector("body"), {childList: true, subtree: true, attributes: true})
}

run();