var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "axios"], function (require, exports, axios_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    axios_1 = __importDefault(axios_1);
    console.log("HELLO");
    const gameSrvUrl = "https://antonmakesgames.alwaysdata.net/";
    // const gameSrvUrl = "http://localhost:8100";
    let playerId = 0;
    let chefId = 0;
    let question = null;
    let refreshRate = 1000;
    let hintNumber = 0;
    let hints = [];
    let pauseRefresh = false;
    let responses = [];
    let nameTemplates = [];
    let playerLabel = document.getElementById('playerLabel');
    let chefLabel = document.getElementById('chefLabel');
    let questionLabel = document.getElementById('questionLabel');
    let emojiPicker = document.querySelector('emoji-picker');
    let hintPicker = document.getElementById('hintPicker');
    let hintHolder = document.getElementById('hintHolder');
    let responsesHolder = document.getElementById('responsesHolder');
    let nextRoundButton = document.getElementById('nextRoundButton');
    function setVisibility(element, display) {
        element.style.display = display ? '' : 'none';
    }
    function RandomSeed(s) {
        var mask = 0xffffffff;
        var m_w = (123456789 + s) & mask;
        var m_z = (987654321 - s) & mask;
        return function () {
            m_z = (36969 * (m_z & 65535) + (m_z >>> 16)) & mask;
            m_w = (18000 * (m_w & 65535) + (m_w >>> 16)) & mask;
            var result = ((m_z << 16) + (m_w & 65535)) >>> 0;
            result /= 4294967296;
            return result;
        };
    }
    function getNameFromId(id) {
        let name = '';
        let rng = RandomSeed(id);
        let firstPull = rng();
        for (let i = 0; i < nameTemplates.length; ++i) {
            const part = nameTemplates[i];
            let index = Math.floor(rng() * part.length);
            name += part[index];
        }
        console.log(id, '->', name, '| first pull ->', firstPull);
        return name;
    }
    const axiosGame = axios_1.default.create({
        baseURL: gameSrvUrl,
    });
    const becomeChefButton = document.createElement('Button');
    becomeChefButton.id = "chefButton";
    becomeChefButton.textContent = "I'm the chef";
    becomeChefButton.addEventListener('click', (event) => {
        axiosGame.put(`/chefId/${playerId}`);
    });
    function refresh() {
        return __awaiter(this, void 0, void 0, function* () {
            if (playerId && !pauseRefresh) {
                const res = yield axiosGame.get(`/refresh/${playerId}`);
                console.log(res);
                const srvChef = Number(res.data.chefId);
                if (res.data.question) {
                    question = res.data.question;
                    questionLabel.textContent = question;
                }
                else {
                    questionLabel.textContent = '';
                }
                if (srvChef !== chefId) {
                    chefId = srvChef;
                    if (chefId) {
                        if (chefId === playerId) {
                            chefLabel.replaceChildren("you're the chef");
                        }
                        else {
                            chefLabel.replaceChildren(`Chef is ${getNameFromId(chefId)}`);
                        }
                    }
                    else {
                        chefLabel.replaceChildren(becomeChefButton);
                        setVisibility(emojiPicker, false);
                    }
                }
                setVisibility(playerLabel, chefId !== 0);
                hintNumber = res.data.hintNumber;
                hints = res.data.hints;
                if (chefId === playerId) {
                    if (hintNumber === 0) {
                        setVisibility(hintPicker, true);
                        setVisibility(nextRoundButton, false);
                    }
                    else {
                        setVisibility(hintPicker, false);
                        setVisibility(emojiPicker, hints.length < hintNumber);
                        setVisibility(nextRoundButton, hints.length >= hintNumber);
                    }
                }
                else {
                    setVisibility(nextRoundButton, false);
                }
                if (hintNumber === 0) {
                    setVisibility(hintHolder, false);
                    setVisibility(responsesHolder, false);
                }
                else {
                    setVisibility(hintHolder, true);
                    if (hintHolder.childNodes.length !== hintNumber) {
                        let hintItems = [];
                        for (let i = 0; i < hintNumber; ++i) {
                            const hint = document.createElement('div');
                            hint.id = "hint";
                            hintItems.push(hint);
                        }
                        hintHolder.replaceChildren(...hintItems);
                    }
                    for (let i = 0; i < hintNumber; ++i) {
                        const hintItem = hintHolder.childNodes[i];
                        if (i < hints.length) {
                            let emo = document.createElement('p');
                            emo.textContent = hints[i];
                            hintItem.replaceWith(emo);
                        }
                        else {
                            hintItem.replaceWith("");
                        }
                    }
                    setVisibility(responsesHolder, playerId !== chefId);
                }
            }
            setTimeout(refresh, refreshRate);
        });
    }
    console.log("Hello module");
    window.addEventListener("load", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Hello loaded");
        const res = yield axiosGame.get('/');
        console.log(res);
        playerId = res.data.playerId;
        responses = res.data.responses;
        nameTemplates = res.data.nameTemplates;
        playerLabel.replaceChildren(`You're ${getNameFromId(playerId)}`);
        chefLabel.appendChild(becomeChefButton);
        let responsesBtn = [];
        for (let i = 0; i < responses.length; ++i) {
            const index = i;
            const responseButton = document.createElement('button');
            responseButton.textContent = responses[index];
            responseButton.addEventListener('click', () => {
                axiosGame.put(`/response/${playerId}/${index}`);
            });
            responsesBtn.push(responseButton);
        }
        responsesHolder.replaceChildren(...responsesBtn);
        refresh();
    }));
    setVisibility(emojiPicker, false);
    setVisibility(hintPicker, false);
    let resetButton = document.getElementById("reset");
    resetButton.addEventListener('click', (event) => {
        axiosGame.put('/reset');
    });
    let pauseButton = document.getElementById('pause');
    pauseButton.addEventListener('click', () => {
        pauseRefresh = !pauseRefresh;
    });
    let hintBtns = [];
    for (let i = 0; i < 7; ++i) {
        let index = i + 1;
        const btn = document.createElement('button');
        btn.textContent = '' + index;
        btn.addEventListener('click', (event) => {
            axiosGame.put(`/hintNumber/${index}`);
        });
        hintBtns.push(btn);
    }
    document.getElementById('hintPickerHolder').replaceChildren(...hintBtns);
    emojiPicker.addEventListener('emoji-click', (event) => {
        const cevent = event;
        axiosGame.put(`/hint/${cevent.detail.unicode}`);
    });
    nextRoundButton.addEventListener('click', (event) => {
        axiosGame.put('/nextRound');
    });
});
