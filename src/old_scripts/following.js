import * as mockroblog from './mockroblog.js'
import * as mockroblog2 from './extraData.js'
window.mockroblog = mockroblog

let timeline = null
const username = window.sessionStorage.getItem('username')
timeline = mockroblog.getHomeTimeline(username)

let followArr = []
for (let i = 0; i < timeline.length; i++) {
    let temp = mockroblog2.getUsername(timeline[i].user_id)
    let duplicate = false
    for (let j = 0; j < followArr.length; j++)
    {
        if(temp === (followArr[j]))
        {
            duplicate = true
        }
    }
    if (!duplicate)
    {
        followArr.push(temp)
        if (window.location.pathname.includes('/following.html')) {
            let timelinePost = document.createElement('div')
            timelinePost.className = 'p-5 m-5 rounded-lg bg-black'

            timelinePost.innerHTML = "<div class='flex flex-row text-center items-center justify-between'>"
            + mockroblog2.getUsername(timeline[i].user_id)
            + "<button class='" + temp + "-follow-button rounded-lg p-1 bg-indigo-500 "
            + "hover:bg-purple-700 transition duration-300'>Unfollow</button></div>"
    
            document.getElementById("timeline").append(timelinePost)
            let buttonArr = document.getElementsByClassName(temp + "-follow-button") 
            for (let k = 0; k < buttonArr.length; k++) {
                buttonArr[k].addEventListener('click', () => {
                    mockroblog.removeFollower(window.sessionStorage.getItem("uid"), timeline[i].user_id)
                    buttonArr[k].innerHTML = "Follow"
                })
            }
        }
    }
}
window.sessionStorage.setItem("follow-arr", JSON.stringify(followArr))
console.log(followArr)
console.log('i am number 2')