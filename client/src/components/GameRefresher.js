import { useDispatch, useSelector } from 'react-redux';
import {useState, useEffect} from 'react';
import { setChef, setQuestion } from '../store';
import { axiosGame } from '../AxiosGame';

const refreshRate = 1000;

function getRefresh(pId) {
    return async ()=>{
        const res = await axiosGame.get(`/refresh/${pId}`);
        const serverChefId = Number(res.data.chefId);
        
    }
}

function GameRefresher() {
    const dispatch = useDispatch();
    const refresh = async () => {
        const {playerId, chefId} = useSelector((state)=>{
            return state.game;
        });
        
        const res = await axiosGame.get(`/refresh/${playerId}`);
        const serverChefId = Number(res.data.chefId);
        if (serverChefId !== chefId){
            dispatch(setChef(serverChefId));
            chefId = serverChefId;
        }

        dispatch(setQuestion(res.data.question));
    }

    let isRefreshing = false;
    const refreshRoutine = ()=> {
        setTimeout(()=>refreshRoutine, refreshRate);
        if(isRefreshing) {
            return;
        }

        if(!playerId) {
            return;
        }

        isRefreshing = true;

        refresh();

        isRefreshing = false;
    }

    useEffect(()=>{
        refreshRoutine();
    }, []);

    return <div/>
}

export default GameRefresher;