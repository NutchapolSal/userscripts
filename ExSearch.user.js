// ==UserScript==
// @name         ExSearch
// @namespace    http://n.yla0.icu/
// @version      2024-11-18.1
// @description  try to take over the tags
// @author       NutchapolSal
// @match        https://*.donmai.us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @run-at       document-idle
// ==/UserScript==

// document.getElementsByTagName('article')[0].getAttribute('data-tags').split(' ')

const metatagsList = ["user", "approver", "disapproved", "commenter", "comm", "noter", "artcomm", "pool", "newpool", "ordpool", "fav", "ordfav", "favgroup", "ordfavgroup", "search", "md5", "rating", "locked", "width", "height", "mpixels", "ratio", "score", "favcount", "filesize", "filetype", "source", "id", "date", "age", "status", "tagcount", "gentags", "arttags", "chartags", "copytags", "metatags", "parent", "child", "pixiv_id", "pixiv", "embedded", "limit", "order", "upvote", "downvote"]

function metatagCheck(tag) {
    const colonIndex = tag.indexOf(':')
    if (colonIndex == -1) return false
    const beforeColon = tag.slice(0, colonIndex)
    return metatagsList.includes(beforeColon)
}

function showNotice(stuff, text) {
    stuff.notices ??= []
    stuff.noticeRunning ??= false
    stuff.notices.push(text)
    if (!stuff.noticeRunning) {
        renderNotice(stuff)
    }
}

function renderNotice(stuff) {
    let text = ''
    if (0 < stuff.notices.length) {
        text = stuff.notices.shift()
        stuff.noticeRunning = true
        setTimeout(() => { renderNotice(stuff) }, 1000)
    } else {
        text = '🔦'
        stuff.noticeRunning = false
    }
    stuff.button.innerHTML = text
}

async function doSearchThing(stuff) {
    const searchString = document.getElementById('tags').value
    if (searchString.match(/(^| )\(.* .*\)( |$)/)) {
        showNotice(stuff, '❌ groups')
        return
    }

    if (searchString.match(/\bor\b/) || searchString.includes('~')) {
        showNotice(stuff, '❌ or')
        return
    }


    let metatagAlerted = false
    let queryList = searchString.split(' ')
    queryList = queryList.filter(v => {
        if (v == '') return false

        const isMetatag = metatagCheck(v)
        if (isMetatag && !metatagAlerted) {
            showNotice(stuff, '⚠️ metatags')
            metatagAlerted = true
        }
        return !isMetatag
    })

    const articlesList = document.getElementsByTagName('article')
    for (let v of articlesList) {
        const vTagsString = v.getAttribute('data-tags')
        if (vTagsString == null) {
            continue
        }
        const vTags = vTagsString.split(' ')
        let searchMatch = true
        for (let q of queryList) {
            let searchTag = q
            let matched = false
            if (q[0] == '-') {
                matched = true
                searchTag = q.slice(1)
            }
            if (vTags.includes(searchTag)) {
                matched = !matched
            }
            if (!matched) {
                searchMatch = false
                break
            }
        }
        if (searchMatch) {
            v.style.opacity = '1'
        } else {
            v.style.opacity = '0.5'
        }
    }

    showNotice(stuff, '✅')
}

(async function() {
    'use strict';
    if (!(document.location.pathname == '/posts' || document.location.pathname == '/')) return

    const dateNow = Date.now()
    const ogSearch = document.getElementById('tags').value
    const stuff = {ogSearch}
    const exButton = document.createElement('button')
    exButton.style.padding = "2px 6px"
    exButton.style.borderRadius = "0"
    exButton.innerHTML = '🔦'
    stuff.button = exButton

    const exClearButton = document.createElement('button')
    exClearButton.style.padding = "2px 6px"
    exClearButton.style.borderRadius = "0"
    exClearButton.innerHTML = '⦻'
    exClearButton.style.visibility = "hidden"
    stuff.clearButton = exClearButton

    exButton.addEventListener('click', async event => {
        await doSearchThing(stuff)
        exClearButton.style.visibility = ""

        sessionStorage.setItem("exSearch", JSON.stringify({ex: document.getElementById('tags').value, og: ogSearch}))
    })
    exClearButton.addEventListener('click', async event => {
        document.getElementById('tags').value = ogSearch

        sessionStorage.removeItem("exSearch")

        await doSearchThing(stuff)
        exClearButton.style.visibility = "hidden"
    })

    document.getElementById('search-box').appendChild(exButton)
    document.getElementById('search-box').appendChild(exClearButton)

    const session = JSON.parse(sessionStorage.getItem("exSearch"))
    if (session != null) {
        if (session.og == ogSearch) {
            document.getElementById('tags').value = session.ex
            await doSearchThing(stuff)
            exClearButton.style.visibility = ""
        } else {
            sessionStorage.removeItem("exSearch")
        }
    }
})();