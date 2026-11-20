const dateOfBirth = {
    month: 3,
    day: 28,
    year: 2007
}

const currentDate = new Date()
const currentDateInfo = {
    month: currentDate.getMonth() + 1,
    day: currentDate.getDate(),
    year: currentDate.getFullYear()
}

export default currentDateInfo.month > dateOfBirth.month || (currentDateInfo.month === dateOfBirth.month && currentDateInfo.day >= dateOfBirth.day)
    ? currentDateInfo.year - dateOfBirth.year
    : currentDateInfo.year - dateOfBirth.year - 1
