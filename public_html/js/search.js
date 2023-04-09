import { $, $$ } from '/js/selectors.js';
import { url, user } from '/js/proton.js';
import { postActions } from '/js/post-actions.js';

export const search = () => {
    $('#search').addEventListener('submit', (event) => {
        event.preventDefault();
        let queryURL = {}
        queryURL.type = 'search';
        queryURL.string = $('#search input[type=text]').value;



        let searchURL = url + '/getposts?search=' + queryURL.string;

        fetch(searchURL)
            .then(response => {
                return response.json();
            })
            .then(data => {
                $('body').classList.remove('postPage')
                // Boolean arguments are to call or not call functions inside postActions() - names of sub-functions below:
                // queryURL, clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem
                postActions(queryURL, true, true, true, true, false, false, false, false);
                $('.features').style.display = 'none'
            });
    });
}