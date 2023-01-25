import { submitPost } from '/js/submit-post.js';
import { search } from '/js/search.js';
import { postActions } from '/js/post-actions.js';
import { addBTN, closeBTN, addOption, removeOption } from '/js/event-listeners.js';
addBTN(); closeBTN(); addOption(); removeOption();

search(); // search method
submitPost(); // listener for submit event

// page load - populate all posts
// Boolean arguments are to call or not call functions inside postActions() - names of sub-functions below:
// filterObj, clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem
const urlString = window.location.search;
const urlSearch = new URLSearchParams(urlString);

let filterObj = {}


if (urlSearch.get('title') !== null) {
    filterObj.type = 'title';
    filterObj.string = urlSearch.get('title');
    // generate post page
    postActions(filterObj, true, true, true, true, true, true, true, false);
}
else if (urlSearch.get('tag') !== null) {
    filterObj.type = 'tag';
    filterObj.string = urlSearch.get('tag');
    // generate post page
    postActions(filterObj, true, true, true, true, true, true, true, false);
}

else {
    // generate index page
    postActions(null, true, true, true, true, false, false, false, false);
}



