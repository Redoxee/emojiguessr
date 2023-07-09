import { configureStore } from "@reduxjs/toolkit";
import { gameReducer, setPlayer, setChef, setQuestion} from "./slices/GameSlice";

const store = configureStore({
    reducer:{
        game: gameReducer,
    }
});


export {
    store,
    setPlayer,
    setChef,
    setQuestion
}