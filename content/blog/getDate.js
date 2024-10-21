var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function getDate(date) {
    var d = new Date(date)
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

export default getDate