import { data } from "autoprefixer"

// GET and POST request help from: https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data
// DELETE request help from: https://dev.to/silvenleaf/fetch-api-easiest-explanation-part-4-4-delete-by-silvenleaf-4376
// Returns user object from an ID or username
export function getUser (key) {
  let url = null
  if(typeof key === 'number'){
    url = 'http://localhost:5000/users/?id=' + key
  }
  else if (typeof key === 'string'){
    url = 'http://localhost:5000/users/?username=' + key
  }
  else if (typeof key === 'object') {
    console.log('Error!')
    console.log(key)
  }

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.resources[0]
    })
}

// Returns an array of user IDs being followed
export function getFollowing (user) {
  const url = 'http://localhost:5000/followers/?follower_id=' + user.id
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.resources
    })
}

// Returns Home Timeline posts as an array
export async function getHomeTimeline (user) {
  let following = await getFollowing(user)
  let timeline = []
  
  for(let i = 0; i < following.length; i++) {
    let followedUser = await getUser(following[i].following_id)
    let followedTimeline = await getUserTimeline(followedUser)

    for(let j = 0; j < followedTimeline.length; j++){
      timeline.push(followedTimeline[j])
    }
  }
  //todo sort by timestamp
  //console.log(timeline)
  return timeline
}

// Returns User Timeline posts as an array
export function getUserTimeline (user) {
  const url = 'http://localhost:5000/posts/?sort=-timestamp&user_id=' + user.id
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.resources
    })
}

export function getPublicTimeline () {
  const url = 'http://localhost:5000/posts/?sort=-timestamp'
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.resources
    })
}

// Returns the number of likes a post has
export function getLikes(postId){
  const url = 'http://localhost:5000/likes/?post_id=' + postId
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return data.resources.length
    })
}

// Checks if user has liked a post
export function postLiked(postId, userId){
  const url = 'http://localhost:5000/likes/?user_id=' + userId + '&post_id=' + postId
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const likeList = data.resources

      if(likeList.length>0){
        return true
      }
      else{
        return false
      }
    })
}

// Like a post
export function likePost(userId, postId){
  const url = 'http://localhost:5000/likes'
  let data = {
    user_id: userId,
    post_id: postId
  }
  let request = new Request(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers()
  });
  console.log('User', userId, 'liked post', postId)
  return fetch(request)
}

export async function getLikedPosts() {
  let url = 'http://localhost:5000/likes/'

  return fetch(url)
  .then(response => response.json())
  .then(data => {
    return data.resources
  })
}

// Unlike a post
export async function unlikePost(userId, postToUnlikeId) {
  let tableId = 0
  let likedPosts = await getLikedPosts()
  console.log(likedPosts)
  for (let i = 0; i < likedPosts.length; i++) {
    console.log(userId, likedPosts[i].user_id, postToUnlikeId, likedPosts[i].post_id)
    if (userId === likedPosts[i].user_id && postToUnlikeId === likedPosts[i].post_id) {
      tableId = likedPosts[i].id
    }
  }
  let url = 'http://localhost:5000/likes/' + tableId
  return fetch(url, {
    method: 'DELETE',
    headers: new Headers()
  })
}

// Login
export async function authenticateUser (username, password) {
  let url = 'http://localhost:5000/users/?username=' + username + '&password=' + password
  return fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data.resources[0])
    return data.resources[0]
  })
  .catch(error => {
    console.log(error)
    return null
  })
}

// Registration
export async function createUser (username, email, password) {
  let url = 'http://localhost:5000/users'
  
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      username: username,
      email: email,
      password: password
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

// New post
export async function postMessage (userId, newPostText) {
  let url = 'http://localhost:5000/posts/'

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      user_id: userId,
      text: newPostText
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

export async function addFollower(userId, userToFollowId)
{
  const url = 'http://localhost:5000/followers/'
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      follower_id: userId,
      following_id: userToFollowId
    }),
    headers: new Headers()
  })
  // .then(response => response.json())
  .then(data => 
    {
      console.log(data)
      return data
    })
  // .catch(error => {
  //   console.log(error)
  //   return null
  // })
}

// Parameters: ID of current user, and ID of following user
export async function removeFollower(user, userToUnfollowId)
{
  let tableId = 0
  const followArr = await getFollowing(user)
  for (let i = 0; i < followArr.length; i++) {
    if (userToUnfollowId === followArr[i].following_id) {
      tableId = followArr[i].id
    }
  }
  const url = 'http://localhost:5000/followers/' + tableId
  return fetch(url, {
    method: 'DELETE',
    headers: new Headers()
  })
  // .then(response => response.json())
  .then(data => 
    {
      console.log(data)
      return data
    })
  // .catch(error => {
  //   console.log(error)
  //   return null
  // })
}