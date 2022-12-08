import { formatDate } from '/js/date-formatting.js';
import { url } from '/js/proton.js';
import { countdown } from '/js/countdown.js';

// HTML item display template that is used when getItems is called
export class HTML {
    insertHTML(data) {
        // title
        let linkTitle = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        let mainLinkTitle = url + '/?' + data.type + '=' + linkTitle;
        let itemTitleLink = url + `/item/${linkTitle}`

        let pollHTML = '';
        const options = data.options;

        options && options.forEach((item, i) => {
            pollHTML += '<li><input id="' + data.id + '-option-' + i + '" type="radio" name="post-' + data.id + '-options" value="' + i + '"/> <label for="' + data.id + '-option-' + i + '">' + item + '</label></li>';
        });
        pollHTML = '<ol>' + pollHTML + '</ol>';


        // tags
        const tags = data.tags.split(" ");
        let tagsString = '';
        tags.forEach(item => {
            tagsString += `<a class="tag ${data.type}" href="${url}/tag/${item}">#${item}</a>`;
        });

        // check if we have an image
        let imageSRC;
        if (data.image && data.image != '') {
            imageSRC = data.image
        } else { imageSRC = '/img/love-technology.jpg'; }

        return `
        <article class="item" id="post-${data.id}">
            <div class="flex">
                <div class="flex justify-start">
                    <a class="main-image" href="${mainLinkTitle}" target="_blank"><img class="image" src="${imageSRC}" alt="${data.title}" /></a>

                    <div class="content">
                        <div class="user_info">
                            <span class="${data.type} item-type">${data.type}</span> <img class="avatar" src="/img/cade.jpg" /> <strong>@decryptr</strong> | <span class="date" id="date">` + formatDate(data.date) + `</span>
                            <span id="countdown"> | <img class="clock" src="/svgs/clock.svg" alt="clock" />`+ countdown(data.date) + ` d:h</span>
                            <span class="actions">
                                <button id="delete-${data.id}" class="delete"></button>
                            </span>
                        </div>
                        <a class="title ${data.type}" href="${itemTitleLink}"><h2>${data.title}</h2></a>
                        <div class="description"><p>${data.description}</p> ${pollHTML}</div>
                        <div class="tags ${data.type}"><b>Tags:</b> ${tagsString}</div>
                    </div>
                </div>
                <div class="voting" id="voting"><button id="vote-for-post-` + data.id + `" class="vote-btn ${data.type}-bg">Vote</button><canvas class="myChart"></canvas></div>
            </div>
        </article>
        `;
    }
}