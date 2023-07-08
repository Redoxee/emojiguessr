const cors = require('cors');

const content = require("./content/content.json");
const express = require('express')
const app = express()
const port = 8100

app.use(cors());

let selectedAnswer = 0;
let currentChefId = 0;

function generatePlayerID(){
    return Date.now();
}

function selectNew() {
    selectedAnswer =  Math.floor(Math.random() * content.questions.length);
}

app.get('/chefId/', (req, res) => {
    res.send({chefId: currentChefId})
});

app.get('/refresh/:playerId', (req, res)=> {
    let response = { 
        chefId: currentChefId
    };
    const playerId = req.paramsplayerId;
    if (currentChefId !== 0 && currentChefId === playerId) {
        response.question = content.questions[selectedAnswer];
    }

    res.send(response);
});

app.put('/chefId/:chefId', (req, res) => {
    currentChefId = req.params.chefId;
    selectNew();
    console.log('currentChefId is ' + currentChefId);
    res.status(200);
});

app.put('/reset', (req, res)=> {
    currentChefId = 0;
    selectNew();
    res.send({response: content.questions[selectedAnswer]});
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