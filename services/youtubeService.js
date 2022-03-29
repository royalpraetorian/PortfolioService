const axios = require('axios');
const youtubeAPIKey = process.env.youtubeAPIKey

async function getVideosFromPlaylist(playlist, maxResults)
{
    try{
        return await axios('https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults='+ maxResults +'&playlistId='+ playlist + '&key='+ youtubeAPIKey);
    } catch(e) {
        console.log(e);
        return null;
    }
}

module.exports = {
    getVideosFromPlaylist
}