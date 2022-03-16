// Import Dependencies
const express = require('express')
const mongoose = require('mongoose')
const Team = require('../models/team')
const Queen = require('../models/queen')

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
// index to populate queen data to local database
router.post('/fave', (req, res) => {
    // destructure user info from req.session
    // console.log("*********body odyyy*************", req.body);
    req.body.owner = req.session.userId
    Queen.create(req.body)
        .then((queen) => {
            console.log('this was returned from adding to fave\n', queen)
            res.redirect(`/dragball`)
        })
        .catch(error => {
            res.redirect(`/error?error=${error}`)
        })
})

// JSON route to get direct look at all the objects in Queen
router.get("/json", (req, res) => {
    Queen.find({})
        .then(queen => {
            res.send({ queen })
        })
        .catch(error => res.json(error))
})


router.get('/fave/mine', (req, res) => {
    Queen.find({})
        .then(queen => {
            console.log("she's a super queen\n", queen)
            res.render('Queens/fave', { queen })
        })
        .catch(error => res.json(error))

    // we need to get the id
    // const queenId = req.param.id
    // console.log("*********body odyyy2*************", req.body);
    // // find the queen
    // Queen.findById(queenId)
    //     // -->render if there is a fruit
    //     .then((queen) => {
    //         console.log('da queen\n', queen)
    //         const username = req.session.username
    //         const loggedIn = req.session.loggedIn
    //         res.render('Queens/fave', { queen, username, loggedIn })
    //     })

    //     .catch(error => {
    //         res.redirect(`/error?error=${error}`)
    //     })
})


// update route -> sends a put request to our database
router.put('/fave/mine', (req, res) => {
    // get the id
    const queenId = req.params.id
    // tell mongoose to update the queen
    Queen.findByIdAndUpdate(queenId, req.body, { new: true })
        // if successful -> redirect to the main page
        .then((queen) => {
            console.log('the updated queen', queen)

            res.redirect(`/queen/fave/mine`)
        })
        // if an error, display that
        .catch((error) => res.json(error))
})




// const { username, userId, loggedIn } = req.session
// Queen.find({ owner: userId })
// Queen.find({})
//     .then(queen => {
//         // can only do redirect on post routes
//         console.log("queen", queen);
//         res.redirect('dragball/2', { queen, username, loggedIn })
//     })
//     .catch(error => {
//         res.redirect(`/error?error=${error}`)
//     })

// Queen.create(req.body)
// .then((queen) => {
//     console.log('this was returned from create', queen)
//     res.render('Queens/fave')
// })
// .catch((err) => {
//     console.log(err)
//     res.json({ err })
// })


// 

// Export the Router
module.exports = router