"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const content_json_1 = __importDefault(require("./content/content.json"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 8100;
app.use((0, cors_1.default)());
var JournalEntryType;
(function (JournalEntryType) {
    JournalEntryType[JournalEntryType["NewRound"] = 0] = "NewRound";
    JournalEntryType[JournalEntryType["NewGM"] = 1] = "NewGM";
    JournalEntryType[JournalEntryType["ResetGame"] = 2] = "ResetGame";
    JournalEntryType[JournalEntryType["GMSelectedHint"] = 3] = "GMSelectedHint";
    JournalEntryType[JournalEntryType["WrongAnswer"] = 4] = "WrongAnswer";
    JournalEntryType[JournalEntryType["CorrectAnswer"] = 5] = "CorrectAnswer";
})(JournalEntryType || (JournalEntryType = {}));
const content = content_json_1.default;
const selectedContentName = content.selected_content;
let selectedContent = content[selectedContentName];
let frame = 1;
let selectedAnswer = 0;
let hintifiedAnswer = "";
let currentChefId = null;
let hints = [];
let roundResults = {};
let scores = {};
const maxJournalEntries = 10;
let journal = [];
var allowedChars = /[a-z]|[éè]/gi;
function hintify(source) {
    let result = "";
    for (let index = 0; index < source.length; ++index) {
        if (source[index].match(allowedChars)) {
            result += 'x';
        }
        else {
            result += source[index];
        }
    }
    return result;
}
function selectNew() {
    selectedAnswer = Math.floor(Math.random() * selectedContent.length);
    hintifiedAnswer = hintify(selectedContent[selectedAnswer]);
    hints = [];
    roundResults = {};
    frame++;
}
function LogEntry(entryType, playerId) {
    journal.push({ playerId, entryType: JournalEntryType[entryType] });
    if (journal.length > maxJournalEntries) {
        journal.shift();
    }
}
app.get('/chefId/', (req, res) => {
    res.send({ chefId: currentChefId });
});
app.get('/refresh/:playerId', (req, res) => {
    let response = {
        chefId: currentChefId,
        hints: hints,
        scores,
        roundResults,
        hintifiedAnswer,
        frame,
        question: "",
        journal
    };
    const playerId = req.params.playerId;
    console.log(`playerId ${playerId}, frame ${frame}`);
    if (currentChefId && currentChefId === playerId) {
        response.question = selectedContent[selectedAnswer];
    }
    res.send(response);
});
app.put('/chefId/:chefId', (req, res) => {
    currentChefId = req.params.chefId;
    selectNew();
    frame++;
    LogEntry(JournalEntryType.NewGM, currentChefId);
    console.log('currentChefId is ' + currentChefId);
    res.status(200).send();
});
app.put('/nextRound/:playerId', (req, res) => {
    currentChefId = null;
    selectNew();
    console.log('Start next round');
    LogEntry(JournalEntryType.NewRound, req.params.playerId);
    frame++;
    res.status(200).send();
});
app.put('/reset/:playerId', (req, res) => {
    LogEntry(JournalEntryType.ResetGame, req.params.playerId);
    currentChefId = null;
    selectNew();
    scores = {};
    frame++;
    console.log("Reset");
    res.send({ response: selectedContent[selectedAnswer] });
});
app.put('/hint/:playerId/:hint', (req, res) => {
    const startedFrame = frame;
    console.log(`Put hint frame ${startedFrame}`);
    hints.push(req.params.hint);
    console.log(`Pushed hint frame ${startedFrame}`);
    LogEntry(JournalEntryType.GMSelectedHint, req.params.playerId);
    console.log(`Logged frame ${startedFrame}`);
    frame++;
    res.status(200).send();
    console.log(`Ended hint frame ${startedFrame}`);
});
app.put('/guess/:playerId/:answer', (req, res) => {
    frame++;
    const { answer: playerAnswer, playerId } = req.params;
    console.log(`"${playerId}" - "${playerAnswer}"`);
    if (!playerId) {
        res.status(400).send({ reason: "Missing playerId" });
        return;
    }
    if (!playerAnswer) {
        res.status(400).send({ reason: "Missing answer" });
        return;
    }
    if (playerAnswer.length > 1000 || playerId.length > 1000) {
        res.status(400).send({ reason: "Payload too big" });
        return;
    }
    if (!roundResults[playerId]) {
        const serverAnswer = selectedContent[selectedAnswer];
        if (playerAnswer !== serverAnswer) {
            let correction = "";
            for (let index = 0; index < serverAnswer.length; ++index) {
                if (index >= playerAnswer.length || serverAnswer[index] !== playerAnswer[index]) {
                    correction += "X";
                }
                else {
                    correction += "O";
                }
            }
            LogEntry(JournalEntryType.WrongAnswer, playerId);
            res.status(200).send({ result: false, correction });
            return;
        }
        else {
            console.log(`Player ${playerId} found the correct response ${serverAnswer}`);
            let score = Math.max(0, 8 - hints.length + 15 - Object.keys(roundResults).length);
            roundResults[playerId] = score;
            if (scores[playerId]) {
                scores[playerId] += score;
            }
            else {
                scores[playerId] = score;
            }
            LogEntry(JournalEntryType.CorrectAnswer, playerId);
            res.status(200).send({ result: true });
        }
    }
    res.status(200).send();
});
app.get('/', (req, res) => {
    res.send({
        responses: selectedContent,
        frame
    });
});
app.listen(port, () => {
    console.log(content);
    console.log(`Listening on port ${port}`);
});
