var iframe = document.querySelector('main #main-content content iframe')

function check() {
  if (iframe.window.location.href === 'https://www.blogger.com/profile/15375469230044994043') {
    window.open('https://www.blogger.com/profile/15375469230044994043')
    iframe.window.history.go(-1)
  }
}
setInterval(1000, check)