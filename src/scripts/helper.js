// Returns user object from an ID or username
export async function getUser (key) {
  const url = 'http://localhost:5000/users'
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const users = data.resources
      for (let i = 0; i < users.length; i++) {
        if (users[i].id == key || users[i].username == key) {
          return users[i]
        }
      }
      return null
    })
}

// Returns array of user IDs being followed
export async function getFollowing (id) {
  const url = 'http://localhost:5000/followers/'
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const users = data.resources
      let followingList =[]
      for (let i = 0; i < users.length; i++) {
        if (users[i].follower_id == id) {
          followingList.push(users[i].following_id)
        }
      }
      return followingList
    })
}

// Returns Home Timeline posts as an array
// Help from: https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data
export async function getHomeTimeline (username) {
  const url = 'http://localhost:5000/posts'
  let user = await getUser(username)
  let following = await getFollowing(user.id)
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const timeline = []
      const posts = data.resources
      for (let i = 0; i < posts.length; i++) {
        if (following.includes(posts[i].user_id)) {
          timeline.push(posts[i])
        }
      }
      return timeline
    })
}

// Returns User Timeline posts as an array
export async function getUserTimeline (userId) {
  const url = 'http://localhost:5000/posts'
}

// Returns the number of likes a post has
export async function getLikes(postId){
  const url = 'http://localhost:5000/likes'
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let likes = 0
      const likeList = data.resources
      for (let i = 0; i < likeList.length; i++) {
        if (likeList[i].post_id == postId) {
          likes++
        }
      }
      return likes
    })
}

// Checks if user has liked a post
export async function postLiked(postId, userId){
  const url = 'http://localhost:5000/likes'
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const likeList = data.resources
      for (let i = 0; i < likeList.length; i++) {
        if (likeList[i].post_id == postId && likeList[i].user_id == userId) {
          console.log('returned true!')
          return true
        }
      }
      console.log('returned false!')
      return false
    })
}

// Like a post
export async function likePost(postId, userId){
  const url = 'http://localhost:5000/likes'
  let data = {
    user_id: userId,
    post_id: postId
  }
  
  var request = new Request(url, {
      method: 'POST',
      body: data,
      headers: new Headers()
  });

  return fetch(request)
    .then(function() {
    // Handle response we get from the API

  })
}

// Unlike a post
export async function unlikePost(postId, userId){

}