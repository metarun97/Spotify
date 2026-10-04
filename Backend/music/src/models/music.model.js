import mongoose from "mongoose";


/* Music schema created */
const musicSchema = await mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  artist: {
    type: String,
    required: true,
  },

  artistId: {
    type: mongoose.Schema.Types.ObjectId
  },

  musicKey: {
    type: String,
    required: true,
  },

  coverImageKey: {
    type: String,
    required: true,
  },
}, { timestamps: true })


/* Music model created */
const musicModel = mongoose.model("music", musicSchema);

export default musicModel;
