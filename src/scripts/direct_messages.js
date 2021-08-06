'use strict';

import * as helper from './helper.js'

let dm_list = []

//const username = window.sessionStorage.getItem('username')
const username = 'ProvAvery';
//const user_id = await helper.getUser(1)
const current_user_id = 1

// Get the list of dms
// First get the sent list
// Help from: https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data
export async function getdirectMessagesSent(url) {
  return await fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for(let i = 0; i < data.resources.length; i++) {
        console.log(data.resources[i])
        let key = data.resources[i].to_user_id
        data.resources[i].convo_key = key
        dm_list.push(data.resources[i])
      }
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
}


// Run Functions finish the dm list promises
let url_sent = 'http://localhost:5000/direct_messages/?from_user_id=' + current_user_id
let url_from = 'http://localhost:5000/direct_messages/?to_user_id=' + current_user_id
await Promise.all([getdirectMessagesSent(url_sent), getdirectMessagesReceived(url_from)])

// To do: Add a function to sort by timestamp

// Grab all the keys
let temp_key_list = []
for(let i = 0; i < dm_list.length; i++) {
  let key = dm_list[i].convo_key
  if(!(temp_key_list.includes(key)))
    temp_key_list.push(key)
}



// To do: Post direct message 

// Display convo list
// Generate div for each blog post
if(window.location.pathname.includes('/direct_messages.html')) {
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
}

// To do: make this into a function call that takes a convo key as a param
// Display messages
if(window.location.pathname.includes('/direct_messages.html')) {
  if(dm_list !== null) {
    const dmPost = document.createElement('div')
    dmPost.className = "flex flex-col mt-5"
    for(let i = 0; i < dm_list.length; i++) {
      const result = await dm_list[i]
      dmPost.innerHTML += "<div class='flex justify-end mb-4'>"
      
      if(dm_list[i].from_user_id === current_user_id) 
        dmPost.innerHTML += "<div class='mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white'>" + result.text + "</div>"
      else 
        dmPost.innerHTML += "<div class='ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white'>" + result.text  + "</div>"
      
      dmPost.innerHTML += "</div>"

      document.getElementById('messages').append(dmPost)
    }
  }
}

