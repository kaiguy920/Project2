////////////////////
//  Dependencies  //
////////////////////
require("dotenv").config() // make env variables available
const express = require("express")
const axios = require('axios')
const middleware = require('./utils/middleware')
const TeamRouter = require('./controllers/team')
const QueenRouter = require('./controllers/queen')
const UserRouter = require('./controllers/user')
const User = require("./models/user")
// SEE MORE DEPENDENCIES IN ./utils/middleware.js
// user and resource routes linked in ./utils/middleware.js

//////////////////////////////
// Middleware + App Object  //
//////////////////////////////
const app = require("liquid-express-views")(express())

middleware(app)

////////////////////
//    Routes      //
////////////////////

app.use('/auth', UserRouter)
app.use('/team', TeamRouter)
app.use('/queen', QueenRouter)
app.use(express.static("images"))

app.get('/dragball', async (req, res) => {
	let queenData;
	await axios
		.get(`http://www.nokeynoshade.party/api/queens/all`)
		.then(res => {
			queenData = res.data;
			// console.log("===============================QUEEN DATA======================", queenData)
		})
		.catch(error => {
			res.redirect('/error')
		})
	const { username, userId, loggedIn } = req.session
	res.render('index.liquid', { loggedIn, username, userId, queenData })
})

app.get('/dragball/:id', async (req, res) => {
	const id = req.params.id
	let queenData;
	let lipsyncWin = 0
	let miniWin = 0
	let maxiWin = 0
	await axios
		.get(`http://www.nokeynoshade.party/api/queens/${id}`)
		.then(res => {
			queenData = res.data;
			lipsync = res.data.lipsyncs
			challenges = res.data.challenges
			queenData.howMany = lipsync.length;
			// =================================================
			queenData.lipsyncs.map(lipsync => {
				// console.log("lipsync", lipsync);
				if (lipsync.won) {
					lipsyncWin += 1
				}
			})
			queenData.lipsyncWin = lipsyncWin
			// =================================================
			queenData.challenges.map(challenge => {
				// console.log("challenge", challenge);
				if (challenge.type = "mini" && challenge.won) {
					miniWin += 1
				}
			})

			queenData.miniWins = miniWin
			// =================================================
			queenData.challenges.map(challenge => {
				if (challenge.type = "maxi" && challenge.won) {
					maxiWin += 1
				}
			})

			queenData.maxiWins = maxiWin

			// console.log("===============================QUEEN DATA======================", queenData)

		})
		.catch(error => {
			res.redirect('/error')
		})
	const { username, userId, loggedIn } = req.session
	res.render('Queens/show.liquid', { loggedIn, username, userId, queenData })
})

app.get('/error', (req, res) => {
	const error = req.query.error || 'This Page Does Not Exist'
	const { username, loggedIn, userId } = req.session
	res.render('error.liquid', { error, username, loggedIn, userId })
})

// if page is not found, send to error page
app.all('*', (req, res) => {
	res.redirect('/error')
})



//////////////////////////////
//      App Listener        //
//////////////////////////////
app.listen(process.env.PORT, () => {
	console.log(`listening on port ${process.env.PORT}`)
})