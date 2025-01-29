const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    leader: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Assuming a User schema exists
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Event", // Assuming an Event schema exists
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Team", teamSchema);
