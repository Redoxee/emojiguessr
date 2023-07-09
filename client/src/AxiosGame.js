
import axios from 'axios';

const axiosGame = axios.create({
  baseURL:'https://antonmakesgames.alwaysdata.net/',
});

export {axiosGame};