'use strict';

import * as helper from './helper.js'

let dm_list = []
//const username = window.sessionStorage.getItem('username')
//const username = 'ProvAvery';
//const user_id = await helper.getUser(1)
//const current_user_id = 1

let loggedInUser = window.sessionStorage.getItem('user')
loggedInUser = JSON.parse(loggedInUser)
const username = loggedInUser.username
const current_user_id = loggedInUser.id

// Get the list of dms
// First get the sent list
// Help from: https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data
export async function getdirectMessagesSent(url) {
  return await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for(let i = 0; i < data.resources.length; i++) {
        let key = data.resources[i].to_user_id
        data.resources[i].convo_key = key
        dm_list.push(data.resources[i])
      }
    })
    .catch(error => {
      console.log(error)
      return null
    })
}

// Get the received list
export async function getdirectMessagesReceived(url) {
  return await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for(let i = 0; i < data.resources.length; i++) {
        let key = data.resources[i].from_user_id
        data.resources[i].convo_key = key
        dm_list.push(data.resources[i])
      }
    })
    .catch(error => {
      console.log(error)
      return null
    })
}

// Run Functions finish the dm list promises
let url_sent = 'http://localhost:5000/direct_messages/?from_user_id=' + current_user_id
let url_from = 'http://localhost:5000/direct_messages/?to_user_id=' + current_user_id
await Promise.all([getdirectMessagesSent(url_sent), getdirectMessagesReceived(url_from)])

// Add a function to sort by timestamp
dm_list.sort((function (a, b) { 
  return new Date(a.timestamp) - new Date(b.timestamp)
}));

// Grab all the keys
let temp_key_list = []
for(let i = 0; i < dm_list.length; i++) {
  let key = dm_list[i].convo_key
  if(!(temp_key_list.includes(key)))
    temp_key_list.push(key)
}

// To do: Post direct message 
// Registration
export async function createDM (new_from_user_id, new_to_user_id, new_in_reply_to_id, new_text) {
  let url = 'http://localhost:5000/direct_messages'
  
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      from_user_id: new_from_user_id,
      to_user_id: new_to_user_id,
      in_reply_to_id: new_in_reply_to_id,
      text: new_text
    }),
    headers: new Headers()
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(data)
    return data
  })
  .catch(error => {
    console.log(error)
    return null
  })
}
createDM(1,3,2,'lol')
createDM(3,1,3,'???')

async function directMessage () {
  const new_from_user_id = window.sessionStorage
  const new_to_user_id = document.getElementById('to-user').value
  const new_in_reply_to_id = document.getElementById('reply-post-id').value
  const new_text = document.getElementById('message').value
  // const userInfo = mockroblog.createUser(usernameInput, emailInput, passwordInput) // todo
  const userInfo = await helper.createDM(new_from_user_id, new_to_user_id, new_in_reply_to_id, new_text) // todo
  console.log(userInfo)

}

// Display convo list
if(temp_key_list !== null) {
  for(let i = 0; i < temp_key_list.length; i++) {
    const result = await helper.getUser(temp_key_list[i])
    const dmPost = document.createElement('div')
    dmPost.className = "flex flex-row py-4 px-2 justify-center items-center border-b-2"

    dmPost.innerHTML += "<div class='w-full'>"
    dmPost.innerHTML += "<div class='text-lg font-semibold text-black'>" + result.username + "</div>"
    dmPost.innerHTML += "</div>"
      
      document.getElementById('conv-list-container').append(dmPost)
  }
}

// Create divs for each message and display them on the page
export async function displayMessages(convo_key) {
  if(dm_list !== null) {
    const dmPost = document.createElement('div')
    dmPost.className = "flex flex-col mt-5"
    for(let i = 0; i < dm_list.length; i++) {
      const result = await dm_list[i]
      dmPost.innerHTML += "<div class='flex justify-end mb-4'>"
      
      if(dm_list[i].from_user_id === current_user_id && dm_list[i].convo_key === convo_key) 
        dmPost.innerHTML += "<div class='mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white'>" + result.text + "</div>"
      else if(dm_list[i].to_user_id === current_user_id && dm_list[i].convo_key === convo_key)
        dmPost.innerHTML += "<div class='ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white'>" + result.text  + "</div>"
      
      dmPost.innerHTML += "</div>"

      document.getElementById('messages').append(dmPost)
    }
  }
}
displayMessages(3)