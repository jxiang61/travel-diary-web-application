var mongoose = require("mongoose");

var commentSchema = mongoose.Schema({
	text: String,
	author: {
		// extract the author info from the DB;
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username:String
	}
});



module.exports = mongoose.model("Comment", commentSchema);