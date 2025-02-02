const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    pictian: {
      type: Boolean,
      required: true
    },
    college: {
      type: String,
      required: false,
    },
    classname: {
      type: String,
      required: false,
    },
    hackerrankid: {
      type: String,
      required: false,
      default: "Not Provided",
    },
    rollNo: {
      type: String,
      required: false,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Event",
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
    },
    email: {
      type: String,
      required: true,
      match: [/.+@.+\..+/, "Please provide a valid email address"],
    },
    mobile: {
      type: String,
      required: true,
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    },
    alternatecontact: {
      type: String,
      required: false,
      match: [/^\d{10}$/, "Mobile number must be 10 digits"],
    },
    transactionID: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

participantSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model("Participant", participantSchema);