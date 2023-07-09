const cors = require('cors');

const content = require("./content/content.json");
const express = require('express')
const app = express()
const port = 8100

app.use(cors());
let selectedContent = content[content.selected_content];
let selectedAnswer = 0;
let currentChefId = 0;

let hintNumber = 0;
let hints = [];

function generatePlayerID(){
    return Date.now();
}

function selectNew() {
    selectedAnswer =  Math.floor(Math.random() * selectedContent.length);
    hints = [];
    hintNumber = 0;
}

app.get('/chefId/', (req, res) => {
    res.send({chefId: currentChefId})
});

app.get('/refresh/:playerId', (req, res)=> {
    let response = { 
        chefId: currentChefId,
        hintNumber: hintNumber,
        hints: hints
    };
    const playerId = req.params.playerId;
    console.log(`playerId ${playerId}`);
    if (currentChefId !== 0 && currentChefId === playerId) {
        response.question = selectedContent[selectedAnswer];
    }

    res.send(response);
});

app.put('/chefId/:chefId', (req, res) => {
    currentChefId = req.params.chefId;
    selectNew();
    console.log('currentChefId is ' + currentChefId);
    res.status(200);
});

app.put('/hintNumber/:hintNumber', (req, res)=> {
    hintNumber = req.params.hintNumber;
    res.status(200);
});

app.put('/reset', (req, res)=> {
    currentChefId = 0;
    selectNew();
    console.log("Reset");
    res.send({response: selectedContent[selectedAnswer]});
});

app.put('/hint/:hint',(req, res)=>{
    if(hints.length < hintNumber) {
        hints.push(req.params.hint);
    }
    res.status(200);
});

app.get('/', (req, res) => {
    res.send({
        playerId : generatePlayerID(),
        responses: selectedContent
    });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(content);
});