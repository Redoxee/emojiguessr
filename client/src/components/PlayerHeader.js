import { useDispatch, useSelector } from 'react-redux';
import {useState, useEffect} from 'react';
import { setPlayer } from '../store';
import { axiosGame } from '../AxiosGame';

function PlayerHeader() {
    const dispatch = useDispatch();
    const {playerId, chefId} = useSelector((state)=>{
        return state.game;
    });

    const fetchPlayerId = async ()=> {
        const res = await axiosGame.get('/');
        const id = res.data.playerId;
        console.log('fetched playerId ', id);
        dispatch(setPlayer(id));
    };

    useEffect(()=>{
        fetchPlayerId();
    }, [])

    const playerSection = (<div>{playerId ? `Hello player ${playerId}` : 'no player id'}</div>);
    const chefSection = (<div>{chefId ? chefId === playerId ? "you're the chef" : `chef is ${chefId}` : "no chef"}</div>);

    return <div>{playerSection}{chefSection}</div>
}

export default PlayerHeader;