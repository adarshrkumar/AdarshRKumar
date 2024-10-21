function getPfpFileName(username) {
    var files = fs.readdirSync(`${__dirname}/authors/${username}`)
    return files.filter((file) => file.startsWith('pfp'));
}
  
export default getPfpFileName  