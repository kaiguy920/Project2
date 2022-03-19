// Import Dependencies
const express = require('express')
const mongoose = require('mongoose')
const Team = require('../models/team')
const Queen = require('../models/queen')
// const teamNameInput = document.getElementById('teamNameInput')

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



router.post('/:queenId', (req, res) => {
	// destructure user info from req.session
	// push id of queen into the team member array
	// Team.push(queenId)
	// Team.save()
	// set team to a variable?
	const { username, userId, loggedIn } = req.session
	const queenId = req.params.queenId

	req.body.owner = req.session.userId
	// console.log("*********req.params.queenId*************", queenId);


	// console.log("+++++++++req.body+++++++++++++++++\n", req.body)
	Team.updateOne({ owner: userId }, { $addToSet: { teamMembers: queenId } }, function (err, team) {
		console.log('teammmm', team)
		res.redirect('/team/mine')
	});
	// Team.find({ owner: userId })
	// 	// .populate('teamMembers')
	// 	.then((team) => {
	// 		// this is making an array of arrays
	// 		// console.log('TEAMMMMMMMMMMMMMM', team[0].user);
	// 		// if (team[0].teamMembers.length <= 6) {
	// 		team[0].teamMembers.push(queenId)
	// 		team[0].save()
	// 		// res.redirect('/dragball')
	// 		res.redirect('/team/mine')
	// 		// 	} else {
	// 		// 		res.render('Queens/tooMany')
	// 		// 	}
	// 		// })

	// 	})
})


//  SHOW route to display the teams selected as favorites
router.get('/mine', (req, res) => {
	const { username, userId, loggedIn } = req.session
	Team.find({ owner: userId })
		.populate('teamMembers')
		.populate('owner')
		.then(team => {
			console.log("here::: ", team[0].teamMembers)
			// console.log("she's a super team\n", team)
			res.render('Queens/team', { team: team[0], username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})

})

// PUT route to add teamName to Team object
router.put('/mine/name', (req, res) => {
	// get the id
	const teamNameId = req.body.id
	// const teamNameInput = document.getElementById('teamNameInput')
	console.log("*****The body.id********", req.body.id);
	console.log("*****The body********", req.body.name);

	Team.findByIdAndUpdate(teamNameId, { teamName: req.body.name },
		function (err, team) {
			if (err) {
				console.log(err)
			}
			else {
				console.log('team', team)
				res.redirect('/team/mine')
			}
		})
})



// DELETE route
router.delete('/mine/:id', (req, res) => {
	// get the team id
	const teamId = req.body.teamId
	const queenId = req.params.id
	console.log("*_*_*_*_*_*_*req.body.id*_*_*_*_*_*_*_*", teamId);
	console.log("*_*_*_*_*_*_*queenID*_*_*_*_*_*_*_*", queenId);

	Team.updateOne({ _id: teamId }, { $pull: { teamMembers: queenId } }, function (err, team) {
		console.log('teammmm', team)
		res.redirect('/team/mine')
	});
})


// Export the Router
module.exports = router