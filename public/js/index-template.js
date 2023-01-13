import { formatDate } from '/js/date-formatting.js';
import { url, user } from '/js/proton.js';
import { countdown } from '/js/countdown.js';

// HTML post display template that is used when getPosts is called
export class indexHTML {
    insertHTML(data) {
        // title
        let linkTitle = '?title=' + data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        let votedClass = '';
        data.voted === false ? votedClass = '' : votedClass = 'postVoted';

        // check if we have an image
        let imageSRC;
        if (data.image && data.image != '') {
            imageSRC = '/uploads/' + data.image;
        } else { imageSRC = '/img/love-technology.jpg'; }

        return `
        <article class="post ${votedClass}" id="post-${data.id}">
            <a href="${linkTitle}" class="flex indexPost">
                <div class="main-image"><img class="image" src="${imageSRC}" alt="${data.title}" /></div>

                <div class="content">
                    <div class="user_info">
                        <span class="${data.type} post-type">${data.type}</span> <img class="avatar" src="/img/cade.jpg" /> <strong>@decryptr</strong> | <span class="date" id="date">` + formatDate(data.date) + `</span>
                        <span id="countdown"> | <img class="clock" src="/svgs/clock.svg" alt="clock" />`+ countdown(data.date) + ` d:h</span>
                    </div>
                    <span class="title ${data.type}" href="${linkTitle}"><h2>${data.title}</h2></span>
                </div>
            </a>
        </article>
        `;
    }
}