import cors from 'cors';
import contentJson from './content/content.json' ;
import express, {Express, Request, Response} from 'express';

const app = express()
const port = 8100

app.use(cors());

interface CategoryEntry {
    name : string,
    guesses : string[]
}

interface ContentStructure {
	[name: string]: CategoryEntry
}

interface RoundResults {
	[playerId : string] : number;
}

enum JournalEntryType {
	NewRound,
	NewGM,
	ResetGame,
	GMSelectedHint,
	WrongAnswer,
	CorrectAnswer,
}

interface JournalEntry {
	entryType : string,
	playerId : string,
}

interface PlayerKnownEntry {
    playerId : string,
    lastSeen : number,
    score : number
}

const content = contentJson as ContentStructure;

const selectedContentName = "question_characters";
let selectedContent = content[selectedContentName].guesses;

let frame = 1;

let selectedAnswer = 0;
let hintifiedAnswer = "";
let currentChefId : string|null = null;

let hints :string[] = [];
let roundResults : RoundResults = {};

const maxJournalEntries = 10;
let journal : JournalEntry[] = [];

const playerLifeTime = 1 * 60 * 1000; // how long in miliseconds before forgeting a player.
const knownPlayers : PlayerKnownEntry[] = [];

var allowedChars = /[a-z]|[éè]/gi;

function hintify(source : string) {
    let result = "";
    for (let index = 0; index < source.length; ++index) {
        if(source[index].match(allowedChars)) {
            result += 'x';
        }
        else {
            result += source[index];
        }
    }

    return result;
}

interface AvailableLetter {
    [char:string]: number
}

function CorrectGuess(guess : string, correctGuess : string) : string {
    let correction = "";
    
    let availableCharacters : AvailableLetter = {};
    for (let index = 0; index < correctGuess.length; ++index) {
        const char = correctGuess[index];
        if(availableCharacters[char]) {
            availableCharacters[char]++;
        } 
        else {
            availableCharacters[char] = 1;
        }
    }

    for (let index = 0; index < guess.length; ++index) {
        if(index >= correctGuess.length) {
            correction += "X";
            continue;
        }

        const guessChar = guess[index];
        if (guessChar === correctGuess[index]) {
            correction += "O";
        }
        else {
            if (availableCharacters[guessChar]) {
                correction += "M";
            }
            else {
                correction += "X"
            }
        }

        if (availableCharacters[guessChar]) {
            availableCharacters[guessChar]--;
        }
    }

    return correction;
}

function selectNew() {
    selectedAnswer =  Math.floor(Math.random() * selectedContent.length);
    hintifiedAnswer = hintify(selectedContent[selectedAnswer]);
    hints = [];
    roundResults = {};
    frame++;
}

function LogEntry(entryType: JournalEntryType, playerId: string) : void {
	journal.push({playerId, entryType: JournalEntryType[entryType]});
	if (journal.length > maxJournalEntries) {
		journal.shift();
	}
}

app.get('/chefId/', (req : Request, res : Response) => {
    res.send({chefId: currentChefId})
});

app.get('/refresh/:playerId', (req : Request, res : Response)=> {
    const playerId = req.params.playerId;
    console.log(`playerId ${playerId}, frame ${frame}`);

    {
        let playerEntry = knownPlayers.find((element)=> {
            return element.playerId === playerId
        });
        
        if (!playerEntry) {
            console.log(`new player ${playerId}`);
            playerEntry = {playerId, lastSeen : Date.now() , score: 0}
            knownPlayers.push(playerEntry);
            frame++;
        }
        else {
            playerEntry.lastSeen = Date.now();
        }
    }

    let response = { 
        chefId: currentChefId,
        hints: hints,
        scores: knownPlayers,
        roundResults,
        hintifiedAnswer,
        frame,
		question : "",
		journal,
        knownPlayers,
    };

    if (currentChefId && currentChefId === playerId) {
        response.question = selectedContent[selectedAnswer];
    }

    res.send(response);
});

app.put('/chefId/:chefId', (req, res) => {
    currentChefId = req.params.chefId;
    selectNew();
    frame++;
	LogEntry(JournalEntryType.NewGM, currentChefId)
    console.log('currentChefId is ' + currentChefId);
    res.status(200).send();
});

app.put('/nextRound/:playerId',(req, res) => {
    currentChefId = null;
    selectNew();
    console.log('Start next round');

	LogEntry(JournalEntryType.NewRound, req.params.playerId);
    frame++;
    res.status(200).send();
});

app.put('/reset/:playerId', (req, res)=> {
	LogEntry(JournalEntryType.ResetGame, req.params.playerId);
    currentChefId = null;
    selectNew();
    knownPlayers.splice(0, knownPlayers.length);
    frame++;
    console.log("Reset");
    res.send({response: selectedContent[selectedAnswer]});
});

app.put('/hint/:playerId/:hint',(req, res)=>{
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

app.put('/guess/:playerId/:answer', (req, res)=> {
    frame++;
    const {answer: playerAnswer, playerId} = req.params;
    console.log(`"${playerId}" - "${playerAnswer}"`);
    
    if(!playerId) {
        res.status(400).send({reason:"Missing playerId"});
        return;
    }

    if(!playerAnswer) {
        res.status(400).send({reason:"Missing answer"});
        return;
    }

    if(playerAnswer.length > 1000 || playerId.length > 1000) {
        res.status(400).send({reason: "Payload too big"});
        return;
    }

    if(!roundResults[playerId]) {
        const lowerServerAnswer = selectedContent[selectedAnswer].toLowerCase();
        const lowerPlayerAnswer = playerAnswer.toLowerCase();
        let correction = CorrectGuess(lowerPlayerAnswer, lowerServerAnswer);

        if (lowerPlayerAnswer !== lowerServerAnswer) {
			LogEntry(JournalEntryType.WrongAnswer, playerId);

            res.status(200).send({result: false, correction});
            return;
        }
		else  {
			console.log(`Player ${playerId} found the correct response ${lowerServerAnswer}`);
			let score = Math.max(0, 8 - hints.length + 15 - Object.keys(roundResults).length);
			roundResults[playerId] = score;
            let scoreEntry = knownPlayers.find(element=>element.playerId === playerId);
            if(scoreEntry)
            {
                scoreEntry.score += score;
            }

            knownPlayers.sort((a, b)=> b.score - a.score);
			
			LogEntry(JournalEntryType.CorrectAnswer, playerId);

			res.status(200).send({result: true, correction});
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
    console.log(`Listening on port ${port}`)
});

setInterval(() => {
    const now = Date.now();
    let changed = false;
    for (let index = knownPlayers.length - 1; index > -1; --index) {
        if(now - knownPlayers[index].lastSeen > playerLifeTime) {
            knownPlayers.splice(index, 1);
            changed = true;
        }
    }

    if(changed)
    {
        frame++;
    }
}, 1000);