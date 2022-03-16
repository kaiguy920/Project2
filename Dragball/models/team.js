// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const teamSchema = new Schema(
	{
		teamName: { type: String, required: true },
		teamMember1: {
			type: Schema.Types.ObjectID,
			ref: 'Queen',
		},
		teamMember2: {
			type: Schema.Types.ObjectID,
			ref: 'Queen',
		},
		teamMember3: {
			type: Schema.Types.ObjectID,
			ref: 'Queen',
		},
		teamMember4: {
			type: Schema.Types.ObjectID,
			ref: 'Queen',
		},
		teamMember5: {
			type: Schema.Types.ObjectID,
			ref: 'Queen',
		},
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)

const Team = model('Team', teamSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Team
