import { $, $$ } from '/js/selectors.js';
import { formatDate } from '/js/date-formatting.js';
import { url, user } from '/js/proton.js';
import { countdown } from '/js/countdown.js';

// HTML post display template that is used when getPosts is called
export class HTML {
    insertHTML(data) {
        // title
        let linkTitle = '?user=' + data.user + '&title=' + data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        // let mainLinkTitle = url + '/?' + data.type + '=' + linkTitle;
        // let postTitleLink = url + `/post/${linkTitle}`

        let pollHTML = '';
        const options = data.options;

        let votingDisabled;
        let checked;
        let deleteBtnTitle;
        let disabledColor;

        console.log(data)

        const counter = new countdown;
        const expired = counter.count(data.id, data.expires, false);

        let voted;
        data.voted === false ? voted = false : voted = data.voted.includes(user);

        if (expired === 'Expired' || voted === true) {
            checked = 'disabled';
            disabledColor = 'style="color: gray"';
            votingDisabled = 'disabled';
            deleteBtnTitle = 'title="You voted already."';
        } else {
            checked = ''; disabledColor = '';
            deleteBtnTitle = 'title="Hit the SHIELD to cast your vote."';
        }

        options && options.forEach((post, i) => {
            pollHTML += `<li><input id="post-${data.id}-option-${i}" type="radio" name="post-${data.id}-options" value="${i}" ${checked}/> <label for="post-${data.id}-option-${i}" ${disabledColor}>${post}</label></li>`;
        });

        pollHTML = '<ol>' + pollHTML + '</ol>';


        // tags
        const tags = data.tags.split(" ");
        let tagsString = '';
        tags.forEach(post => {
            tagsString += `<a class="tag ${data.type}" href="${url}?tag=${post}">#${post}</a>`;
        });

        // check if we have an image
        let imageSRC;
        if (data.image && data.image != '') {
            imageSRC = '/uploads/' + data.image;
        } else { imageSRC = '/img/love-technology.jpg'; }

        $('body').classList.add('postPage');

        return `
        <article class="post" id="post-${data.id}">
            <div class="flex">
                <div class="flex justify-start maxw-1111-230">
                    <a class="main-image" href="${imageSRC}" target="_blank"><img class="image" src="${imageSRC}" alt="${data.title}" /></a>

                    <div class="content">
                        <div class="user_info">
                            <span class="${data.type} post-type">${data.type}</span> <img class="avatar" src="/img/cade.jpg" /> <strong>@decryptr</strong> | <span class="date" id="date">` + formatDate(data.date) + ` | <img class="hourglass" src="/svgs/hourglass.svg" alt="clock" /></span>
                            <span class="countdown"></span>
                            <span class="actions">
                                <button id="delete-${data.id}" class="delete"></button>
                            </span>
                        </div>
                        <h1 class="title ${data.type}">${data.title}</h1>
                        <div class="description"><p>${data.description}</p> ${pollHTML}</div>
                        <div class="tags ${data.type}"><b>Tags:</b> ${tagsString}</div>
                    </div>
                </div>
                <div class="voting" id="voting"><button data-id="${data.id}" class="vote-btn ${data.type}-bg" ${votingDisabled} ${deleteBtnTitle}></button><canvas class="myChart"></canvas></div>
            </div>
        </article>
        <div class="comments">Comments Section</div>
        `;
    }
}