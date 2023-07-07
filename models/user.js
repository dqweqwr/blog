const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    unique: true
  },
  name: String,
  passwordHash: {
    type: String,
    required: true,
    minLength: 6
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog"
    }
  ]
})

userSchema.plugin(uniqueValidator)

userSchema.set("toJSON", {
  transform: (document, returnedObj) => {
    returnedObj.id = returnedObj._id.toString()
    delete returnedObj._id
    delete returnedObj.__v
    delete returnedObj.passwordHash
  }
})

module.exports = mongoose.model("User", userSchema)
