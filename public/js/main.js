import { submitPost } from '/js/submit-post.js';
import { postActions } from '/js/post-actions.js';
import { addBTN, closeBTN, addOption, removeOption } from '/js/event-listeners.js';
addBTN(); closeBTN(); addOption(); removeOption();

submitPost(); // listener for submit event

// page load - populate all posts
// Boolean arguments are to call or not call functions inside postActions() - names of sub-functions below:
// title, tag, clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem
const urlString = window.location.search;
const urlSearch = new URLSearchParams(urlString);

if (urlSearch.get('title')) {
    postActions(urlSearch.get('title'), null, true, true, true, true, true, true, true, false);
}
else if (urlSearch.get('tag')) {
    postActions(null, urlSearch.get('tag'), true, true, true, true, true, true, true, false);
}
else {
    postActions(null, null, true, true, true, true, false, false, false, false);
}



