const res = require('express/lib/response');
var SpotifyWebApi = require('spotify-web-api-node');
const app = require('../app');

const spotifyClientID = process.env.spotifyClientID;
const spotifyClientSecret = process.env.spotifyClientSecret;

const spotifyApi = new SpotifyWebApi({
    clientId: spotifyClientID,
    clientSecret: spotifyClientSecret
});

var tokenIssuedTime;
var tokenExpirationTime;
var authToken;

async function authorize()
{
    if(!authToken || shouldRefresh())
    {
        var token = await getToken();
        authToken = token['access_token'];
        spotifyApi.setAccessToken(authToken);
    }
}

async function getToken()
{
    var response;
    try{
        tokenIssuedTime = Date.now();
        response = await spotifyApi.clientCredentialsGrant();
        tokenExpirationTime = tokenIssuedTime + (response.body['expires_in']*1000);
    } 
    catch (e)
    {
        console.log(e);
    }
    console.log(response);
    return response.body;
}

function shouldRefresh()
{
    return tokenExpirationTime - Date.now() < 5000;
}

async function songLookup(trackTitle)
{
    await authorize();
    tracktitle = trackTitle.trim();
    var results = await spotifyApi.searchTracks(`track:${trackTitle}`);
    return results;
}

async function cachePlaylist()
{
    await authorize();
    var results = await spotifyApi.getPlaylistTracks('41w7JMfHRR9OnfZosICDIC');
    results = results.body.items;
    results = results.map((item) => {
        return {
            id: item.track.id,
        };
    });
    console.log("Cached");
    return results;
}

module.exports = {songLookup, cachePlaylist};


