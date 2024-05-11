var postsEle = document.querySelector('.posts')

fetch('https://blogfeed.adarshrkumar.dev/getAllPosts')
  .then(response => response.json())
  .then(json => {addPosts(json)})
  .catch(err => console.error(err))

function addPosts(posts) {
  if (posts) {
    posts.forEach(function(post) {
      console.log(post)
      var postEle = document.createElement('div')
      postEle.classList.add('post')
      
      if (!post.image) {
        post.image = {}
        post.image.src = `https://image.thum.io/get/maxAge/12/width/${Math.round(window.innerWidth/2)}/${location.protocol}//${location.host}/post/${post.slug}`
        post.image.alt = `Screenshot of the "${post.title}" post.`
      }

      var image = document.createElement('img')
      image.classList.add('post__img')
      
      if (post.image.src) image.src = post.image.src
      if (post.image.alt) image.alt = post.image.alt
      
      postEle.appendChild(image)
    
      if (post.title || post.content) {
        var info = document.createElement('div')
        info.classList.add('post__info')
        
        if (post.title) {
          var title = document.createElement('h3')
          title.classList.add('post__title')
          title.textContent = post.title
          info.appendChild(title)
        }
        
        if (post.content) {
          var postContent = document.createElement('p')
          
          var convEle = document.createElement('span')
          convEle.innerHTML = post.content
          document.body.appendChild(convEle)
          post.content = convEle.innerText
          convEle.remove()
          
          if (post.content.includes('\n')) post.content = post.content.split('\n').join('<br>')
          
          postContent.innerHTML = post.content

          info.appendChild(postContent)
        }
        
        postEle.appendChild(info)
      }
      
      postsEle.appendChild(postEle)
    })
  }
}