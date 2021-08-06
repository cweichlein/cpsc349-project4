import * as helper from './helper.js'

console.log('following.js called')

let loggedInUser = null
let username = null
if (window.sessionStorage.getItem('user') !== null) {
  loggedInUser = window.sessionStorage.getItem('user')
  loggedInUser = JSON.parse(loggedInUser)
  if (loggedInUser.username !== null) {
    username = loggedInUser.username
  }
}

let timeline = await helper.getHomeTimeline(username)
let followArr = await helper.getFollowing(loggedInUser)

for (let i = 0; i < followArr.length; i++) {
    if (window.location.pathname.includes('/following.html')) {
      let user = await helper.getUser(followArr[i].following_id)
      const timelinePost = document.createElement('div')
      timelinePost.className = 'p-5 m-5 rounded-lg bg-black'

      timelinePost.innerHTML = "<div class='flex flex-row text-center items-center justify-between'>" +
      user.username + "<button class='" + user.username + '-follow-button rounded-lg p-1 bg-indigo-500 ' +
      "hover:bg-purple-700 transition duration-300'>Unfollow</button></div>"

      document.getElementById('timeline').append(timelinePost)
      const buttonArr = document.getElementsByClassName(user.username + '-follow-button')
      for (let k = 0; k < buttonArr.length; k++) {
        buttonArr[k].addEventListener('click', async () => {
          await helper.removeFollower(loggedInUser, user.id)
          buttonArr[k].innerHTML = 'Follow'
      })
    }
  }
}
