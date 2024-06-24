// ==UserScript==
// @name         ebay display price with shipping
// @namespace    http://n.yla0.icu/
// @version      2024-04-19
// @description  try to buy all over the world
// @author       NutchapolSal
// @match        https://www.ebay.com/sch/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ebay.com
// @grant        none
// @run-at       context-menu
// ==/UserScript==

(function() {
    'use strict';

    for (const item of document.querySelectorAll("ul.srp-results > li")) {
        try {
            const shipCostElem = item.querySelector("span.s-item__logisticsCost")
            if (shipCostElem.innerText.match(/free/i) != null) {
                continue
            }
            const estimate = shipCostElem.innerText.match(/estimate/i) != null
            const shipCost = parseFloat(shipCostElem.innerText.match(/[\d,.]+/)[0].replace(/,/g, ""))
            const priceElem = item.querySelector("span.s-item__price")
            const newPriceText = priceElem.innerText.replaceAll(/[\d,.]+/g, (p) => {
                const oldPrice = parseFloat(p.replace(/,/g, ""))
                const newPrice = oldPrice + shipCost
                return `${p} (${estimate ? "~" : ""}${newPrice.toFixed(2)})`
            })
            priceElem.innerText = newPriceText
        } catch (e) {
            console.warn(e)
        }
    }
})();