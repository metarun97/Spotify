import { uploadFile, getPresignedUrls } from '../services/storage.service.js';
import musicModel from '../models/music.model.js';
import playlistModel from '../models/playlist.model.js';


/**
 @name uploadMusic
 @description artist can upload music files data (title,coverimage and mp3 )
 @access private
 */
export const uploadMusic = async (req, res) => {

  const musicFile = req.files["music"][0];
  const coverImageFile = req.files["coverImage"][0];

  try {
    const musicKey = await uploadFile(musicFile);
    const coverImageKey = await uploadFile(coverImageFile);

    const music = await musicModel.create({
      title: req.body.title,
      artist: req.user.fullname.firstName + " " + req.user.fullname.lastName,
      artistId: req.user.id,
      musicKey,
      coverImageKey
    })

    res.status(201).json({
      message: "Music created successfully!",
      music,
    })


  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error!"
    })
  }
}


/**
 @name getMusicById
 @description get a single music file and it's details
 @access private
 */
export const getMusicById = async (req, res) => {

  const { id } = req.params;

  try {

    const music = await musicModel.findById(id).lean();

    if (!music) {
      return res.status(404).json({
        message: "Music not found!",
      })
    }

    music.musicUrl = await getPresignedUrls(music.musicKey);
    music.coverImageUrl = await getPresignedUrls(music.coverImageKey);

    res.status(200).json({ music });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server errror!",
    })
  }
}


/**
 @name getAllMusics
 @description get all musics
 @access private
 */
export const getAllMusics = async (req, res) => {
  try {

    const { skip = 0, limit = 10 } = req.query;

    const musicDocs = await musicModel.find().skip(skip).limit(limit).lean();

    let musics = [];

    for (let music of musicDocs) {
      music.musicUrl = await getPresignedUrls(music.musicKey);
      music.coverImageUrl = await getPresignedUrls(music.coverImageKey);
      musics.push(music);
    }

    res.status(200).json({
      message: "Music fetched successfully!",
      musics,
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error!",
    })
  }
}


/**
 @name getArtistMusics
 @description get artist files data (title,coverimage and mp3 )
 @access private
 */
export const getArtistMusics = async (req, res) => {
  try {
    const musicsDocs = await musicModel.find({ artistId: req.user.id }).lean();


    let musics = [];

    for (let music of musicsDocs) {
      music.musicUrl = await getPresignedUrls(music.musicKey);
      music.coverImageUrl = await getPresignedUrls(music.coverImageKey);
      musics.push(music);
    }

    res.status(200).json({ musics });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error!",
    })
  }

}


/**
 @name createPlaylist
 @description it accepts title,artist,artistId and musics
 @access private
 */
export const createPlaylist = async (req, res) => {
  try {
    const { title, musics } = req.body;

    const playlist = await playlistModel.create({
      title,
      artist: req.user.fullname.firstName + " " + req.user.fullname.lastName,
      artistId: req.user.id,
      musics,
    })

    res.status(201).json({
      message: "Playlist created successfully!",
      playlist,
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal seever error!",
    })
  }


}


/**
 @name getPlaylist
 @description it gives you playlist
 @access private
 */
export const getPlaylists = async (req, res) => {
  try {

    const playlists = await playlistModel.find({ artistId: req.user.id });

    res.status(200).json({ playlists });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error!",
    })
  }
}


/**
 @name getPlaylistById
 @description it gives you a specific playlist
 @access private
 */
export const getPlaylistById = async (req, res) => {

  const { id } = req.params;

  try {

    const playlistDocs = await playlistModel.findById(id).lean();

    const musics = []

    for (let musicId of playlistDocs.musics) {
      const music = await musicModel.findById(musicId).lean();
      if (music) {
        music.musicUrl = await getPresignedUrls(music.musicKey);
        music.coverImageUrl = await getPresignedUrls(music.coverImageKey);
        musics.push(music);
      }
    }

    playlistDocs.musics = musics;

    res.status(200).json({ playList: playlistDocs })


  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Internal server error!",
    })
  }
}
