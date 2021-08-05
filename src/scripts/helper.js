// Returns user object from an ID or username
export function getUser (key) {
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
export function getFollowing (id) {
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
  let url = 'http://localhost:5000/posts'
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