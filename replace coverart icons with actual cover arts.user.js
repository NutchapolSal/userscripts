// ==UserScript==
// @name         replace coverart icons with actual cover arts
// @namespace    http://n.yla0.icu/
// @version      2024-05-26
// @description  for quick looking
// @author       NutchapolSal
// @match        https://musicbrainz.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=musicbrainz.org
// @grant        none
// @run-at       context-menu
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    for (const v of document.body.querySelectorAll("a:has(.caa-icon)")) {
        const uuid = v.href.match(/[0-9a-f\-]{36}/)[0]
        v.innerHTML = `<img class="caa-icon" src="https://coverartarchive.org/release/${uuid}/front" height=200/>`
    }
})();