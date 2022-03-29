const req = require('express/lib/request');
const res = require('express/lib/response');
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoUsername = process.env.MongoUsername;
const mongoPass = process.env.MongoPassword;
const uri = `mongodb+srv://${mongoUsername}:${mongoPass}@cluster0.vzy46.mongodb.net/Cluster0?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const stringHash = require("string-hash");


async function getCollection(ip)
{
    var retVal;
    ip = hashIP(ip);
    try{
        await client.connect();
        const collection = client.db("Cluster0").collection("Song Requests");
        retVal = await collection.find().toArray();
        retVal = retVal.map(request => { 
            request.voted = hasVoted(request, ip);
            request.votes = request.votes.map(vote => vote.name)
            return request;
        })
        retVal = retVal.sort((item1, item2) => item2.votes.length - item1.votes.length);
        console.log(retVal);
        await client.close();
    } catch(e)
    {
        console.log(e);
    }
    
    return retVal;
}

function hasVoted(record, voterIP)
{
    if(record == null)
    {
        return false;
    }
    if(record.votes.some(vote => vote.ip == voterIP))
    {
        return true;
    }
    else
    {
        return false;
    }
}

function hashIP(ip)
{
    ip = ""+stringHash(ip);
    return ip;
}

async function findRecord(id)
{
    var retVal = null;

    try{
        await client.connect();
        const collection = client.db("Cluster0").collection("Song Requests");
        retVal = await collection.findOne({id: id});
        await client.close();
    }
    catch(e)
    {
        console.log(e);
    }

    if(retVal == null)
    {
        retVal = null;
    }

    return retVal;
}

async function drop()
{
    try{
        await client.connect();
        const collection = client.db("Cluster0").collection("Song Requests");
        await collection.drop();
        await client.close();
    }
    catch(e)
    {
        console.log(e);
    }
}

async function vote(songRequest)
{
    songRequest.votes[0].ip = hashIP(songRequest.votes[0].ip)
    var record = await findRecord(songRequest.id);
    if(!hasVoted(record, songRequest.votes[0].ip))
    {
        if (record==null)
        {
            await insertRecord(songRequest);
        }
        else
        {
            await addVoter(record, songRequest.votes[0]);
        }
        return {
            'status': 200,
            'message': "Voted"
        }
    }
    else
    {
        return {
            'status': 409,
            'message': "User has already voted for this song, cannot vote twice."
        }
    }
    
}

async function addVoter(record, voter)
{
    try{
        await client.connect();
        const collection = client.db("Cluster0").collection("Song Requests");
        await collection.updateOne(
            {'id': record.id},
            {$push: {votes: voter}}
        );
        await client.close();
    } catch(e){
        console.log(e);
    }
}

async function unVote(record, voterIP)
{
    record = await findRecord(record.id);
    voterIP = hashIP(voterIP);
    if(record.votes.length==1 && hasVoted(record, voterIP))
        {
            try{
                await client.connect();
                const collection = client.db("Cluster0").collection("Song Requests");
                await collection.deleteOne( {id: record.id} );
                await client.close();
            } catch(e){
                console.log(e);
            }
            return {
                'status': 200,
                'message': "Removed Record"
            }
        }
    else
        {
            try{
                await client.connect();
                const collection = client.db("Cluster0").collection("Song Requests");
                await collection.updateOne(
                    {'id': record.id},
                    {$pull: { votes: {ip: voterIP} } }
                )
                await client.close();
            } catch(e) {
                console.log(e);
            }
            return {
                'status': 200,
                'message': "Unvoted"
            }
        }
}

async function insertRecord(songRequest)
{
    try
    {
        await client.connect();
        const collection = client.db("Cluster0").collection("Song Requests");
        await collection.insertOne(songRequest);
        await client.close();
    }
    catch(e)
    {
        console.log(e);
    }
}


module.exports = {
    vote,
    drop,
    getCollection,
    unVote
}
