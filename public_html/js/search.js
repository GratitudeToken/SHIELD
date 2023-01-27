import { $, $$ } from '/js/selectors.js';
import { url, user } from '/js/proton.js';
import { postActions } from '/js/post-actions.js';

export const search = () => {
    $('#search').addEventListener('submit', (event) => {
        event.preventDefault();
        let filterObj = {}
        filterObj.type = 'search';
        filterObj.string = $('#search input[type=text]').value;

        let searchURL = url + '/getposts?search=' + filterObj.string;

        fetch(searchURL)
            .then(response => {
                return response.json();
            })
            .then(data => {
                // Boolean arguments are to call or not call functions inside postActions() - names of sub-functions below:
                // filterObj, clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem
                postActions(filterObj, true, true, true, true, false, false, false, false);
            });
    });
}