export const countdown = (postDate) => {
    const currrentDate = new Date();
    const totalHours = 30 * 24; // 30 days expiration time for each post

    const passedHours = Math.abs(new Date(currrentDate).getTime() - new Date(postDate).getTime()) / 3600000;

    const remainingHours = totalHours - passedHours;

    const remainingDays = (remainingHours / 24).toFixed();

    const remainingExtraHours = remainingHours - (remainingDays * 24);

    return remainingDays + ':' + remainingExtraHours.toFixed();
}