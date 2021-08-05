'use strict';

console.log('Inside DM js!!!!')

let dm_list = []
const username = window.sessionStorage.getItem('username')

// Get the list of dms
// First get the sent list
// Help from: https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data
async function getdirectMessagesSent(url) {
  return await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for(let i = 0; i < data.resources.length; i++) {
        dm_list.push(data.resources[i])
      }
    })
}

// Get the received list
async function getdirectMessagesReceived(url) {
  return await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for(let i = 0; i < data.resources.length; i++) {
        dm_list.push(data.resources[i])
      }
    })
}

// Run Functions
getdirectMessagesSent('http://localhost:5000/direct_messages/?from_user_id=1')
getdirectMessagesReceived('http://localhost:5000/direct_messages/?to_user_id=1')

/*
// Sort by timestamp
let sorted_dm_list = dm_list.sort((function (a, b) { 
  return new Date(b.timestamp) - new Date(a.timestamp) 
}));
*/

// Generate div for each blog post
if (!window.location.pathname.includes('/about.html')) {
    if (dm_list !== null) {
        for (let i = 0; i < dm_list.length; i++) {
            // let userId = mockroblog2.getUsername(timeline[i].user_id)   //todo
            const dmPost = document.createElement('div')
            dmPost.className = 'p-5 m-5 rounded-lg bg-black'
            dmPost.innerHTML += "<div class='post-text m-2 break-words'>" + dm_list[i] + '</div>'
    
            document.getElementById('direct-messages').append(dmPost)
        }
    }
}