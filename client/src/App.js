import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import 'emoji-picker-element';
import {useState} from 'react';

const axiosGame = axios.create({
  baseURL:'https://antonmakesgames.alwaysdata.net/',
});

function App() {

  const [msg, setMsg] = useState(null);

  const handleButton = async ()=> {
    console.log('clicked!')
    const res = await axiosGame.get('/chef');
    setMsg(JSON.stringify(res.data));
    console.log(res);
  };
  
  return (
    <div className="App">
      <emoji-picker></emoji-picker>
      <button onClick={handleButton}>Click ME</button>
      <p>{msg}</p>
    </div>
  );
}

export default App;
