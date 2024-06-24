// ==UserScript==
// @name         FANDOM UNSHITTER
// @namespace    http://n.yla0.icu/
// @version      2022-09-08
// @description  remove fandom garbage
// @author       NutchapolSal
// @match        https://*.fandom.com/*
// @exclude      https://www.fandom.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fandom.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    document.getElementsByClassName("global-navigation__links")[0].remove()
    document.getElementById("mixed-content-footer").remove()
    document.getElementsByClassName("unified-search__layout__right-rail")[0].remove()
})();