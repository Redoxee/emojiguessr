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
let roundResults = {};
let scores = {};

function generatePlayerID(){
    return Date.now();
}

function selectNew() {
    selectedAnswer =  Math.floor(Math.random() * selectedContent.length);
    hints = [];
    roundResults = {};
    hintNumber = 0;
}

app.get('/chefId/', (req, res) => {
    res.send({chefId: currentChefId})
});

app.get('/refresh/:playerId', (req, res)=> {
    let response = { 
        chefId: currentChefId,
        hintNumber: hintNumber,
        hints: hints,
        scores,
        roundResults
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

app.put('/nextRound',(req, res) => {
    currentChefId = 0;
    selectNew();
    console.log('Start next round');
    res.status(200);
});

app.put('/hintNumber/:hintNumber', (req, res)=> {
    hintNumber = req.params.hintNumber;
    res.status(200);
});

app.put('/reset', (req, res)=> {
    currentChefId = 0;
    selectNew();
    scores = {};
    console.log("Reset");
    res.send({response: selectedContent[selectedAnswer]});
});

app.put('/hint/:hint',(req, res)=>{
    if(hints.length < hintNumber) {
        hints.push(req.params.hint);
    }
    res.status(200);
});

app.put('/response/:playerId/:responseIndex', (req, res)=>{
    const {playerId, responseIndex} = req.params;
    if(!roundResults[playerId])
    {
        if(responseIndex == selectedAnswer) {
            console.log(`Player ${playerId} found the correct response ${responseIndex} ${selectedContent[responseIndex]}`);
            
            let score = Math.max(0, 15 - hintNumber + 8 - hints.length + 15 - Object.keys(roundResults).length);
            roundResults[playerId] = score;
            
            const chefScore = Math.floor(score / 2);
            if(!roundResults[currentChefId]) {
                roundResults[currentChefId] = chefScore;
            }else{
                roundResults[currentChefId] = roundResults[currentChefId] + chefScore;
            }
            
            if(!scores[playerId])
            {
                scores[playerId] = score;
            }
            else {
                scores[playerId] = scores[playerId] + score;
            }
            
            if(!score[currentChefId]) {
                scores[currentChefId] = chefScore;
            }
            else {
                scores[currentChefId] = scores[currentChefId] + chefScore;
            }

            console.log('score ', score, ' chef score ', chefScore);
        }
        else {
            if(scores[playerId]) {
                scores[playerId] = Math.max(0, scores[playerId] - 2); 
            }
        }
    }
    
    res.status(200);
});

app.get('/', (req, res) => {
    res.send({
        responses: selectedContent
    });
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`)
  console.log(content);
});