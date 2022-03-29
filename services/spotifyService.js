var SpotifyWebApi = require('spotify-web-api-node');

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

module.exports = {songLookup};


