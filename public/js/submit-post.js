import { $, $$ } from '/js/selectors.js';
import { url, user } from '/js/proton.js';
import { imageValid } from '/js/image-select.js';
import { checkFileProperties, handleUploadedFile } from '/js/image-select.js';
import { postActions } from '/js/post-actions.js';
let postType;
let pollOptions = [];

export const submitPost = () => {
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
}