// User data might go in this file, since I need each user to have an array of users they are following.
// This array will contain pointers to a database of users.
// Since there is no way to store this data in project 3, I'll have to wait until project 4.
// Keep this file for project 4. I'm not sure if this will be an extended library or a database or both.
// It sounds like we need both.

export function getUsername (userId) {
  switch (userId) {
    case 1: return 'ProfAvery'
    case 2: return 'KevinAWortman'
    case 3: return 'Beth_CSUF'
    case 4 : return'New User'
    default: return 'Unknown'
  }
}
