// ==UserScript==
// @name         maia.crimew.gay cat fader
// @namespace    http://n.yla0.icu/
// @version      2024-02-06
// @description  im sorry but the cat distracts me
// @author       NutchapolSal
// @match        https://maia.crimew.gay/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crimew.gay
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let observer = new MutationObserver((list, obs) => {
        for (const mutation of list) {
            const target = mutation.target
            if (target.style.backgroundPosition == '-64px -32px' || target.style.backgroundPosition == '-64px 0px') {
                const opValue = target.style.opacity == '' ? 1 : parseFloat(target.style.opacity) - 0.075
                console.log(opValue)
                obs.disconnect()
                target.style.opacity = Math.max(0, opValue)
                if (0 < opValue) {
                    obs.observe(target, {attributes:true})
                }
            }
        }
    })

    observer.observe(document.body.querySelector("div#oneko"), {attributes:true})
})();