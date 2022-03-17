// Import Dependencies
const express = require('express')
const mongoose = require('mongoose')
const Team = require('../models/team')
const Queen = require('../models/queen')
const TeamName = require('../models/teamName')

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

// =====================================================================
//                              ROUTES
// =====================================================================

// JSON route to get direct look at all the objects in Team
router.get("/json", (req, res) => {
	Team.deleteMany({})
		.then(team => {
			res.send({ team })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})



router.post('/:queenId', async (req, res) => {
	// destructure user info from req.session
	// push id of queen into the team member array
	// Team.push(queenId)
	// Team.save()
	// set team to a variable?
	let teamList;
	const { username, userId, loggedIn } = req.session
	const queenId = req.params.queenId

	req.body.owner = req.session.userId
	// console.log("*********req.params.queenId*************", queenId);
	console.log("+++++++++req.body+++++++++++++++++\n", req.body)

	await Team.find({ owner: userId })
		.populate(Team.teamMembers)
		.then((team) => {
			// this is making an array of arrays
			// console.log('TEAMMMMMMMMMMMMMM', team);
			team.push(queenId)
			teamList = team

		})

	// find team by id that corresponds to user
	req.body.teamMembers = teamList

	Team.create(req.body)
		.then((team) => {
			// console.log('this was returned from adding to team\n', team)
			res.redirect(`/dragball`)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})


//  SHOW route to display the teams selected as favorites
router.get('/mine', (req, res) => {
	const { username, userId, loggedIn } = req.session
	Team.find({ owner: userId })
		.then(team => {
			console.log("here::: ", team)
			// console.log("she's a super team\n", team)
			res.render('Queens/team', { team, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})

})

// DELETE route
router.delete('/mine/:id', (req, res) => {
	// get the team id
	const teamId = req.params.id
	console.log("req.params.id", req.params.id);
	// delete the team
	Team.findByIdAndRemove(teamId)
		.then((team) => {
			// console.log('this is the response from FBID', team)
			res.redirect('/team/mine')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

router.post('/mine/name', (req, res) => {
	TeamName.create(req.body)
		.then((teamName) => {
			console.log('this was returned from adding to teamname\n', teamName)
			res.redirect(`/queen/fave/mine`)
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// teamName input 
// function changeTeamName() {
// 	const teamInput = document.getElementById("teamName")
// 	document.getElementById("teamNameDisplay").innerHTML = teamInput.value;
// }

// document.getElementById('submit').addEventListener("click", (changeTeamName))

// Export the Router
module.exports = router
