// ==UserScript==
// @name         lemon8 get links
// @namespace    http://n.yla0.icu/
// @version      2023-09-04
// @description  try to grab all the lemon8 (probably broken)
// @author       NutchapolSal
// @match        https://www.lemon8-app.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lemon8-app.com
// @grant        none
// ==/UserScript==

const altPath = "https://p16-va.topbuzzcdn.com/origin/"

function getLinks() {
    let linksList = []
    for (const v of document.getElementsByClassName("sharee-carousel-item")) {
        linksList.push(v.getElementsByTagName("img")[0].src)
    }
    console.log(linksList)
    linksList = linksList.map(v => new URL(v))
    linksList = linksList.map(v => v.pathname)
    linksList = linksList.map(v => v.match(/\/(.*)~.*\.(.*)/))
    linksList = linksList.map(v => `${v[1]}.${v[2]}`)
    linksList = linksList.map(v => new URL(v, altPath))
    linksList = linksList.map(v => v.toString())
    console.log(linksList)
    const urlBoxValue = linksList.join('\n')
    const packageBoxValue = document.location.pathname.replaceAll("/", " ").trim()

    //

    const getLinksText = document.createElement("div")
    getLinksText.innerHTML = 'get links'
    getLinksText.style.fontSize = ".64rem"

    const urlBox = document.createElement("textarea")
    const packageBox = document.createElement("input")

    urlBox.addEventListener('focus', () => {
        urlBox.select()
    })
    packageBox.addEventListener('focus', () => {
        packageBox.select()
    })

    urlBox.readOnly = true
    packageBox.readOnly = true

    urlBox.value = urlBoxValue
    packageBox.value = packageBoxValue

    document.getElementsByClassName("sharee-carousel-wrapper")[0].insertAdjacentElement("afterend", getLinksText)
    getLinksText.insertAdjacentElement("afterend", urlBox)
    urlBox.insertAdjacentElement("afterend", packageBox)
}

function makeRegetButton() {
    const reGetButton = document.createElement('p')
    reGetButton.innerHTML = 'reGet'
    reGetButton.style.fontSize = '.5rem'
    reGetButton.style.cursor = 'pointer'
    document.getElementsByClassName("nav-bar-v2-line")[0].insertAdjacentElement("afterend", reGetButton)
    reGetButton.addEventListener('click', () => {
        getLinks()
    })
}

(function() {
    'use strict';

    makeRegetButton()
    getLinks()

    window.makeRegetButton = makeRegetButton
})();