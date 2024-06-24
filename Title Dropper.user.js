// ==UserScript==
// @name         Title Dropper
// @namespace    http://n.yla0.icu/
// @version      2024-02-19
// @description  makes the title drop when you hover on the link
// @author       NutchapolSal
// @match        https://tvtropes.org/pmwiki/pmwiki.php/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tvtropes.org
// @grant        none
// ==/UserScript==
const selectors = {
    header: "h1.entry-title",
    mainContainer: "div#main-container",
    links: "a.twikilink"
}
function simulatePhysics(startY, startYVelocity, gravity, endY, timeStep) {
    const ys = [startY]
    let t = 0
    let vY = startYVelocity
    for (let y = startY; y < endY; t += timeStep ) {
        vY += gravity * timeStep
        y += vY * timeStep
        ys.push(y)
    }
    return {yPositions: ys, endYVelocity: vY, time: t}
}
(function() {
    'use strict';

    const stylesheet = new CSSStyleSheet()
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, stylesheet]

    const header = document.body.querySelector(selectors.header)
    const headerY = header.getBoundingClientRect().top + window.scrollY + header.getBoundingClientRect().height / 2
    const mainContainer = document.body.querySelector(selectors.mainContainer)
    console.log(mainContainer)
    let linkI = 0
    for (const v of document.body.querySelectorAll(selectors.links)) {
        if (v.href.endsWith("/Main/TitleDrop") ||
            (v.href.endsWith("/Main/SelfDemonstratingArticle") && document.location.pathname.endsWith("/Main/TitleDrop"))
           ) {
            const index = linkI
            linkI++
           //  v.classList.add(`titleDropLink-${index}`)
            const runTitleDrop = (e) => {
                // stylesheet.insertRule(`.titleDropLink-${index} { position: relative; top: 2px; }`)
                const pageY = e.pageY
                const headerOffset = pageY - headerY
                const {yPositions: ys, time: t, endYVelocity: vY} = simulatePhysics(0, Math.random() * -700, 1250, headerOffset, 0.01)
                const keyFrameTexts = []
                ys[ys.length - 1] = headerOffset
                let finalCss = ""
                for (let i = 0; i < ys.length; i++) {
                    let rotateText = ""
                    if (i == 0) {
                        rotateText = " rotate: 0deg;"
                    } else if (i == ys.length - 1) {
                        rotateText = ` rotate: ${(Math.random() * 15) - 7.5}deg;`
                    }
                    keyFrameTexts.push(`${(i * 100) / (ys.length - 1)}% {top: ${ys[i]}px;${rotateText}}`)
                    finalCss = `top: ${ys[i]}px;${rotateText}`
                }

                stylesheet.insertRule(`@keyframes titleDrop {${keyFrameTexts.join(" ")}}`)
                stylesheet.insertRule(`${selectors.header} { position: relative; animation: ${t}s linear 1 both titleDrop;}`)
                v.onmouseover = null
                const shakeTexts = []
                let shakeT = 0
                for (let j = (vY ** 2) / 300000; 0.1 < Math.abs(j); j = j / 1.2) {
                    const rad = Math.random() * Math.PI * 2
                    const sin = Math.sin(rad)
                    const cos = Math.cos(rad)
                    shakeTexts.push(`top: ${cos * j * 0.6}px; left: ${sin * j}px;`)
                    shakeT += 0.016
                }
                for (let i = 0; i < shakeTexts.length; i++) {
                    shakeTexts[i] = `${(i * 100) / (shakeTexts.length - 1)}% {${shakeTexts[i]}}`
                }
                stylesheet.insertRule(`@keyframes titleDropShake {${shakeTexts.join(" ")}}`)
                header.onanimationend = (e2) => {
                    e2.stopPropagation()
                    header.onanimationend = null
                    stylesheet.deleteRule(1)
                    stylesheet.insertRule(`${selectors.header} { position: relative; ${finalCss}}`)
                    stylesheet.insertRule(`${selectors.mainContainer} { position: relative; animation: ${shakeT}s step-start 1 both titleDropShake;}`)
                    mainContainer.onanimationend = (e3) => {
                        mainContainer.onanimationend = null
                        stylesheet.deleteRule(0)
                        header.onclick = (e4) => {
                            header.onclick = null
                            stylesheet.insertRule(`${selectors.mainContainer} { position: relative; animation: ${shakeT * 2}s step-start 1 reverse backwards titleDropShake;}`)
                            mainContainer.onanimationend = (e5) => {
                                mainContainer.onanimationend = null
                                stylesheet.deleteRule(1)
                                stylesheet.insertRule(`${selectors.header} { position: relative; animation: ${t * 2}s linear 1 reverse both titleDrop;}`)
                                header.onanimationend = (e6) => {
                                    stylesheet.replaceSync("")
                                    header.onanimationend = null
                                    // v.onmouseover = runTitleDrop
                                }
                            }
                        }
                    }
                }
            }
            v.onmouseover = runTitleDrop
        }
    }
})();