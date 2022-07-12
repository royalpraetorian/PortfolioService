var express = require('express');
var router = express.Router();
const youtubeService = require('../services/youtubeService');

router.get('/getPlaylistVideos', async function(req, res) {
    var youtubeVids = (await youtubeService.getVideosFromPlaylist('PLVnN9RqB5lrxLXVLlz-JCp_CrstjB3pLN', 50))
    console.log(youtubeVids)
    res.send(youtubeVids.data);
})

module.exports = router;