import express from "express";
import multer from "multer";
import * as musicController from '../controllers/music.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';


/* Multer used here */
const upload = multer({
  storage: multer.memoryStorage(),
})


/* Router Created */
const router = express.Router();

/**
 @route POST /api/music/upload
 @description artist can upload music files
 @access private
 */
router.post("/upload", authMiddleware.authArtistMiddleware, upload.fields([
  { name: "music", maxCount: 1 },
  { name: "coverImage", maxCount: 1 },
])
  , musicController.uploadMusic);


/**
@route GET /api/music/
@description get all musics
@access private
*/
router.get("/", authMiddleware.userAuthMiddleware, musicController.getAllMusics);


/**
@route GET /api/music/get-details/:id
@description get a single music file with details
@access private
*/
router.get("/get-details/:id",authMiddleware.userAuthMiddleware,musicController.getMusicById);


/**
@route GET /api/music/upload
@description get artist's music files data
@access private
*/
router.get("/artist-musics", authMiddleware.authArtistMiddleware, musicController.getArtistMusics);


/**
@route POST /api/music/playlist
@description create a artist's playlist
@access private
*/
router.post("/playlist", authMiddleware.authArtistMiddleware, musicController.createPlaylist);


/**
@route GET /api/music/playlist/artist
@description get a single artist's playlist
@access private
*/
router.get("/playlist/artist", authMiddleware.authArtistMiddleware, musicController.getArtistPlaylist);


/**
@route GET /api/music/playlists
@description get  artist's playlists
@access private
*/
router.get("/playlist", authMiddleware.userAuthMiddleware, musicController.getPlaylists)

/**
@route GET /api/music/playlistId
@description get a spacific  playlist
@access private
*/
router.get("/playlist/:id", authMiddleware.userAuthMiddleware, musicController.getPlaylistById);



export default router;


