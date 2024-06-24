// ==UserScript==
// @name         fav mode
// @namespace    http://n.yla0.icu/
// @version      2024-05-06
// @description  try to take over the favs
// @author       NutchapolSal
// @match        https://*.donmai.us/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=donmai.us
// @grant        GM.setValue
// @grant        GM.getValue
// ==/UserScript==

(async function() {
    'use strict';
    {
        const heartThing = document.body.querySelector("svg.solid-heart-icon use")
        if (heartThing != null) {
            const rawIconHref = heartThing.href.baseVal
            const iconHref = rawIconHref.slice(0,rawIconHref.indexOf("#"))
            await GM.setValue("iconHref", iconHref)
        }
    }
//    if (!location.pathname.endsWith('/posts')) return
    if (document.body.querySelector('article') == null) return
    console.log('favmode by nutch')
    const csrfParam = document.head.querySelector('meta[name="csrf-param"]').content
    const csrfToken = document.head.querySelector('meta[name="csrf-token"]').content
    const origin = location.origin

    function setFav(id, value) {
        const url = new URL(origin)
        const fetchOptions = { body: new FormData() }
        fetchOptions.body.set(csrfParam, csrfToken)

        if (value) {
            url.pathname = '/favorites'
            url.searchParams.set('post_id', id)
            fetchOptions.method = "POST"
        } else {
            url.pathname = `/favorites/${id}`
            fetchOptions.method = "DELETE"
        }

        return fetch(url.toString(), fetchOptions)
    }

    let isFavMode = sessionStorage.getItem("favMode") != null
    const button = document.createElement("button")
    const activate = (state) => {
        if (state) {
            for (const v of document.body.querySelectorAll("article")) {
                v.onclick = (e2) => {
                    if (e2.ctrlKey || e2.shiftKey) {
                        return
                    }
                    e2.preventDefault()
                    const id = v.dataset.id
                    const isFavved = v.dataset.isFavorited == 'true'
                    setFav(id, !isFavved).then(() => {v.dataset.isFavorited = !isFavved}).catch(console.error)
                }
            }
            sessionStorage.setItem("favMode", "true")
        } else {
            for (const v of document.body.querySelectorAll("article")) {
                v.onclick = null
            }
            sessionStorage.removeItem("favMode")
        }
        button.innerText = `${state ? "✅ " : ""}Fav Mode`
    }
    activate(isFavMode)

    button.addEventListener('click', () => {
        isFavMode = !isFavMode
        activate(isFavMode)
    })
    document.body.querySelector("section#options-box > ul")?.appendChild(button)

    // tooltip
    const heartIconHref = await GM.getValue("iconHref")
    const noFavSVG = `<svg class="icon svg-icon empty-heart-icon" style="cursor: pointer;" viewBox="0 0 512 512"><use fill="currentColor" href="${heartIconHref}#regular-heart"></use></svg>`
    const yesFavSVG = `<svg class="icon svg-icon" style="cursor: pointer;" viewBox="0 0 512 512"><use fill="currentColor" href="${heartIconHref}#solid-heart"></use></svg>`

    const observer = new MutationObserver((mutations) => {for (const v of mutations) {
        const votingSpan = v.target.querySelector("span.post-votes")
        if (votingSpan == null) {
            continue
        }
        if (votingSpan.querySelector("a.post-favorite-link") != null) {
            continue
        }
        const id = votingSpan.dataset.id
        const articlem = document.querySelector(`article[data-id='${id}']`)
        const isFavved = articlem.dataset.isFavorited == 'true'
        const alem = document.createElement('a')
        alem.classList.add("post-favorite-link")
        alem.classList.add(isFavved ? "active-link" : "inactive-link")
        alem.innerHTML = isFavved ? yesFavSVG : noFavSVG
        alem.onclick = (e) => {
            const isFavved2 = articlem.dataset.isFavorited == 'true'
            setFav(id, !isFavved2).then(() => {
                articlem.dataset.isFavorited = !isFavved2
                alem.innerHTML = !isFavved2 ? yesFavSVG : noFavSVG
                alem.classList.remove("active-link", "inactive-link")
                alem.classList.add(!isFavved2 ? "active-link" : "inactive-link")
            }).catch(console.error)
        }
        votingSpan.appendChild(alem)
    }})
    observer.observe(document.querySelector("div#tooltips"), {childList: true, subtree: true})
})();