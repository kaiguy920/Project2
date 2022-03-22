// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const queenSchema = new Schema(
    {
        queenId: {
            type: String, required: true
        },
        name: {
            type: String, required: true,
            unique: true
        },
        image: { type: String, required: true },
        owner: {
            type: Schema.Types.ObjectID,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
)

const Queen = model('Queen', queenSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Queen