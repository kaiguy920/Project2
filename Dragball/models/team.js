// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const teamSchema = new Schema(
	{
		// teamName: { type: String, required: true },
		// set ref to an array & set limit to 5
		teamMember: [{
			type: Schema.Types.ObjectID,
			ref: 'Queen',
			maxTeamMember: 5
		}],
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
