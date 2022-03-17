// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const teamNameSchema = new Schema(
    {

        name: { type: String },

        owner: {
            type: Schema.Types.ObjectID,
            ref: 'User',
        }
    },
    { timestamps: true }
)


const TeamName = model('TeamName', teamNameSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = TeamName
