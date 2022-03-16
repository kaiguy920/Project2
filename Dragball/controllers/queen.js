// Import Dependencies
const express = require('express')
const mongoose = require('mongoose')
const Team = require('../models/team')

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

// Routes

// index ALL
router.get('/', (req, res) => {
    Team.find({})
        .then(team => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn

            res.render('team/index', { team, username, loggedIn })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// index that shows only the user's examples
router.get('/fave', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
    Team.find({ owner: userId })
        .then(team => {
            res.render('Queens/index', { team, username, loggedIn })
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
    const { username, userId, loggedIn } = req.session
    res.render('team/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
    req.body.ready = req.body.ready === 'on' ? true : false

    req.body.owner = req.session.userId
    Example.create(req.body)
        .then(example => {
            console.log('this was returned from create', example)
            res.redirect('/team')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
    // we need to get the id
    const exampleId = req.params.id
    Example.findById(exampleId)
        .then(example => {
            res.render('team/edit', { example })
        })
        .catch((error) => {
            res.redirect(`/error?error=${error}`)
        })
})

// update route
router.put('/:id', (req, res) => {
    const exampleId = req.params.id
    req.body.ready = req.body.ready === 'on' ? true : false

    Example.findByIdAndUpdate(exampleId, req.body, { new: true })
        .then(example => {
            res.redirect(`/team/${example.id}`)
        })
        .catch((error) => {
            res.redirect(`/error?error=${error}`)
        })
})

// // show route from API
// router.get('/:id', async (req, res) => {
// 	const id = req.params.id
// 	let queenData;
// 	await axios
// 		.get(`http://www.nokeynoshade.party/api/queens/${id}`)
// 		.then(res => {
// 			queenData = res.data;
// 			console.log("===============================QUEEN DATA======================", queenData)
// 		})
// 		.catch(error => {
// 			res.redirect('/error')
// 		})
// 	const { username, userId, loggedIn } = req.session
// 	res.render('Queens/show.liquid', { loggedIn, username, userId, queenData })
// })


// // show route from database
// router.get('/:id', (req, res) => {
// 	const exampleId = req.params.id
// 	Example.findById(exampleId)
// 		.then(example => {
//             const {username, loggedIn, userId} = req.session
// 			res.render('team/show', { example, username, loggedIn, userId })
// 		})
// 		.catch((error) => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// delete route
router.delete('/:id', (req, res) => {
    const exampleId = req.params.id
    Example.findByIdAndRemove(exampleId)
        .then(example => {
            res.redirect('/team')
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// Export the Router
module.exports = router