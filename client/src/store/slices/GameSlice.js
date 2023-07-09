import { createSlice, nanoid } from "@reduxjs/toolkit";

const gameSlice = createSlice({
    name:'game',
    initialState:{
        playerId : 0,
        chefId: 0,
        question: null,
    },

    reducers: {
        setPlayer(state, action) {
            state.playerId = action.payload;
        },

        setChef(state, action) {
            state.chefId = action.payload;
        },

        setQuestion(state, action){
            state.question = action;
        }
    }
});

export const { setPlayer, setChef, setQuestion } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;