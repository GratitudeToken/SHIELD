import { formatDate } from '/js/date-formatting.js';
import { url, user } from '/js/proton.js';
import { countdown } from '/js/countdown.js';

// HTML post display template that is used when getPosts is called
export class indexHTML {
    insertHTML(data) {
        // title
        let linkTitle = '?title=' + data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        let voted;
        let votedClass = '';
        const counter = new countdown;
        const expired = counter.count(data.id, data.expires, false);
        data.voted === false ? voted = false : voted = data.voted.includes(user);

        if (expired === 'Expired' || voted === true) {
            votedClass = 'postVoted'
        } else {
            votedClass = ''
        }

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
                    <div class="flex-space-vertical">
                        <div class="user_info">
                            <span class="${data.type} post-type">${data.type}</span> <img class="avatar" src="/img/cade.jpg" /> <strong>@decryptr</strong> | <span class="date" id="date">` + formatDate(data.date) + ` | <img class="hourglass" src="/svgs/hourglass.svg" alt="clock" /></span>
                            <span class="countdown"></span>
                        </div>
                        <div class="title ${data.type}"><h2>${data.title}</h2></div>
                    </div>
                </div>
            </a>
        </article>
        `;
    }
}