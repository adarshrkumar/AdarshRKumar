import fs from 'fs'

function getPosts() {
    var posts = []

    const postFiles = fs.readdirSync(`${__dirname}/posts`)
    postFiles.forEach(function(p, i) {
      var post = fs.readFileSync(`posts/${p}`)
      posts.push(post)
    })

    return posts
}

export default getPosts