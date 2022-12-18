import { $, $$ } from '/js/selectors.js';
import { HTML } from '/js/post-template.js';
import { user } from '/js/proton.js';
import { url } from '/js/proton.js';
import { makeChart } from '/js/chart.js';
import { checkFileProperties, handleUploadedFile } from '/js/image-select.js';

// here we will add all user input data
let allPosts = new Object();
let postType;
let pollOptions = [];

const postActions = (clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem) => {
    if (fetchy === true) {
        fetch(url + '/getposts/' + user)
            .then(response => {
                return response.json();
            })
            .then(data => {
                allPosts = data.posts;
                if (looper === true) {
                    allPosts.forEach(post => {
                        // populate HTML function
                        if (populatePosts === true) {
                            const html = new HTML;
                            $('#posts').innerHTML += html.insertHTML(post);
                        }


                        // remake all charts function
                        if (charts === true) { makeChart(allPosts) }

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

postActions(true, true, true, true, true, true, true, false);


$('#add').addEventListener('click', (event) => {
    $('#post-container').style.display = 'flex';
    $('#close').style.display = 'block';
    $('body').style.overflow = 'hidden';
});

$('#close').addEventListener('click', (event) => {
    $('#post-container').style.display = 'none';
    $('body').style.overflow = '';
});

$('#add_option').addEventListener('click', (event) => {
    event.preventDefault();
    if ($$('.voteInput').length < 9) {
        $('.options').innerHTML += '<input class="voteInput" type="text" required />';
        $('#remove_option').style = 'display: inline-block !important';
        $('.voteInput:first-of-type').placeholder = '';
        $('.voteInput:nth-of-type(2)').placeholder = '';
    } else { alert('Maximum number of options is 9.') }
});

$('#remove_option').addEventListener('click', (event) => {
    event.preventDefault();
    if ($$('.voteInput').length === 3) {
        $('.voteInput:last-of-type').remove();
        event.target.style = 'display: none !important';
        $('.voteInput:first-of-type').placeholder = 'Yes';
        $('.voteInput:nth-of-type(2)').placeholder = 'No';
    }
    if ($$('.voteInput').length > 2) {
        $('.voteInput:last-of-type').remove();
    }
});


const voteBTN = () => {
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


$('#post-form').addEventListener('change', (event) => {
    postType = $('input[name="type"]:checked').value;
    pollOptions = [];
    $$('.voteInput').forEach((el, i) => {
        pollOptions.push(el.value);
    });
    if ($('input[name="type"]:checked').value === 'poll') {
        $('.options').style = '';
        $('#add-remove-inputs').style = 'display: block';
        $$('.voteInput').forEach((el, i) => {
            el.required = true;
            if (i === 0) {
                el.placeholder = 'Yes'
            } else {
                el.placeholder = 'No';
            }
        });
    } else {
        $('.options').style = 'display: none';
        $('#add-remove-inputs').style = '';
        $$('.voteInput').forEach((el, i) => {
            el.required = false;
            el.placeholder = '';
        });
    }

    // check file selected
    let theFile;
    if (event.target.files) {
        theFile = event.target.files[0];
        $('#error').innerHTML = '';
        if (checkFileProperties(theFile)) {
            handleUploadedFile(theFile);
        }
    }

});

// Add posts to the data array in posts.json
$('#post-form').addEventListener('submit', (event) => {
    event.preventDefault();
    // VERY IMPORTANT !!!!
    // WE MUST CHECK IF THE USER IS VISIONARY by validating proton transactions that happened for this user
    // otherwise he will get a message saying he does not have enough tokens staked to create a visionary post

    if (imageValid) {
        // get the number of options added and push 0 for each of them to the votes array
        let votes = [];
        const voteInputsNr = $$('.voteInput').length;
        for (let i = 0; i < voteInputsNr; i++) {
            votes.push(0);
        }

        const formData = new FormData();

        formData.append("user", user);
        formData.append("title", $("#title").value);
        formData.append("image", $("#image").files[0]);
        formData.append("description", $("#description").value);
        (postType === "poll" ? pollOptions : ["Yes", "No"]).forEach((option) =>
            formData.append("options[]", option)
        );
        formData.append("tags", "tag1, tag5");
        formData.append("type", $('input[name="type"]:checked').value);
        (votes || []).forEach((option) =>
            formData.append("votes[]", parseInt(option))
        );

        // Sends post request to /post with all input information
        fetch(url + '/post', {
            method: "POST",
            body: formData
        }).then(response => {
            return response.json();
        }).then(returnedData => {
            if (returnedData.status === 200) {
                // Gets and displays all posts in the posts.json file (including the new one just made)
                postActions(true, true, true, true, true, true, true, false);
                // const html = new HTML;
                // $('#posts').innerHTML += html.insertHTML(formData); ///////////////////////////////////////  adding is not working, delete is also not working properly

                // Hides the form to add an post
                $('#post-container').style.display = 'none';
                $('#close').style.display = 'none';
                $('body').style.overflow = '';
            }

        });
    }

});


const deletePost = (id, user) => {
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
                    postActions(true, true, true, true, true, true, true, false);
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
}