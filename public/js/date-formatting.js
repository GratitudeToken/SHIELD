export const formatDate = (dateString) => {
    let options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", timeZone: 'Europe/Bucharest' }
    let date = new Date(dateString);
    return date.toLocaleDateString('ro-RO', options);
}