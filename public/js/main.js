import { submitPost } from '/js/submit-post.js';
import { postActions } from '/js/post-actions.js';
import { addBTN, closeBTN, addOption, removeOption } from '/js/event-listeners.js';
addBTN(); closeBTN(); addOption(); removeOption();

submitPost();
// first page load - populate all posts
postActions(true, true, true, true, true, true, true, false);


