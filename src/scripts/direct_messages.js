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
export async function createDM (new_from_user_id, new_to_user_id, new_in_reply_to_id, new_timestamp, new_text) {
  let url = 'http://localhost:5000/direct_messages'
  
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      from_user_id: new_from_user_id,
      to_user_id: new_to_user_id,
      in_reply_to_id: new_in_reply_to_id,
      timestamp: new_timestamp,
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

async function directMessage () {
  const new_from_user_id = window.sessionStorage
  const new_to_user_id = document.getElementById('to-user').value
  const new_in_reply_to_id = document.getElementById('reply-post-id').value
  const new_timestamp = Date.now()
  const new_text = document.getElementById('message').value
  // const userInfo = mockroblog.createUser(usernameInput, emailInput, passwordInput) // todo
  const userInfo = await helper.createDM(new_from_user_id, new_to_user_id, new_in_reply_to_id, new_timestamp, new_text) // todo
  console.log(userInfo)

}
// Display convo list
// Generate div for each convo
if(window.location.pathname.includes('/direct_messages.html')) {
  if(temp_key_list !== null) {
    const dmPost = document.createElement('div')
    dmPost.className = "tab flex flex-row py-4 px-2 justify-center items-center border-b-2 w-full overflow-hidden bg-gray-200"
    
    // generate the convo list
    for(let i = 0; i < temp_key_list.length; i++) {
      const result = await helper.getUser(temp_key_list[i])
      dmPost.innerHTML += "<button class='tablinks cursor-pointer duration-75 hover:bg-gray-300 active:bg-gray-500 text-lg font-semibold text-black' onclick='openConvo(event, " + temp_key_list[i] + ")'>" + result.username + "</button>"        
      document.getElementById('conv-list-container').append(dmPost)
    }
  }
}

// To do: make this into a function call that takes a convo key as a param
/*
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
*/


export async function generateConvos() {
  if(dm_list !== null) {
    for(let x = 0; x < temp_key_list.length; x++) {
      const dmPost = document.createElement('div')
      dmPost.setAttribute('id',temp_key_list[x]);
      dmPost.className = "tabcontent flex flex-col mt-5"

      // Generates the convos for the specific convo key
      for(let i = 0; i < dm_list.length; i++) {
        const result = await dm_list[i]
        dmPost.innerHTML += "<div class='flex justify-end mb-4'>"
        
        if(dm_list[i].from_user_id === current_user_id && dm_list[i].convo_key === temp_key_list[x]) 
          dmPost.innerHTML += "<div class='mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white'>" + result.text + "</div>"
        else if(dm_list[i].to_user_id === current_user_id && dm_list[i].convo_key === temp_key_list[x])
          dmPost.innerHTML += "<div class='ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white'>" + result.text  + "</div>"
        
        dmPost.innerHTML += "</div>"
  
        document.getElementById('messages').append(dmPost)
      }
    }
  }
}

/*
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
*/

export async function openConvo(evt, convo_key) {
  // Declare all variables
  let tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(convo_key).style.display = "block";
  evt.currentTarget.className += " active";
}

// Generate convos on page
generateConvos()