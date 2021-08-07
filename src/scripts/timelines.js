import * as helper from './helper.js'

console.log('timeline.js called')

// Instantiate login session info and determine what type of content to display

let timeline = null
let loggedInUser = null
let username = null
if (window.sessionStorage.getItem('user') !== null) {
  loggedInUser = window.sessionStorage.getItem('user')
  loggedInUser = JSON.parse(loggedInUser)
  if (loggedInUser.username !== null) {
    username = loggedInUser.username
  }
  
  // timeline = await getTimeline()
  // if (document.getElementById('home_tl') === document.querySelector('.active')) {
  //   timeline = await helper.getHomeTimeline(loggedInUser)
  // } else if (document.getElementById('user_tl') === document.querySelector('.active')) {
  //   timeline = await helper.getUserTimeline(loggedInUser)
  // } else if (document.getElementById('public_tl') === document.querySelector('.active')) {
  //   timeline = await helper.getPublicTimeline()   //todo
  // }
}

async function getTimeline() {
  let timeline = null
  if (document.getElementById('home_tl') === document.querySelector('.active')) {
    timeline = await helper.getHomeTimeline(loggedInUser)
  } else if (document.getElementById('user_tl') === document.querySelector('.active')) {
    timeline = await helper.getUserTimeline(loggedInUser)
  } else if (document.getElementById('public_tl') === document.querySelector('.active')) {
    timeline = await helper.getPublicTimeline()   //todo
  }
  return timeline
}

// Logged in as {username} on navbar

const loginStatus = document.getElementsByClassName('login-status')

for (let i = 0; i < loginStatus.length; i++) {
  if (loggedInUser !== null) {
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
async function generatePostDivs() {
  if (!window.location.pathname.includes('/about.html')) {
    timeline = await getTimeline()
    console.log(timeline)
    if (timeline !== null) {
      document.getElementById('timeline').innerHTML = ''
      for (let i = 0; i < timeline.length; i++) {
        let postUser = await helper.getUser(timeline[i].user_id)
        let postUsername = postUser.username
        let postId = timeline[i].id
        
        // Generate follow/unfollow button
        let found = false
        let followOrUnfollowButton = ''
        let followArr = await helper.getFollowing(loggedInUser)
        if (postUsername !== loggedInUser.username) {
          for (let j = 0; j < followArr.length; j++) {
            if (postUser.id === followArr[j].following_id) {
              found = true
              followOrUnfollowButton = "<button id='" + postUser.id + "-" + postId + "-unfollow-button' class='"
              + "rounded-lg p-1 bg-indigo-500 hover:bg-purple-700 transition duration-300'>Unfollow</button>"
            }
          }
          if (!found) {
            followOrUnfollowButton = "<button id='" + postUser.id + "-" + postId + "-follow-button' class='"
            + "rounded-lg p-1 bg-indigo-500 hover:bg-purple-700 transition duration-300'>Follow</button>"
          }
        }
        
        // Generate like/unlike button
        let likeOrUnlikeButton = null
        if (await helper.postLiked(postId, loggedInUser.id)) {
          likeOrUnlikeButton = "<button id=" + postId + "-unlike-button class='flex items-center rounded-lg p-1 bg-red-600 hover:bg-red-700 "
          + "transition duration-300'>" + "&#128077; " + await helper.getLikes(postId) + "</button>"
        } else { 
          likeOrUnlikeButton = "<button id=" + postId + "-like-button class='flex items-center rounded-lg p-1 bg-green-600 hover:bg-green-700 "
          + "transition duration-300'>" + "&#128077; " + await helper.getLikes(postId) + "</button>"
        }
        
        const timelinePost = document.createElement('div')
        timelinePost.className = "p-5 m-5 rounded-lg bg-black"
        timelinePost.innerHTML += "<div class='flex flex-row text-center items-center justify-between mb-2'>" +
        "<p>" + postUsername + "</p>" + followOrUnfollowButton + "</div><hr>"
        timelinePost.innerHTML += "<div class='post-text m-2 break-words'>" + timeline[i].text + "</div>"
        timelinePost.innerHTML += "<hr><div class='flex items-center text-center mt-2 justify-between'><p>"
        + timeline[i].timestamp + "</p>" + likeOrUnlikeButton + "</div>"
        
        document.getElementById('timeline').append(timelinePost)
      }
    }
  }
}
  
// New post dropdown menu
  
if (window.location.pathname.includes('public_timeline') || window.location.pathname.includes('user_timeline')) {
  const newPostBtn = document.getElementById('new-post-button')
  const newPostArea = document.getElementById('new-post-area')

  newPostBtn.addEventListener('click', () => {
    newPostArea.classList.toggle('hidden')
  })
}

// Post button functionality

async function publishPost () {
  let newPostText = document.getElementById('new-post-text').value
  if (newPostText) {
    console.log(loggedInUser.id, newPostText)
    let postData = await helper.postMessage(loggedInUser.id, newPostText)
    console.log(postData)
    document.getElementById('new-post-text').value = ''

    let likeOrUnlikeButton = null
      if (await helper.postLiked(postData.id, loggedInUser.id)) {
        likeOrUnlikeButton = "<div class='flex items-center'><button class='" + postData.id + "-like-button rounded-lg p-1 bg-red-600 hover:bg-red-700 "
        + "transition duration-300'>" + "&#128077; " + await helper.getLikes(postData.id) + "</button>" 
      } else { 
        likeOrUnlikeButton = "<div class='flex items-center'><button class='" + postData.id + "-unlike-button rounded-lg p-1 bg-green-600 hover:bg-green-700 "
        + "transition duration-300'>" + "&#128077; " + await helper.getLikes(postData.id) + "</button>" 
      }

    // const newPostDiv = document.createElement('div')
    // newPostDiv.className = 'p-5 m-5 rounded-lg bg-black'
    // newPostDiv.innerHTML += "<div class='flex flex-row text-center items-center justify-between mb-2'>" +
    // '<p>' + username + '</p></div><hr>'
    // newPostDiv.innerHTML += "<div class='post-text m-2'>" + postData.text + '</div>'
    // newPostDiv.innerHTML += "<hr><div class='flex items-center text-center mt-2 justify-between'><p>"
    //   + postData.timestamp + "</p>" + likeOrUnlikeButton + "<div>"

    // document.getElementById('new-post-area').after(newPostDiv)
    document.getElementById('new-post-area').classList.toggle('hidden')
  }
}

if (window.location.pathname.includes('public_timeline') || window.location.pathname.includes('user_timeline')) {
  document.getElementById('post-button').onclick = async function () {
    await publishPost()
    generateAllPosts()
  }
}

// Like/unlike and follow/unfollow button functionality
if (window.location.pathname.includes('timeline')) {
  await generateAllPosts()
}

async function generateAllPosts() {
  await generatePostDivs()
  for (let i = 0; i < timeline.length; i++) {
    likeOrUnlikeClick(i)
    followOrUnfollowClick(i)
  }
}

async function likeOrUnlikeClick (i) {
  let postId = timeline[i].id
  if (document.getElementById(postId +'-like-button') != null) {
    let likeButton = document.getElementById(postId +'-like-button')
    likeButton.onclick = async function () {
      await helper.likePost(loggedInUser.id, postId)
      likeButton.outerHTML = "<button id=" + timeline[i].id + "-unlike-button class='flex items-center rounded-lg p-1 bg-red-600 hover:bg-red-700 "
      + "transition duration-300'>" + "&#128077; " + await helper.getLikes(timeline[i].id) + "</button>"
      likeOrUnlikeClick(i)
    }
  } else {
    let unlikeButton = document.getElementById(postId +'-unlike-button')
    unlikeButton.onclick = async function () {
      await helper.unlikePost(loggedInUser.id, postId)
      unlikeButton.outerHTML = "<button id=" + timeline[i].id + "-like-button class='flex items-center rounded-lg p-1 bg-green-600 hover:bg-green-700 "
      + "transition duration-300'>" + "&#128077; " + await helper.getLikes(timeline[i].id) + "</button>"
      likeOrUnlikeClick(i)
    }
  }
}

async function followOrUnfollowClick(i) {
  let postUser = await helper.getUser(timeline[i].user_id)
  let postId = timeline[i].id
  if (postUser.username !== loggedInUser.username) {
    if (document.getElementById(postUser.id + '-' + postId + '-follow-button') != null) {
      let followButton = document.getElementById(postUser.id + '-' + postId + '-follow-button')
      followButton.onclick = async function () {
        await helper.addFollower(loggedInUser.id, postUser.id)
        followButton.outerHTML = "<button id='" + postUser.id + "-" + postId + "-unfollow-button' class='"
        + "rounded-lg p-1 bg-indigo-500 hover:bg-purple-700 transition duration-300'>Unfollow</button>"
        followOrUnfollowClick(i)
      }
    } else {
      let unfollowButton = document.getElementById(postUser.id + '-' + postId + '-unfollow-button')
      unfollowButton.onclick = async function () {
        await helper.removeFollower(loggedInUser, postUser.id)
        unfollowButton.outerHTML = "<button id='" + postUser.id + "-" + postId + "-follow-button' class='"
        + "rounded-lg p-1 bg-indigo-500 hover:bg-purple-700 transition duration-300'>Follow</button>"
        followOrUnfollowClick(i)
      }
    }
  }
}