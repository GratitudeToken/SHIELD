import { $, $$ } from '/js/selectors.js'
import { url, user } from '/js/proton.js'
import { indexHTML } from '/js/index-template.js'
import { HTML } from '/js/post-template.js'
import { makeChart } from '/js/chart.js'
import { voteBTN } from '/js/vote.js'
import { deletePost } from '/js/delete-post.js'
import { countdown } from '/js/countdown.js'
import { commentEvents } from '/js/comments.js'
export let filter

export const postActions = (queryURL, clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem) => {

    filter = localStorage.getItem('filter') || 'all'

    if (filter !== null) {
        $('#select-type').value = filter
    } else {
        $('#select-type').value = 'all'
        localStorage.removeItem('filter')
    }

    $('#select-type').addEventListener('change', (e) => {
        localStorage.setItem('filter', $('#select-type').value)
        location.reload()
    })


    let newURL = url + '/getposts?user=' + user

    if (queryURL !== null) {
        queryURL.type === 'search' ? newURL = url + '/getposts?user=' + user + '&search=' + queryURL.string : null
        queryURL.type === 'title' ? newURL = url + '/getposts?user=' + user + '&title=' + queryURL.string : null
        queryURL.type === 'tag' ? newURL = url + '/getposts?user=' + user + '&tag=' + queryURL.string : null
    } else {
        $('.features').style.display = 'block'
        $('#filters').style.display = 'block'
    }

    let filteredData = {}
    let filteredPosts = []
    let filteredVotes = []

    if (fetchy === true) {
        fetch(newURL)
            .then(response => {
                return response.json()
            })
            .then(data => {
                // let's filter the data by user selecte post type
                if (filter !== 'all') {
                    data.posts.forEach((el, i) => {
                        if (el.type === filter) {
                            filteredPosts.push(el)
                            filteredVotes.push(data.votes[i])
                        }
                    })
                    filteredData.posts = filteredPosts
                    filteredData.votes = filteredVotes
                } else { filteredData = data }

                // let's reverse order of data on the client, to save computing power on server and to have most recent posts to be first
                const latestPosts = filteredData.posts.reverse()
                let latestVotes
                filteredData.votes ? latestVotes = filteredData.votes.reverse() : null

                const postFunctions = (item, index) => {

                    // populate HTML function
                    if (populatePosts === true) {
                        let html
                        // if the URL coming from page load on main.js and passed to this postActions function does not contain any title or tag parameters, use indexHTML, else, use HTML
                        let indexPage = true

                        if (queryURL === null || queryURL.type === 'search' || queryURL.type === 'tag') {
                            html = new indexHTML
                        } else {
                            html = new HTML
                            indexPage = false
                        }

                        $('#posts').innerHTML += html.insertHTML({ ...item, ...latestVotes[index], ...filteredData.comments })

                        indexPage === false ? commentEvents(filteredData.posts[0].id) : null
                    }

                    const approve = $('.approve')

                    approve && approve.addEventListener('click', (event) => {
                        // get the id (title) of the clicked post
                        const arr = event.target.id.split('-')
                        const id = arr.at(-1)
                        const approvePost = { "id": parseInt(id), "user": user }
                        console.log(approvePost)
                        fetch(url + '/approve', {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(approvePost)
                        }).then(response => {
                            return response.json()
                        }).then(data => {
                            if (data.status === 200) {
                                // Gets and displays all posts in the posts.json file (including the new one)
                                // Boolean arguments are to call or not call functions inside postActions() - names of sub-functions below:
                                // search, title, tag, clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem
                                postActions(null, null, null, true, true, true, true, true, true, true, false)
                                window.location.replace('/')
                            }
                        })
                    })


                    // remake all charts functiony
                    if (charts === true) { makeChart(latestPosts, latestVotes) }

                    // voteBTNs addEventListeners
                    if (voteBTNlisteners === true) { voteBTN() }

                    // delete btns addEventListeners
                    if (deleteBTNs === true) {
                        const deleteBTN = $('.delete')
                        deleteBTN && deleteBTN.addEventListener('click', (event) => {
                            // get the id (title) of the clicked post
                            const arr = event.target.id.split('-')
                            const id = arr.at(-1)
                            deletePost(id, user)
                        })
                    }

                    const counter = new countdown
                    counter.count(item.id, latestVotes[index].expires, true)
                }

                if (looper === true) {
                    latestPosts.forEach((post, i) => {
                        postFunctions(post, i)
                    })
                }


                filteredData.posts.length == 0 ? $('#posts').innerHTML = `<div style="text-align: left; padding: 10px"><b>${queryURL.string}</b> - returned no results.</div>` : null
            })
    }
    // clear all items
    if (clearItems === true) {
        $('#posts').innerHTML = ''
    }

    // remove last post from HTML
    if (removeLastItem === true) {
        $('#posts .post:last-of-type').remove()
    }
}