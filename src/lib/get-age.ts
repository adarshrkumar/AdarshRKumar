// Calculates current age based on date of birth; Accounts for whether birthday has occurred this year

// Date of birth configuration
const dateOfBirth = {
    month: 3,  // March
    day: 28,   // 28th
    year: 2007
}

// Get current date
const currentDate = new Date()
const currentDateInfo = {
    month: currentDate.getMonth() + 1,  // getMonth() returns 0-11, so add 1
    day: currentDate.getDate(),
    year: currentDate.getFullYear()
}

export default currentDateInfo.month > dateOfBirth.month || (currentDateInfo.month === dateOfBirth.month && currentDateInfo.day >= dateOfBirth.day)
    ? currentDateInfo.year - dateOfBirth.year
    : currentDateInfo.year - dateOfBirth.year - 1
