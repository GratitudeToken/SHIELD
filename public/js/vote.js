import { $, $$ } from '/js/selectors.js';
import { url, user } from '/js/proton.js';
import { postActions } from '/js/post-actions.js';

export const voteBTN = () => {

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
                        postActions(true, true, true, true, true, true, true, false);
                    }

                    //location.reload();
                    // HOW DO YOU KNOW IF THE USER VOTED TO DISABLE VOTING FOR THIS POST FOR THAT USER?
                    // change file structure, create separate file for each users and add arrays to each user
                    // one array with the post ID for posts he created, one with posts he already voted on with 2 keys, post ID and option chosen
                    // etc
                }).catch(err => {
                    console.log(err)
                });
            } else {
                alert('You have to select an option to vote.')
            }
        });
    });
}