// export const countdown = (postDate) => {
//     const currrentDate = new Date();
//     const totalHours = 30 * 24; // 30 days expiration time for each post

//     const passedHours = Math.abs(new Date(currrentDate).getTime() - new Date(postDate).getTime()) / 3600000;

//     const remainingHours = totalHours - passedHours;

//     const remainingDays = (remainingHours / 24).toFixed();

//     const remainingExtraHours = remainingHours - (remainingDays * 24);

//     return remainingDays + ':' + remainingExtraHours.toFixed();
// }

import { $, $$ } from '/js/selectors.js';

export class countdown {
    count(id, date, updateDiv) { // if updateDiv is true, the method will update all .countdown divs with new countdown, if false, it will just return the result of the countdown function
        const passedDate = new Date(date).getTime();
        const countdownDiv = $('#post-' + id + ' .countdown');

        const countdown = function (time) {
            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = time - now;

            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));


            if (hours < 10) { hours = "0" + hours } else if (hours === 0) { hours = "00" }
            if (minutes < 10) { minutes = "0" + minutes } else if (minutes === 0) { minutes = "00" }

            // return the result
            let result;
            if (distance < 0) {
                result = "Closed";
            } else { result = days + ":" + hours + ":" + minutes + ' - D:H:M'; }

            return result
        }

        if (updateDiv === true) {
            countdownDiv.innerHTML = countdown(passedDate);
        } else { return countdown(passedDate) }
    }
}