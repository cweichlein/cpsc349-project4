import * as helper from './helper.js'
import * as mockroblog from './mockroblog.js'

console.log('timeline.js called')

// Determine what type of content to display

let timeline = null
let loggedInUser = window.sessionStorage.getItem('user')
loggedInUser = JSON.parse(loggedInUser)
let username = null
if (loggedInUser.username !== null) {
  username = loggedInUser.username
}

if (document.getElementById('home_tl') === document.querySelector('.active')) {
  timeline = await helper.getHomeTimeline(username)
} else if (document.getElementById('user_tl') === document.querySelector('.active')) {
  timeline = mockroblog.getUserTimeline(username) //todo
} else if (document.getElementById('public_tl') === document.querySelector('.active')) {
  timeline = mockroblog.getPublicTimeline()   //todo
}

// Logged in as {username} on navbar

const loginStatus = document.getElementsByClassName('login-status')

for (let i = 0; i < loginStatus.length; i++) {
  if (username !== null) {
    loginStatus[i].innerHTML = 'Logged in as @' + username
    loginStatus[i].classList.add('cursor-default')
  } else {
    loginStatus[i].innerHTML = 'Login or Register'
    loginStatus[i].classList.add('hover:bg-purple-700')
    loginStatus[i].setAttribute('href', './')
  }
}

// Logout when hitting logout button

function logout () {
  window.sessionStorage.clear()
  window.location.href = './'
}

document.getElementById('logout-button').onclick = function () { logout() }
document.getElementById('mobile-logout-button').onclick = function () { logout() }

// Redirect to login page if not logged in

if (!window.location.pathname.includes('/about.html')) {
  if (username === null) {
    window.location.href = './'
    window.sessionStorage.setItem('login-error', 'Error: You must log in first!')
  }
}

// Mobile dropdown navbar

const mobileBtn = document.getElementById('mobile-menu-button')
const mobileMenu = document.getElementById('mobile-menu')
const menuBtnIcon = document.getElementById('mobile-menu-button-icon-menu')

mobileBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden')

  if (menuBtnIcon.id === 'mobile-menu-button-icon-menu') {
    menuBtnIcon.setAttribute('d', 'M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293' +
        ' 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z')
    menuBtnIcon.setAttribute('id', 'mobile-menu-button-icon-x')
  } else {
    menuBtnIcon.setAttribute('d', 'M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110' +
        ' 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z')
    menuBtnIcon.setAttribute('id', 'mobile-menu-button-icon-menu')
  }
})

// Generate div for each blog post

if (!window.location.pathname.includes('/about.html')) {
  if (timeline !== null) {
    for (let i = 0; i < timeline.length; i++) {
      let user = await helper.getUser(timeline[i].user_id)
      let postUsername = user.username
      let postUserId = user.id

      let followOrUnfollowButton = ''
      if (postUsername !== username) {
        followOrUnfollowButton = "<button class='" + postUsername + '-follow-or-unfollow-button ' +
        "rounded-lg p-1 bg-indigo-500 hover:bg-purple-700 transition duration-300'></button>"
      }
      const timelinePost = document.createElement('div')
      timelinePost.className = 'p-5 m-5 rounded-lg bg-black'
      timelinePost.innerHTML += "<div class='flex flex-row text-center items-center justify-between mb-2'>" +
      '<p>' + postUsername + '</p>' + followOrUnfollowButton + '</div><hr>'
      timelinePost.innerHTML += "<div class='post-text m-2 break-words'>" + timeline[i].text + '</div>'
      timelinePost.innerHTML += "<hr><p class='mt-2'>" + timeline[i].timestamp + '</p>'

      document.getElementById('timeline').append(timelinePost)

      // Follow/Unfollow
      console.log(loggedInUser.id)
      let followArr = await helper.getFollowing(loggedInUser.id)
      console.log(followArr)
      let found = false
      for (let j = 0; j < followArr.length; j++) {
        console.log(username + ', ' + followArr[j])
        if (postUserId === followArr[j]) // if found, button is unfollow
        {
          found = true
          const buttonArr = document.getElementsByClassName(postUsername + '-follow-or-unfollow-button')
          for (let k = 0; k < buttonArr.length; k++) {
            buttonArr[k].innerHTML = 'Unfollow'
            buttonArr[k].addEventListener('click', () => {
              mockroblog.removeFollower(window.sessionStorage.getItem('uid'), timeline[i].user_id)
              buttonArr[k].innerHTML = 'Follow'
            })
          }
        }
      }
      if (!found) // if not found, button is follow
      {
        const buttonArr = document.getElementsByClassName(postUsername + '-follow-or-unfollow-button')
        for (let l = 0; l < buttonArr.length; l++) {
          buttonArr[l].innerHTML = 'Follow'
          buttonArr[l].addEventListener('click', () => {
            mockroblog.addFollower(window.sessionStorage.getItem('uid'), timeline[i].user_id)
            buttonArr[l].innerHTML = 'Unfollow'
          })
        }
      }
    }
  }
}

// New post dropdown menu

if (!window.location.pathname.includes('/following.html') && !window.location.pathname.includes('/about.html')) {
  const newPostBtn = document.getElementById('new-post-button')
  const newPostArea = document.getElementById('new-post-area')

  newPostBtn.addEventListener('click', () => {
    newPostArea.classList.toggle('hidden')
  })
}

// Post button functionality

function publishPost () {
  const newPostText = document.getElementById('new-post-text').value
  if (newPostText) {
    const postData = mockroblog.postMessage(window.sessionStorage.getItem('uid'), newPostText)
    document.getElementById('new-post-text').value = ''

    const newPostDiv = document.createElement('div')
    newPostDiv.className = 'p-5 m-5 rounded-lg bg-black'
    newPostDiv.innerHTML += "<div class='flex flex-row text-center items-center justify-between mb-2'>" +
    '<p>' + window.sessionStorage.getItem('username') + '</p></div><hr>'
    newPostDiv.innerHTML += "<div class='post-text m-2'>" + postData.text + '</div>'
    newPostDiv.innerHTML += "<hr><p class='mt-2'>" + postData.timestamp + '</p>'

    document.getElementById('new-post-area').after(newPostDiv)
    newPostArea.classList.toggle('hidden')
  }
}

if (!window.location.pathname.includes('/following.html') && !window.location.pathname.includes('/about.html')) {
  document.getElementById('post-button').onclick = function () { publishPost() }
}
