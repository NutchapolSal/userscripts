// ==UserScript==
// @name         kmitl get entire timetable
// @namespace    http://n.yla0.icu/
// @version      2024-06-30
// @description  try to take over the schedule
// @author       NutchapolSal
// @match        https://new.reg.kmitl.ac.th/reg/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.th
// @grant        none
// @run-at       context-menu
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

(async function() {
    'use strict';

    const events = []

    for (const v of document.querySelectorAll("span.teach-time button")) {
        v.click()
    }
    await sleep(1000)
    for (const v of document.querySelectorAll("div.v-dialog")) {
        const courseCode = v.querySelector("div.v-card__title").innerText
        const courseName = v.querySelector("h1.mt-2.deep-orange--text").innerText
        const courseNameEng = v.querySelector("h2.brown--text").innerText
        const courseSection = v.querySelector("h2.mt-2.mb-2").innerText
        for (const v2 of v.querySelectorAll("div.v-card__text > div.text-center")) {
            const regexed = v2.innerText.match(/(.*) - (.*)/)
            const eventDate = new Date(Date.parse(regexed[1]))
            const eventTimeEnd = regexed[2]
            events.push(`${courseName}\t${courseNameEng}\t${courseSection}\t${eventDate.getDate()}-${eventDate.getMonth() + 1}-${eventDate.getFullYear()}\t${eventDate.getHours()}:${eventDate.getMinutes()}\t${eventTimeEnd}`)
        }
    }
    console.log(events.join('\n'))
})();