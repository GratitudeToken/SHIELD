import { $, $$ } from '/js/selectors.js'
import { formatDate } from '/js/date-formatting.js'
import { url, user } from '/js/proton.js'
import { countdown } from '/js/countdown.js'

// HTML post display template that is used when getPosts is called
export class indexHTML {
    insertHTML(data) {
        let approved
        !data.approved ? approved = 'unapproved' : approved = ''

        // title
        let linkTitle = ''
        if (data && data.title) {
            linkTitle = '?title=' + data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
        }
        let voted
        let closedStatus = ''
        const counter = new countdown
        const closed = counter.count(data.id, data.expires, false)
        data.voted === false ? voted = false : voted = data.voted.includes(user);

        if (closed === 'Closed') {
            closedStatus = 'post-closed'
        } else if (voted === true) {
            closedStatus = 'post-voted'
        } else { closedStatus = '' }

        // check if we have an image
        let imageSRC
        if (data.image && data.image != '') {
            imageSRC = '/uploads/' + data.image
        } else { imageSRC = '/img/love-technology.jpg' }

        return `
            <article class="post ${closedStatus} ${approved}" id="post-${data.id}">
                <a href="${linkTitle}" class="flex indexPost" title="${data.user}">
                    <div class="main-image avatar"><img class="image" src="/avatars/${data.user}.webp" alt="${data.user} avatar" /></div>

                    <div class="content">
                        <div class="flex-space-vertical">
                            <div class="user_info flex">
                                <span class="${data.type} post-type">${data.type}</span>
                                <img class="calendar" src="/svgs/calendar.svg" alt="calendar date posted icon" />
                                <span class="date" title="Date posted">` + formatDate(data.date) + `</span>
                                <img class="hourglass" src="/svgs/hourglass.svg" alt="hourglass time left icon" />
                                <span class="countdown" title="Time left (Days : Hours : Minutes)"></span>
                            </div>
                            <div class="title ${data.type}"><h2>${data.title}</h2></div>
                        </div>
                    </div>
                </a>
            </article>
            `
    }
}