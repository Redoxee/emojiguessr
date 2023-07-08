const cors = require('cors');

const content = require("./content/content.json");
const express = require('express')
const app = express()
const port = 3001

app.use(cors());

let selected = 0;
function selectNew() {
    selected =  Math.floor(Math.random() * content.responses.length);
}

selectNew();


app.get('/Chef', (req, res) => {
    res.send({response: content.responses[selected]});
});

app.put('/reset', (req, res)=> {
    selectNew();
    res.send({response: content.responses[selected]});
});

app.get('/', (req, res) => {
    req.send('hello player');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  console.log(content);
});

module.exports = app;