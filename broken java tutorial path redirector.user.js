// ==UserScript==
// @name         broken java tutorial path redirector
// @namespace    http://n.yla0.icu/
// @version      2024-02-19
// @description  try to fix the java docs
// @author       NutchapolSal
// @match        https://docs.oracle.com/javase*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=docs.oracle.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    const replaced = document.location.pathname.replaceAll("%2F", "/").replaceAll(/\/+/g, "/")
    if (document.location.pathname != replaced) {
        document.location.pathname = replaced
    }
})();