const cors = require('cors');

const content = require("./content/content.json");
const express = require('express')
const app = express()
const port = 8100

app.use(cors());

let selectedAnswer = 0;
let currentChefId = 0;

function selectNew() {
    selectedAnswer =  Math.floor(Math.random() * content.responses.length);
}

function generatePlayerID(){
    return Date.now();
}

selectNew();

app.get('/chef', (req, res) => {
    res.send({response: content.responses[selectedAnswer]});
});

app.get('/chefId', (req, res) => {
    res.send({chefId: currentChefId})
});

app.put('/chefId/:chefId', (req, res) => {
    currentChefId = req.params.chefId;
    console.log('currentChefId is ' + currentChefId);
    res.status(200);
});

app.put('/reset', (req, res)=> {
    selectNew();
    res.send({response: content.responses[selectedAnswer]});
});

app.get('/', (req, res) => {
    res.send({
        playerId : generatePlayerID()
    });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(content);
});