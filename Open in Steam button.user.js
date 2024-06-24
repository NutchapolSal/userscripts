// ==UserScript==
// @name         Open in Steam button
// @namespace    http://n.yla0.icu/
// @version      2024-01-15
// @description  adds a button that opens the page in steam app
// @author       NutchapolSal
// @match        *://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?domain=steampowered.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let sideBar = document.getElementById("shareEmbedRow");
    sideBar.innerHTML = "<a href=\"" +
        "steam://store/" +
        (new RegExp("store\.steampowered\.com\/app\/([0-9]+)").exec(document.URL))[1] +
        "\" class=\"btnv6_blue_hoverfade btn_medium es_app_btn\"><span><i class=\"ico16\"></i>&nbsp;&nbsp; Open in Steam</span></a>"
        + sideBar.innerHTML

    // Your code here...
})();