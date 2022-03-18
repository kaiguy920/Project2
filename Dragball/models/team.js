// import dependencies
const mongoose = require('./connection')

// import user model for populate
const User = require('./user')
const Queen = require('./queen')
// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const teamSchema = new Schema(
	{
		// teamName: { type: String, required: true },
		// set ref to an array & set limit to 5
		teamMembers: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Queen',
			}
		],
		owner: {
			type: Schema.Types.ObjectID,
			ref: 'User',
		}
	},
	{ timestamps: true }
)




// 		{
// 			type: [{
// 				type: Schema.Types.ObjectID,
// 				ref: 'Queen',
// 			}],
// 			validate: [arrayLimit, '{PATH} exceeds the limit of 5']
// 		},
// 		owner: {
// 			type: Schema.Types.ObjectID,
// 			ref: 'User',
// 		}
// 	},
// 	{ timestamps: true }
// )

// function arrayLimit(team) {
// 	return team.length <= 5;
// }

const Team = model('Team', teamSchema)

/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Team
