// ==UserScript==
// @name         Favs Highlighter
// @namespace    http://n.yla0.icu/
// @version      2024-04-03
// @description  try to highlight all the favs
// @author       NutchapolSal
// @match        https://*.donmai.us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-idle
// ==/UserScript==

// document.head.querySelector("link[rel='stylesheet'][href^='/users/custom_style']")

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function requestFavorites(userId, page, postId) {
    const url = new URL("https://danbooru.donmai.us/favorites.json")
    url.searchParams.set("search[user_id]", userId)
    url.searchParams.set("limit", 1000)
    if (postId != null) {
        url.searchParams.set("search[post_id]", postId)
    }
    if (page != null) {
        url.searchParams.set("page", page)
    }
    return (await fetch(url.toString())).json()
}

function checkMissing(favSearch,favsIdMap) {
    const missingList = []
    let maxKey = 0
    let minKey = Number.MAX_SAFE_INTEGER
    const searchSet = new Set()
    for (const v of favSearch) {
        searchSet.add(v.id)
        maxKey = Math.max(maxKey, v.id)
        minKey = Math.min(minKey, v.id)
    }
    for (const k of favsIdMap.keys()) {
        const parsedK = parseInt(k)
        if (minKey <= parsedK && parsedK <= maxKey) {
            if (!searchSet.has(parsedK)) {
                missingList.push(parsedK.toString())
            }
        }
    }
    return {maxKey, minKey, missing: missingList}
}

(async function() {
    'use strict';

    console.log("favs highlighter by nutch")
    const userId = document.body.dataset.currentUserId
    if (userId == 'null') {
        return
    }

    const extraStuff = JSON.parse(await GM.getValue('extraStuff', '{"removeList": [], "lastCheckMaxKey": 0}'))
    const favsObjectIn = JSON.parse(await GM.getValue('favsMap', "{}"))
    const favsIdMap = new Map(Object.entries(favsObjectIn))
    const favsSet = new Set()

    let saveMap = false
    for (const v of extraStuff.removeList) {
        favsIdMap.delete(v)
        saveMap = true
    }
    extraStuff.removeList = []

    if (document.location.pathname.match(/^\/posts\/\d+$/) != null) {
        const favLink = document.querySelector("a#add-to-favorites")
        if (favLink != null && favLink.style.display == '') {
            const currId = parseInt(document.body.dataset.postId)
            for (const [k, v] of favsIdMap) {
                if (v == currId) {
                    favsIdMap.delete(k)
                    saveMap = true
                    break
                }
            }
        }
    }

    let maxKey = 0
    for (const [key, value] of favsIdMap) {
        const parsedKey = parseInt(key)
        favsSet.add(value)
        maxKey = Math.max(parsedKey, maxKey)
    }

    if (document.location.pathname == '/posts') {
        console.log('getting favs')
        while (true) {
            const favSearch = await requestFavorites(userId, `a${maxKey}`)
            if (favSearch.length == 0) {
                break
            }
            console.log(`found ${favSearch.length} more`)
            saveMap = true
            for (const v of favSearch) {
                maxKey = Math.max(maxKey, v.id)
                favsIdMap.set(v.id.toString(), v.post_id)
                favsSet.add(v.post_id)
            }
            if (favSearch.length < 1000) {
                break
            }
            await wait(125)
        }
    }
    console.log(`favs amount: ${favsIdMap.size}`)

    console.log("marking posts")
    const postPreviews = document.getElementsByClassName('post-preview')
    for (const item of postPreviews) {
        const currentPostId = parseInt(item.getAttribute('data-id'))
        if (favsSet.has(currentPostId)) {
            item.dataset.isFavorited = true
        } else {
            item.dataset.isFavorited = false
        }
    }

    if (saveMap) {
        console.log('saving favs')
        await GM.setValue('favsMap', JSON.stringify(Object.fromEntries(favsIdMap)))
    }

    if (document.location.pathname == '/posts') {
        console.log("checking for unfavs")
        const favSearchPast = await requestFavorites(userId, `a${extraStuff.lastCheckMaxKey}`)
        const favSearchPresent = await requestFavorites(userId)

        const missingPast = checkMissing(favSearchPast, favsIdMap)
        const missingPresent = checkMissing(favSearchPresent, favsIdMap)
        const allMissing = [...missingPast.missing, ...missingPresent.missing]
        if (0 < allMissing.length) {
            console.log(`found unfav ${allMissing.map(k => favsIdMap.get(k)).join(' ')}`)
        }
        extraStuff.removeList = allMissing
        extraStuff.lastCheckMaxKey = missingPast.maxKey
    }

    await GM.setValue('extraStuff', JSON.stringify(extraStuff))

    const bc = new BroadcastChannel("newFavs")
    bc.onmessage = console.log

    if (document.location.pathname.match(/^\/posts\/\d+$/)) {
        const postId = document.body.dataset.postId
        const favWatcher = new MutationObserver((records) => {
            for (const record of records) {
                if (record.target.classList.contains('fav-buttons-true')) {
                    requestFavorites(userId, null, postId).then(favs => bc.postMessage(favs[0]))
                } else {
                    bc.postMessage(`remove ${postId}`)
                }
                break // there's duplicate records for some reason idk
            }
        })
        favWatcher.observe(document.querySelector("div.fav-buttons"), { attributes: true })
    }

    console.log('done')
    // await GM.deleteValue('favsMap')
})();