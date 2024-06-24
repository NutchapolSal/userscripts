// ==UserScript==
// @name         em hilighter
// @namespace    http://n.yla0.icu/
// @version      2024-02-25
// @description  try to read the wiki
// @author       NutchapolSal
// @match        https://wiki.c2.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wiki.c2.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const stylesheet = new CSSStyleSheet()
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet]

    stylesheet.insertRule(`em { color: rgb(0, 141, 0);}`)
    stylesheet.insertRule(`em a { color: rgb(0, 192, 223);}`)
    stylesheet.insertRule(`em a:active { color: rgb(255, 212, 0);}`)
    stylesheet.insertRule(`em a:visited { color: rgb(0, 140, 163);}`)
})();