import { $, $$ } from '/js/selectors.js';
import { url, user } from '/js/proton.js';
import { indexHTML } from '/js/index-template.js';
import { HTML } from '/js/post-template.js';
import { makeChart } from '/js/chart.js';
import { voteBTN } from '/js/vote.js';
import { deletePost } from '/js/delete-post.js';

export const postActions = (title, tag, clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem) => {
    let newURL = '';

    title != null ? newURL = url + '/getposts?title=' + title : null;
    tag != null ? newURL = url + '/getposts?tag=' + tag : null;
    title === null && tag === null ? newURL = url + '/getposts' : null;

    if (fetchy === true) {
        fetch(newURL)
            .then(response => {
                return response.json();
            })
            .then(data => {
                // let's reverse order of data on the client, to save computing power on server and to have most recent posts to be first
                const latestPosts = data.posts.reverse();
                const latestVotes = data.votes.reverse();
                const postFunctions = (item, index) => {
                    // populate HTML function
                    if (populatePosts === true) {
                        let html;
                        // if the URL coming from page load on main.js and passed to this postActions function does not contain any title or tag parameters, use indexHTML, else, use HTML
                        if (title === null && tag === null) {
                            html = new indexHTML
                        } else { html = new HTML }
                        console.log(data);
                        $('#posts').innerHTML += html.insertHTML({ ...item, ...latestVotes[index] });
                    }


                    // remake all charts functiony
                    if (charts === true) { makeChart(latestVotes) }

                    // voteBTNs addEventListeners
                    if (voteBTNlisteners === true) { voteBTN(title, tag) }

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