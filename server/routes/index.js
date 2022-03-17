import { Router } from 'express'
import axios from 'axios'
import validate from 'express-validation'
import token from '../../token'

import validation from './validation'

export default () => {
  let router = Router()

  router.get('/health-check', (req, res) => res.send('OK'))

  router.get('/rate', (req, res) => {
    axios
      .get(`http://api.github.com/rate_limit`, {
        headers: {
          Authorization: token
        }
      })
      .then(({ data }) => res.json(data))
  })

  const getFavoriteLang = repos => {
    let langObj = {}
    for (let repo of repos) {
      if (langObj.hasOwnProperty(repo.language)) {
        langObj[repo.language]++
      } else {
        langObj[repo.language] = 1
      }
    }
    const favorite = Object.keys(langObj).reduce((a, b) =>
      langObj[a] > langObj[b] ? a : b
    )
    return favorite
  }

  const getStarCount = repos =>
    repos.reduce((acc, cur) => (acc += cur.stargazers_count), 0)

  const getHighStar = repos => {
    let starCount = []
    for (let repo of repos) {
      starCount.push(repo.stargazers_count)
    }
    return Math.max.apply(null, starCount)
  }

  const getPerfectCount = repos =>
    repos.filter(repo => repo.open_issues === 0).length

  const getTitles = (user, repos) => {
    let titles = []
    if (forker(repos)) {
      titles.push(' Forker')
    }
    if (oneTrickPony(repos)) {
      titles.push(' One-Trick Pony')
    }
    if (jackOfAllTrades(repos)) {
      titles.push(' Jack of All Trades')
    }
    if (stalker(user)) {
      titles.push(' Stalker')
    }
    if (popular(user)) {
      titles.push(' Mr. Popular')
    }
    if (tweeter(user)) {
      titles.push(' Tweeter')
    }
    return titles
  }

  const forker = repos => {
    const forks = repos.filter(repo => repo.fork).length
    const totalReposCount = repos.length
    if (totalReposCount / forks > 2) {
      return false
    } else {
      return true
    }
  }

  const oneTrickPony = repos => {
    let language = repos[0].language
    for (let repo of repos) {
      if (repo.language !== language) {
        return false
      }
    }
    return true
  }

  const jackOfAllTrades = repos => {
    let counts = {}
    for (let repo of repos) {
      if (counts.hasOwnProperty(repo.language)) {
        counts[repo.language]++
      } else {
        counts[repo.language] = 1
      }
    }
    if (counts.length > 10) {
      return true
    }
    return false
  }

  const stalker = user => {
    if (user.following / user.followers >= 2) {
      return true
    }
    return false
  }

  const popular = user => {
    if (user.followers / user.following >= 2) {
      return true
    }
    return false
  }

  const tweeter = user => {
    if (user.twitter_username) {
      return true
    }
    return false
  }

  const assignData = (user, repos) => {
    const newObj = {
      username: user.login,
      name: user.name,
      location: user.location,
      email: user.email,
      bio: user.bio,
      avatar_url: user.avatar_url,
      titles: getTitles(user, repos),
      favorite_language: getFavoriteLang(repos),
      total_stars: getStarCount(repos),
      highest_star_count: getHighStar(repos),
      public_repos: user.public_repos,
      perfect_repos: getPerfectCount(repos),
      followers: user.followers,
      following: user.following
    }
    return newObj
  }

  const getInfoArray = username => {
    let infoArray = []
    let user = getUserInfo(username)
    let repos = getUserRepos(username)
    infoArray.push(user)
    infoArray.push(repos)
    return infoArray
  }

  const getUserInfo = username => {
    return axios
      .get(`http://api.github.com/users/${username}`, {
        headers: {
          Authorization: token
        }
      })
      .then(({ data }) => data)
  }

  const getUserRepos = username => {
    return axios
      .get(`http://api.github.com/users/${username}/repos`, {
        headers: {
          Authorization: token
        }
      })
      .then(({ data }) => data)
  }

  /** GET /api/user/:username - Get user */
  router.get('/user/:username', validate(validation.user), (req, res) => {
    console.log(req.params)
    const username = req.params['username']
    Promise.all([getUserInfo(username), getUserRepos(username)])
      .then(([userInfo, userRepos]) => {
        res.json(assignData(userInfo, userRepos))
      })
      .catch(err => {
        res.send(err)
      })
  })

  /** GET /api/users? - Get users */
  router.get('/users?', validate(validation.users), (req, res) => {
    console.log(req.query)
    const usernames = req.query['username']
    Promise.all([
      getUserInfo(usernames[0]),
      getUserRepos(usernames[0]),
      getUserInfo(usernames[1]),
      getUserRepos(usernames[1])
    ])
      .then(([data1, data2, data3, data4]) => {
        let dataArray = [assignData(data1, data2), assignData(data3, data4)]
        return dataArray
      })
      .then(dataArray => res.json(dataArray))
      .catch(err => {
        res.send(err)
      })
  })

  return router
}
