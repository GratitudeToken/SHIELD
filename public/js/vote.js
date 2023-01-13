import { $, $$ } from '/js/selectors.js';
import { url, user } from '/js/proton.js';
import { postActions } from '/js/post-actions.js';

export const voteBTN = (title, tag) => {
    // REFACTOR THIS ENTIRE FUKN THING, I broke it, also check if delete works, including image file
    $$('.vote-btn').forEach(el => {
        el.addEventListener('click', (e) => {

            let obj = {}
            obj.id = parseInt(e.target.dataset.id);
            obj.user = user;

            const snd = $("#vote-sound");
            const checkedRadio = $('input[name="post-' + obj.id + '-options"]:checked') || null;

            if (checkedRadio) {
                obj.vote = checkedRadio.value;

                const stringifiedObj = JSON.stringify(obj);

                fetch(url + '/vote', {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: stringifiedObj
                }).then(response => {
                    return response.json();
                }).then(data => {
                    snd.play();
                    if (!snd.paused) {
                        el.disabled = true;
                        el.classList.remove('voted');
                        el.classList.add('voted');
                        // Boolean arguments are to call or not call functions inside postActions() - names of sub-functions below:
                        // title, tag, clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem
                        postActions(title, tag, true, true, false, true, true, true, true, false);
                    }
                }).catch(err => {
                    console.log(err)
                });
            } else {
                alert('You have to select an option to vote.')
            }
        });
    });
}