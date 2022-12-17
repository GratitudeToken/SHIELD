import { formatDate } from '/js/date-formatting.js';
import { url } from '/js/proton.js';
import { user } from '/js/proton.js';
import { countdown } from '/js/countdown.js';

// HTML post display template that is used when getPosts is called
export class HTML {
    insertHTML(data) {
        // title
        let linkTitle = data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        // let mainLinkTitle = url + '/?' + data.type + '=' + linkTitle;
        // let postTitleLink = url + `/post/${linkTitle}`

        let pollHTML = '';
        const options = data.options;

        let disabled;
        if (data.voted !== false) {
            disabled = 'disabled';
        }
        let checked;
        options && options.forEach((post, i) => {
            data.voted === i ? checked = 'checked' : checked = 'disabled';
            pollHTML += `<li><input id="post-${data.id}-option-${i}" type="radio" name="post-${data.id}-options" value="${i}" ${checked}/> <label for="post-${data.id}-option-${i}">${post}</label></li>`;
        });
        pollHTML = '<ol>' + pollHTML + '</ol>';


        // tags
        const tags = data.tags.split(" ");
        let tagsString = '';
        tags.forEach(post => {
            tagsString += `<a class="tag ${data.type}" href="${url}/tag/${post}">#${post}</a>`;
        });

        // check if we have an image
        let imageSRC;
        if (data.image && data.image != '') {
            imageSRC = data.image
        } else { imageSRC = '/img/love-technology.jpg'; }

        return `
        <article class="post" id="post-${data.id}">
            <div class="flex">
                <div class="flex justify-start">
                    <a class="main-image" href="${linkTitle}" target="_blank"><img class="image" src="${imageSRC}" alt="${data.title}" /></a>

                    <div class="content">
                        <div class="user_info">
                            <span class="${data.type} post-type">${data.type}</span> <img class="avatar" src="/img/cade.jpg" /> <strong>@decryptr</strong> | <span class="date" id="date">` + formatDate(data.date) + `</span>
                            <span id="countdown"> | <img class="clock" src="/svgs/clock.svg" alt="clock" />`+ countdown(data.date) + ` d:h</span>
                            <span class="actions">
                                <button id="delete-${data.id}" class="delete"></button>
                            </span>
                        </div>
                        <a class="title ${data.type}" href="${linkTitle}"><h2>${data.title}</h2></a>
                        <div class="description"><p>${data.description}</p> ${pollHTML}</div>
                        <div class="tags ${data.type}"><b>Tags:</b> ${tagsString}</div>
                    </div>
                </div>
                <div class="voting" id="voting"><button data-id="${data.id}" class="vote-btn ${data.type}-bg" ${disabled}></button><canvas class="myChart"></canvas></div>
            </div>
        </article>
        `;
    }
}