var postsEle = document.querySelector('.posts')

fetch('https://blogfeed.adarshrkumar.dev/getAllPosts')
  .then(response => response.json())
  .then(json => {addPosts(json)})
  .catch(err => console.error(err))

function addPosts(posts) {
  if (posts) {
    posts.forEach(function(post) {
      console.log(post)
      var postEle = document.createElement('a')
      postEle.classList.add('post')
      postEle.href = `/post/${post.slug}`
      
      if (!post.image) {
        post.image = {}
        post.image.src = `https://image.thum.io/get/maxAge/12/width/${250}/${location.protocol}//${location.host}/post/${post.slug}`
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
          if (post.content.includes('&lt;')) post.content = post.content.split('&lt;').join('<')
          if (post.content.includes('&gt;')) post.content = post.content.split('&gt;').join('<')


          var postContent = document.createElement('p')
          postContent.classList.add('post__content')
          
          var convEle = document.createElement('span')
          convEle.innerHTML = post.content
          document.body.appendChild(convEle)
          post.content = convEle.textContent
          var firstContent = convEle.querySelector('*').textContent
          convEle.remove()
          
          if (firstContent.includes('\n')) firstContent = firstContent.split('\n').join('')
          
          postContent.innerHTML = firstContent

          info.appendChild(postContent)
        }
        
        postEle.appendChild(info)
      }
      
      postsEle.appendChild(postEle)
    })
  }
}