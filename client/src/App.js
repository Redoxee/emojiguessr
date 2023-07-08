import './App.css';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react';
import {useState, useEffect} from 'react';
import React from 'react';

const refreshRate = 1000;

const axiosGame = axios.create({
  baseURL:'https://antonmakesgames.alwaysdata.net/',
});

function debug() {
  const handleReset = ()=>{
    axiosGame.put('/reset');
  };

  return <div className='debug'><button onClick={handleReset}>rst</button></div>
}

let isRefreshing = false;

function App() {
  const [playerId, setPlayerId] = useState(0);
  const [chefId, setChefId] = useState(0);
  const [question, setQuestion] = useState("");
  
  const refresh = async() => {
    setTimeout(()=>{
      refresh();
    }, refreshRate);
  
    if (isRefreshing) {
      return;
    }
    
    isRefreshing = true;

    const res = await axiosGame.get(`/refresh/${playerId}`);
    const serverChefId = Number(res.data.chefId);
     // console.log(`local ${typeof(chefId)} === server ${typeof(serverChefId)}`);
    if(serverChefId !== chefId){
      setChefId(serverChefId)
    }
    
    if (chefId) {
      if(res.data.question)
      {
        setQuestion(res.data.question);
      }
    }
  
    isRefreshing = false;
  }

  useEffect(()=> {
    const fetchPlayerId = async() =>{
        const res = await axiosGame.get();
        console.log(res);
        setPlayerId(res.data.playerId);
        refresh();
      };
    
    fetchPlayerId();
  },[]);
  
  const takeTheChefRole = ()=>{
    axiosGame.put(`/chefId/${playerId}`);
  }

  const handleSelectEmoji = (event)=> {
    console.log(event);
  }

  const chefDisplay = (playerId !== chefId) || <div>
    <div>{question}</div>
    <EmojiPicker onEmojiClick={handleSelectEmoji}></EmojiPicker>
  </div>

  return (
    <div className="App">
      <p>Emoji Guessr</p>
      <div>
        {
          playerId?`Hello player ${playerId}`:'no playerId'
        }
      </div>
      <div>
        {
          chefId? chefDisplay: <div>
            <p>'no chef at the moment'</p>
            <button onClick={takeTheChefRole}>I'm the chef</button>
          </div>
        }
      </div>
      {debug()}
    </div>
  );
}

export default App;
