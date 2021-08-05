// Get user object from an ID
export function getUser (id) {
  const url = 'http://localhost:5000/users'
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const users = data.resources
      for (let i = 0; i < users.length; i++) {
        if (users[i].id == id) {
          return users[i]
        }
      }
    })
}

export function getFollowing (id) {
  const url = 'http://localhost:5000/followers/'
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const users = data.resources
      console.log(users)
      return users
    })
}