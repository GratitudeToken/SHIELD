import { url, user } from '/js/proton.js';
import { postActions } from '/js/post-actions.js';

export const deletePost = (id, user) => {
    // Fetches all data from posts.json
    const promptString = prompt('Are you sure you want to delete this post?', 'YES');
    if (promptString != null && promptString === 'YES') {
        //const correctPost = fetchedPosts.find(post => post.title === postTitle);
        let deleteID = JSON.stringify({ "id": id, "user": user });
        fetch(url + '/delete', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: deleteID
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                if (data.status === 200) {
                    // Boolean arguments are to call or not call functions inside postActions() - names of sub-functions below:
                    // title, tag, clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem
                    postActions(false, false, true, true, true, true, true, true, true, false);
                    window.location.replace('/');
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
}