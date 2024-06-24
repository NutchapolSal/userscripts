// ==UserScript==
// @name         AmiAmi Refresher + Notifier + Auto-Add-To-Cart
// @namespace    http://n.yla0.icu/
// @version      2023-07-01
// @description  try to take over the preorders
// @author       NutchapolSal
// @match        https://www.amiami.com/eng/detail/*
// @icon         https://www.google.com/s2/favicons?domain=amiami.com
// @run-at       document-end
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==
// thanks CandiceJoy on Github for inspiration


const refreshMillis = 2 * 60 * 1000

// audio notification plays when it manages to add current item to cart after refreshing page
// if using, change the site settings' Sound permission from Automatic to Allow
// (automatic mutes audio when user hasn't interacted with site before playing audio file, so you wouldnt hear the sound)
const audioNotification = true
const audioFileUrl = "https://github.com/NutchapolSal/files/raw/master/etc/radar.mp3"


function getCartButton() {
    return document.querySelector(".btn-cart:not([style]), .btn-cart[style='']")
}

async function getRefreshes() {
    return JSON.parse(await GM.getValue('refreshes', "[]"))
}

async function setRefreshes(value) {
    await GM.setValue('refreshes', JSON.stringify(value))
}

function getCurrentGCode() {
    const searchParams = (new URL(location.href)).searchParams
    return searchParams.get('gcode') ?? searchParams.get('scode')
}



(async function() {
    'use strict';
    const doRefresh = (await getRefreshes()).includes(getCurrentGCode())
    console.log(doRefresh)
    const header = document.createElement("div")
    const autoRefreshButton = document.createElement("span")
    const autoRefreshIcon = document.createElement("span")

    autoRefreshButton.innerHTML = `${doRefresh ? `${getCurrentGCode()} `: ''}autorefresh`
    autoRefreshButton.style.cursor = "pointer"
    autoRefreshButton.style.fontSize = "16px"
    autoRefreshIcon.innerHTML = doRefresh ? "✅" : "❌"
    autoRefreshButton.appendChild(autoRefreshIcon)
    document.querySelector("body").insertBefore(header, document.querySelector("div#__nuxt"))
    header.appendChild(autoRefreshButton)

    const buttonClickFunction = () => {
        autoRefreshIcon.innerHTML = "💫"
        getRefreshes().then((refs) => {
            if (refs.includes(getCurrentGCode())) {
                refs.splice(refs.indexOf(getCurrentGCode()), 1)
            } else {
                refs.push(getCurrentGCode())
            }
            return setRefreshes(refs)
        }).then(() => {
            location.reload()
        }).catch(console.error)
    }
    autoRefreshButton.addEventListener('click', buttonClickFunction)

    if (!doRefresh) {
        return
    }
    const timeoutId = setTimeout(() => {location.reload()}, refreshMillis)
    const observer = new MutationObserver((mutations) => {for (const v of mutations) {
        if (getCartButton() != null) {
            console.log("found")
            console.log(getCartButton())
            observer.disconnect()
            if (!getCartButton().classList.contains("none")) {
                getCartButton().click()
                clearTimeout(timeoutId)
                if (audioNotification) {
                    const audioElem = new Audio(audioFileUrl)
                    audioElem.loop = true
                    audioElem.play().catch(console.error)
                }
                getRefreshes().then((refs) => {
                    if (refs.includes(getCurrentGCode())) {
                        refs.splice(refs.indexOf(getCurrentGCode()), 1)
                    }
                    return setRefreshes(refs)
                }).then(() => {
                    autoRefreshIcon.innerHTML = "🆗"
                    autoRefreshButton.style.cursor = "not-allowed"
                    autoRefreshButton.removeEventListener('click', buttonClickFunction)
                }).catch(console.error)
            }
            break
        }
    }})
    observer.observe(document.querySelector("body"), {childList: true, subtree: true, attributes: true})

})();