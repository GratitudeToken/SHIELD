import { $, $$ } from '/js/selectors.js';
import { url, user } from '/js/proton.js';
import { indexHTML } from '/js/index-template.js';
import { HTML } from '/js/post-template.js';
import { makeChart } from '/js/chart.js';
import { voteBTN } from '/js/vote.js';
import { deletePost } from '/js/delete-post.js';
import { countdown } from '/js/countdown.js';

export const postActions = (filterObj, clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem) => {

    let newURL = url + '/getposts';
    //console.log(filterObj);

    if (filterObj !== null) {

        filterObj.type === 'search' ? newURL = url + '/getposts?search=' + filterObj.string : null;
        filterObj.type === 'title' ? newURL = url + '/getposts?title=' + filterObj.string : null;
        filterObj.type === 'tag' ? newURL = url + '/getposts?tag=' + filterObj.string : null;
    }


    if (fetchy === true) {
        fetch(newURL)
            .then(response => {
                return response.json();
            })
            .then(data => {
                // let's reverse order of data on the client, to save computing power on server and to have most recent posts to be first
                const latestPosts = data.posts.reverse();
                let latestVotes;
                data.votes ? latestVotes = data.votes.reverse() : null;

                const postFunctions = (item, index) => {
                    // populate HTML function
                    if (populatePosts === true) {
                        let html;
                        // if the URL coming from page load on main.js and passed to this postActions function does not contain any title or tag parameters, use indexHTML, else, use HTML
                        if (filterObj === null) {
                            html = new indexHTML
                        } else { html = new HTML }
                        $('#posts').innerHTML += html.insertHTML({ ...item, ...latestVotes[index] });
                    }


                    // remake all charts functiony
                    if (charts === true) { makeChart(latestPosts, latestVotes) }

                    // voteBTNs addEventListeners
                    if (voteBTNlisteners === true) { voteBTN() }

                    // delete btns addEventListeners
                    if (deleteBTNs === true) {
                        $$('.delete').forEach(element => {
                            element.addEventListener('click', (event) => {
                                // get the id (title) of the clicked post
                                const arr = event.target.id.split('-')
                                const id = arr.at(-1);
                                deletePost(id, user)
                            });
                        });
                    }

                    const counter = new countdown;
                    counter.count(item.id, latestVotes[index].expires, true);
                }

                if (looper === true) {
                    latestPosts.forEach((post, i) => {
                        postFunctions(post, i)
                    });
                }
            });
    }
    // clear all items
    if (clearItems === true) {
        $('#posts').innerHTML = '';
    }

    // remove last post from HTML
    if (removeLastItem === true) {
        $('#posts .post:last-of-type').remove()
    }
}