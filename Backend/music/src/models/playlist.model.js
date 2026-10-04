import mongoose from "mongoose";


/* Playlist Schema created */
const playListSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  artist: {
    type: String,
    required: true
  },

  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  musics: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "music",
  }]

}, { timestamps: true });


/* Playlist Model created */
const playlistModel = mongoose.model("playlist", playListSchema);

export default playlistModel;
