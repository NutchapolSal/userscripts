// ==UserScript==
// @name         switch to safe
// @namespace    http://n.yla0.icu/
// @version      2023-03-23
// @description  button to quickly move to the current page but in safebooru/danbooru
// @author       NutchapolSal
// @match        *.donmai.us/*
// @icon         https://www.google.com/s2/favicons?domain=donmai.us
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    let regexResult = /^(safe|dan)booru\./.exec(document.location.hostname)
    if (!regexResult) {
        return
    }
    let a = regexResult[1]
    let b = regexResult[1] == "safe" ? "dan" : "safe"
    let convertBar = document.createElement("span")
    convertBar.innerText = `-> ${b}`
    convertBar.style.background = "var(--subnav-menu-background-color)"
    convertBar.style.padding = "0em 2em"
    convertBar.style["font-size"] = "var(--text-lg)"
    convertBar.style["font-weight"] = "normal"
    convertBar.style["font-family"] = "var(--header-font)"
    convertBar.style.cursor = "pointer"

    convertBar.addEventListener("click", function( event ) {
        event.target.style.background = "var(--link-color)"
        window.location.replace(document.URL.replace(`${a}booru`,`${b}booru`))
    });
    document.getElementById("app-name-header").append(convertBar)
})();