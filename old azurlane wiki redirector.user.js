// ==UserScript==
// @name         old azurlane wiki redirector
// @namespace    http://n.yla0.icu/
// @version      2024-01-15
// @description  try to take over the wiki
// @author       NutchapolSal
// @match        https://azurlane.koumakan.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=koumakan.jp
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    if (!document.location.pathname.match(/^\/[^/]*?\/.*$/)) {
        document.location.pathname = '/wiki' + document.location.pathname
    }
})();