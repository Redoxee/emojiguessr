import './App.css';
import axios from 'axios';
import 'emoji-picker-element';
import {useState, useEffect} from 'react';

const refreshRate = 1000;

const axiosGame = axios.create({
  baseURL:'https://antonmakesgames.alwaysdata.net/',
});

let isRefreshing = false;

function App() {


  const [userId, setUserId] = useState(0);
  const [chefId, setChefId] = useState(0);
  
  const refresh = async() => {
    setTimeout(()=>{
      refresh();
    }, refreshRate);
  
    if (isRefreshing) {
      return;
    }
    
    isRefreshing = true;
    if (!chefId) {
      const res = await axiosGame.get('/chefId');
      setChefId(res.data.chefId)
    }
  
    isRefreshing = false;
  }

  useEffect(()=> {
    const fetchUserId = async() =>{
        const res = await axiosGame.get();
        console.log(res);
        setUserId(res.data.playerId);
        refresh();
      };
    
    fetchUserId();
  });
  
  return (
    <div className="App">
      <p>Emoji Guessr</p>
      {
        userId?`Hello player ${userId}`:'no playerId'
      }
    </div>
  );
}

export default App;
