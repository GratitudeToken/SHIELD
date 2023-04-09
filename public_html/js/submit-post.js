import { $, $$ } from '/js/selectors.js'
import { url, user } from '/js/proton.js'
import { membership, accountStatus } from '/js/proton.js'
import { imageValid } from '/js/image-select.js'
import { checkFileProperties, handleUploadedFile } from '/js/image-select.js'
import { postActions } from '/js/post-actions.js'
let postType
let pollOptions = []
let imageSelected = false

export const submitPost = () => {

    $('#post-form').addEventListener('submit', (event) => {
        event.preventDefault()
        if (membership === true) {

            // get the number of options added and push 0 for each of them to the votes array
            let votes = []
            const voteInputsNr = $$('.voteInput').length
            for (let i = 0; i < voteInputsNr; i++) {
                votes.push(0)
            }

            const formData = new FormData()

            formData.append("user", user)
            formData.append("title", $("#title").value)
            imageSelected && imageValid ? formData.append("image", $("#image").files[0]) : null;
            formData.append("description", $("#description").value)

            $$('.voteInput').forEach((option) =>
                formData.append("options[]", option.value)
            )

            formData.append("tags", $('#tags-input').value)
            formData.append("type", $('input[name="type"]:checked').value);
            (votes || []).forEach((option) =>
                formData.append("votes[]", parseInt(option))
            )

            // Sends post request to /post with all input information
            fetch(url + '/post', {
                method: "POST",
                body: formData
            }).then(response => {
                return response.json()
            }).then(returnedData => {
                if (returnedData.status === 200) {
                    // Gets and displays all posts in the posts.json file (including the new one)
                    // Boolean arguments are to call or not call functions inside postActions() - names of sub-functions below:
                    // search, title, tag, clearItems, fetchy, looper, populatePosts, charts, voteBTNlisteners, deleteBTNs, removeLastItem
                    postActions(null, null, null, true, true, true, true, true, true, true, false)
                    window.location.replace('/')
                }
            })
        } else {
            let message = 'Only members can submit a post.\nAccount Membership Status:\n\n'
            if (accountStatus.balance >= 5) {
                message += 'Hold 5 GRAT in the account: OK\n'
            } else { message += 'Hold 5 GRAT in the account: NO\n' }

            if (accountStatus.kyc === true) {
                message += 'Pass the KYC process: OK'
            } else { message += 'Pass the KYC process: NO' }

            alert(message)
        }
    })


    $('#post-form').addEventListener('change', (event) => {
        postType = $('input[name="type"]:checked').value
        pollOptions = []
        $$('.voteInput').forEach((el, i) => {
            pollOptions.push(el.value)
        })
        if ($('input[name="type"]:checked').value === 'poll') {
            $('.options').style = ''
            $('#add-remove-inputs').style = 'display: block'
            $$('.voteInput').forEach((el, i) => {
                el.required = true
                el.placeholder = 'Option'
            })
        } else {
            $('.options').style = 'display: none'
            $('#add-remove-inputs').style = ''
            $$('.voteInput').forEach((el, i) => {
                el.required = false
            })
        }

        // check file selected
        let theFile
        if (event.target.files) {
            theFile = event.target.files[0]
            $('#error').classList.add('error')
            if (checkFileProperties(theFile)) {
                handleUploadedFile(theFile)
                imageSelected = true
            }
        }

    })
    $('#image').addEventListener('click', (event) => {
        $('#error').innerHTML = ''
        $('#error').classList.remove('error')
    })
}