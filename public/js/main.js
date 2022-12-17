import { $, $$ } from '/js/selectors.js';
import { HTML } from '/js/post-template.js';
import { user } from '/js/proton.js';
import { url } from '/js/proton.js';
import { makeChart } from '/js/chart.js';

// here we will add all user input data
let postType;
let pollOptions = [];
let imageValid = false;
let imageValidation = '';

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
            const arr = e.target.id.split('-');
            const num = arr.at(-1);
            obj.id = num;
            obj.user = user;

            const snd = $("#vote-sound");

            if ($('input[name="post-' + num + '-options"]').checked) {
                obj.vote = $('input[name="post-' + num + '-options"]:checked').value;

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
                        el.classList.remove('voted');
                        el.classList.add('voted');
                        el.disabled = true;
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
                getPosts();

                // Hides the form to add an post
                $('#post-container').style.display = 'none';
                $('#close').style.display = 'none';
                $('body').style.overflow = '';
            }

        });
    }

});


// // function to get all posts from posts.json file
const getPosts = () => {
    // Fetches all data from posts.json
    fetch(url + '/getposts/' + user)
        .then(response => {
            return response.json();
        })
        .then(data => {
            //Takes data from files and calls the HTML template to display the data
            $('#posts').innerHTML = '';
            data.posts.forEach(post => {
                const html = new HTML;
                $('#posts').innerHTML += html.insertHTML(post);
                makeChart(data.posts);
                voteBTN();

                // add event listener for the dynamically created delete buttons
                $$('.delete').forEach(element => {
                    element.addEventListener('click', (event) => {
                        // get the id (title) of the clicked post
                        const arr = event.target.id.split('-')
                        const id = arr.at(-1);
                        deletePost(id)
                    });
                });
            });
        });
}

getPosts();

const vote = () => {
    $$('#voting input').forEach(element => {
        element.addEventListener('click', (event) => {
            console.log(event.target)
        });
    });
}

vote();

const deletePost = (id) => {
    // Fetches all data from posts.json
    const promptString = prompt('Are you sure you want to delete this post?', 'YES');
    if (promptString != null && promptString === 'YES') {
        //const correctPost = fetchedPosts.find(post => post.title === postTitle);
        let deleteID = JSON.stringify({ "id": id });
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
                    getPosts()
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
}

// HANDLING IMAGE UPLOAD

function checkFileProperties(theFile) {
    if (
        theFile &&
        (theFile.type !== "image/png" && theFile.type !== "image/jpeg" && theFile.type !== "image/jpg" && theFile.type !== "image/gif" && theFile.type !== "image/webp" && theFile.type !== "image/svg")
    ) {
        imageValidation = '<b>Error:</b> Only - PNG, JPG, JPEG, GIF, WEBP and SVG file types are accepted.';
        $('#error').innerHTML = imageValidation;
        return false;
    } else { imageValid = true; }

    if (theFile.size > 512000) {
        imageValidation = '<b>Error:</b> ' + (theFile.size / 1024).toFixed(2) + ' KB - File size is too big. Max file size is: 500 KB';
        $('#error').innerHTML = imageValidation;
        return false;
    } else { imageValid = true; }

    return true;
}

function handleUploadedFile(file) {
    $("#image-label").innerHTML = "";
    const fileName = file.name;
    var img = document.createElement("img");
    img.setAttribute("id", "theImageTag");
    img.file = file;
    $("#image-label").appendChild(img);

    var reader = new FileReader();
    reader.onload = (function (aImg) {
        return function (e) {
            aImg.src = e.target.result;
            $("#post-form").add;
        };
    })(img);
    reader.readAsDataURL(file);
}