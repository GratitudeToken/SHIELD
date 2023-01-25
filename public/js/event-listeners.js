import { $, $$ } from '/js/selectors.js';

export const addBTN = () => {
    $('#add').addEventListener('click', (event) => {
        $('#post-form-container').style.display = 'flex';
        $('#close').style.display = 'block';
        $('body').style.overflow = 'hidden';
    });
}

export const closeBTN = () => {
    $('#close').addEventListener('click', (event) => {
        $('#post-form-container').style.display = 'none';
        $('body').style.overflow = '';
    });
}

export const addOption = () => {
    $('#add_option').addEventListener('click', (event) => {
        event.preventDefault();
        if ($$('.voteInput').length < 9) {
            $('.options').innerHTML += '<input class="voteInput" type="text" maxlength="96" required />';
            $('#remove_option').style = 'display: inline-block !important';
            $('.voteInput:first-of-type').placeholder = '';
            $('.voteInput:nth-of-type(2)').placeholder = '';
        } else { alert('Maximum number of options is 9.') }
    });
}

export const removeOption = () => {
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
}