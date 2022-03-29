var express = require('express');
var MongoService = require('../services/mongoService');
const res = require('express/lib/response');
var router = express.Router();
var SpotifyService = require('../services/spotifyService');
var bodyparser = require('body-parser');
const req = require('express/lib/request');

// import {songLookup} from "../services/spotifyService";

router.post('/request', async function(req, res) {
    console.log(req.body);
    req.body.votes[0].ip = req.ip;
    var respsonse = await MongoService.vote(req.body);
    console.log(respsonse);
    res.send();
})

router.post('/unvote', async function(req, res) {
    var response = await MongoService.unVote(req.body, req.ip);
    console.log(response);
    res.send(response);
})

router.get('/getAllRequests', async function(req, res) {
    res.send(await MongoService.getCollection(req.ip));
})

router.post('/drop', async function(req, res) {
    response = await MongoService.drop();
    console.log("Table dropped");
    res.send(response);
})

router.get('/autofill', async function(req, res) {
    results = await findSongs(req.query['title']);
    results = results.body.tracks.items;
    results = results.map((item) => {
        return {
            title: item.name, 
            popularity: item.popularity, 
            id: item.id,
            artists: item.artists.map((artist) => artist.name), 
            album: item.album.name, 
            img: item.album.images[item.album.images.length-1].url
        };
    })
    results = results.sort((item1, item2) => item2.popularity - item1.popularity);
    res.send(results);
})

router.get('/lookup', async function(req, res) {
    console.log(req.query);
    results = await findSongs(req.query['title']);
    res.send(results);
})

async function findSongs(searchString)
{
    var results = await SpotifyService.songLookup(searchString);
    return results;
}

module.exports = router;