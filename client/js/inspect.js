/* eslint-disable no-undef */

const formatDisplay = data => {
  if (!data.name) {
    data.name = 'Not provided'
  }
  if (!data.location) {
    data.location = 'Not provided'
  }
  if (!data.email) {
    data.email = 'Not provided'
  }
  if (!data.bio) {
    data.bio = 'Not provided'
  }
  if (!data.titles.length) {
    data.titles.push('None')
  }
  if (data.favorite_language === 'null') {
    data.favorite_language = 'None'
  }
}

$('form').submit(() => {
  const username = $('form input').val()
  console.log(`examining ${username}`)

  // Fetch data for given user
  // (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  fetch(`${USER_URL}/${username}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(data => {
      console.log(`Got data for ${USER_URL}/${username}`)
      formatDisplay(data)

      let info = `<span class="username">${data.username}</span>
        <span class="full-name">${data.name}</span>
        <span class="location">${data.location}</span>
        <span class="email">${data.email}</span>
        <span class="bio">${data.bio}</span>
        <img class="avatar" src="${data.avatar_url}" alt="avatar picture">
        <div class="stats">
            <div class="stat">
                <span class="label">Titles:&nbsp;</span>
                <span class="titles value">${data.titles}</span>
            </div>
            <div class="stat">
                <span class="label">Favorite language:&nbsp;</span>
                <span class="favorite-language value">${data.favorite_language}</span>
            </div>
            <div class="stat">
                <span class="label">Total stars:&nbsp;</span>
                <span class="total-stars value">${data.total_stars}</span>
            </div>
            <div class="stat">
                <span class="label">Highest star count:&nbsp;</span>
                <span class="most-starred value">${data.highest_star_count}</span>
            </div>
            <div class="stat">
                <span class="label">Public repos:&nbsp;</span>
                <span class="public-repos value">${data.public_repos}</span>
            </div>
            <div class="stat">
                <span class="label">'Perfect' Repos:&nbsp;</span>
                <span class="perfect-repos value">${data.perfect_repos}</span>
            </div>
            <div class="stat">
                <span class="label">Followers:&nbsp;</span>
                <span class="followers value">${data.followers}</span>
            </div>
            <div class="stat">
                <span class="label">Following:&nbsp;</span>
                <span class="following value">${data.following}</span>
            </div>
        </div>`

      $('.user-results').removeClass('hide') // Display '.user-results' element
      $('.user-results').html(info)
    })
    .catch(err => {
      console.log(`Error getting data for ${username}`)
      console.log(err)
      $('.user-error').removeClass('hide')
    })

  return false // return false to prevent default form submission
})
