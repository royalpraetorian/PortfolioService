var express = require('express');
var router = express.Router();
const youtubeService = require('../services/youtubeService');

router.get('/getPlaylistVideos', async function(req, res) {
    res.send((await youtubeService.getVideosFromPlaylist('PLQdvZmDLepiAl4fbNqwFRKVfcdlSl9oq4', 50)).data);
})

module.exports = router;