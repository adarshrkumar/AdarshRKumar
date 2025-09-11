const dob = {
    month: 3, 
    day: 28, 
    year: 2007,
}
  
const date = new Date()
const currentDate = {
    month: date.getMonth()+1, 
    day: date.getDate(), 
    year: date.getFullYear(),
}
  
let age = 0
if (
    (currentDate.month < dob.month) || 
    (
        currentDate.month === dob.month && 
        currentDate.day < 28
    )
) age = currentDate.year - dob.year - 1
else age = currentDate.year - dob.year
  
export default age