

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
  const usernameLeft = $('#userLeft').val()
  const usernameRight = $('#userRight').val()
  console.log(`examining ${usernameLeft} and ${usernameRight}`)

  // Fetch data for given user
  // (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
  fetch(`${USER_URL}?username=${usernameLeft}&username=${usernameRight}`)
    .then(response => response.json()) // Returns parsed json data from response body as promise
    .then(data => {
      console.log(`Got data for ${usernameLeft} and ${usernameRight}`)
      console.log(data)
      formatDisplay(data[0])
      formatDisplay(data[1])

      let infoLeft = `<span class="username">${data[0].username}</span>
        <span class="full-name">${data[0].name}</span>
        <span class="location">${data[0].location}</span>
        <span class="email">${data[0].email}</span>
        <span class="bio">${data[0].bio}</span>
        <img class="avatar" src="${data[0].avatar_url}" alt="avatar picture">
        <div class="stats">
            <div class="stat">
                <span class="label">Titles:&nbsp;</span>
                <span class="titles value">${data[0].titles}</span>
            </div>
            <div class="stat">
                <span class="label">Favorite language:&nbsp;</span>
                <span class="favorite-language value">${data[0].favorite_language}</span>
            </div>
            <div class="stat">
                <span class="label">Total stars:&nbsp;</span>
                <span class="total-stars value">${data[0].total_stars}</span>
            </div>
            <div class="stat">
                <span class="label">Highest star count:&nbsp;</span>
                <span class="most-starred value">${data[0].highest_star_count}</span>
            </div>
            <div class="stat">
                <span class="label">Public repos:&nbsp;</span>
                <span class="public-repos value">${data[0].public_repos}</span>
            </div>
            <div class="stat">
                <span class="label">'Perfect' Repos:&nbsp;</span>
                <span class="perfect-repos value">${data[0].perfect_repos}</span>
            </div>
            <div class="stat">
                <span class="label">Followers:&nbsp;</span>
                <span class="followers value">${data[0].followers}</span>
            </div>
            <div class="stat">
                <span class="label">Following:&nbsp;</span>
                <span class="following value">${data[0].following}</span>
            </div>
        </div>`

      let infoRight = `<span class="username">${data[1].username}</span>
        <span class="full-name">${data[1].name}</span>
        <span class="location">${data[1].location}</span>
        <span class="email">${data[1].email}</span>
        <span class="bio">${data[1].bio}</span>
        <img class="avatar" src="${data[1].avatar_url}" alt="avatar picture">
        <div class="stats">
            <div class="stat">
                <span class="label">Titles:&nbsp;</span>
                <span class="titles value">${data[1].titles}</span>
            </div>
            <div class="stat">
                <span class="label">Favorite language:&nbsp;</span>
                <span class="favorite-language value">${data[1].favorite_language}</span>
            </div>
            <div class="stat">
                <span class="label">Total stars:&nbsp;</span>
                <span class="total-stars value">${data[1].total_stars}</span>
            </div>
            <div class="stat">
                <span class="label">Highest star count:&nbsp;</span>
                <span class="most-starred value">${data[1].highest_star_count}</span>
            </div>
            <div class="stat">
                <span class="label">Public repos:&nbsp;</span>
                <span class="public-repos value">${data[1].public_repos}</span>
            </div>
            <div class="stat">
                <span class="label">'Perfect' Repos:&nbsp;</span>
                <span class="perfect-repos value">${data[1].perfect_repos}</span>
            </div>
            <div class="stat">
                <span class="label">Followers:&nbsp;</span>
                <span class="followers value">${data[1].followers}</span>
            </div>
            <div class="stat">
                <span class="label">Following:&nbsp;</span>
                <span class="following value">${data[1].following}</span>
            </div>
        </div>`

      $('.duel-container').removeClass('hide') // Display '.user-results' element
      $('#userResultsLeft').html(infoLeft)
      $('#userResultsRight').html(infoRight)

      const getScore = titles => {
        let score = 0
        if (titles.includes(' Forker')) {
          score += 2
        }
        if (titles.includes(' One-Trick Pony')) {
          score -= 2
        }
        if (titles.includes(' Jack of All Trades')) {
          score += 3
        }
        if (titles.includes(' Stalker')) {
          score -= 1
        }
        if (titles.includes(' Mr. Popular')) {
          score += 5
        }
        if (titles.includes(' Tweeter')) {
          score += 1
        }
        return score
      }

      const getWinner = (left, right) => {
        let leftScore = getScore(left.titles)
        let rightScore = getScore(right.titles)
        console.log('SCORE COMPARISON:')
        console.log('Titles: ' + leftScore + ' vs. ' + rightScore)
        console.log(
          'Total Stars: ' + left.total_stars + ' vs. ' + right.total_stars
        )
        console.log(
          'Perfect Repos: ' + left.perfect_repos + ' vs. ' + right.perfect_repos
        )
        console.log('Followers: ' + left.followers + ' vs. ' + right.followers)
        leftScore +=
          parseInt(left.total_stars) +
          parseInt(left.perfect_repos) +
          parseInt(left.followers)
        rightScore +=
          parseInt(right.total_stars) +
          parseInt(right.perfect_repos) +
          parseInt(right.followers)
        console.log('TOTALS: ' + leftScore + ' vs. ' + rightScore)

        return leftScore > rightScore ? left : right
      }

      let winner =
        getWinner(data[0], data[1]) === data[0]
          ? `${usernameLeft} WINS !!!!! \n (Check console for details)`
          : `${usernameRight} WINS !!!! \n (Check console for details)`
      $('.winner-container').html(winner)
    })
    .catch(err => {
      console.log(`Error getting data for ${usernameLeft} and ${usernameRight}`)
      console.log(err)
      $('.duel-error').removeClass('hide')
    })

  return false // return false to prevent default form submission
})
