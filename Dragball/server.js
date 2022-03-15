////////////////////
//  Dependencies  //
////////////////////
require("dotenv").config() // make env variables available
const express = require("express")
const axios = require('axios')
const middleware = require('./utils/middleware')
const ExampleRouter = require('./controllers/example')
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
app.use('/examples', ExampleRouter)

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
	let miniWin = 0
	await axios
		.get(`http://www.nokeynoshade.party/api/queens/${id}`)
		.then(res => {
			queenData = res.data;
			lipsync = res.data.lipsyncs
			challenges = res.data.challenges

			queenData.howMany = lipsync.length;
			queenData.lipsyncWins = lipsync.won

			if (queenData.challenges.type = "mini" && queenData.challenges.won) {
				miniWin += 1
			}

			queenData.miniWins = miniWin

			// console.log("********mini wins********", miniWin);

			console.log(queenData.challenges[0].type)

			// queenData.battingAverage = ''
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