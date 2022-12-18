import { $, $$ } from '/js/selectors.js';
import { url, user } from '/js/proton.js';
import { HTML } from '/js/post-template.js';
import { makeChart } from '/js/chart.js';
import { voteBTN } from '/js/vote.js';
import { deletePost } from '/js/delete-post.js';

export const postActions = (clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem) => {
    if (fetchy === true) {
        fetch(url + '/getposts/' + user)
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (looper === true) {
                    data.posts.forEach(post => {
                        // populate HTML function
                        if (populatePosts === true) {
                            const html = new HTML;
                            $('#posts').innerHTML += html.insertHTML(post);
                        }


                        // remake all charts function
                        if (charts === true) { makeChart(data.posts) }

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