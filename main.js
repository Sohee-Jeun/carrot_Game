'use strict';

const CARROT_SIZE = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 10;

const field = document.querySelector('.game__field');
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__timer');
const gameScore = document.querySelector('.game__score');

const popUp = document.querySelector('.pop-up');
const popUPText = document.querySelector('.pop-up__message');
const popUpRefresh = document.querySelector('.pop-up__refresh');

const carrotSound = new Audio('./carrot/sound/carrot_pull.mp3');
const alertSound = new Audio('./carrot/sound/alert.wav');
const bgSound = new Audio('./carrot/sound/bg.mp3');
const bugSound = new Audio('./carrot/sound/bug_pull.mp3');
const winSound = new Audio('./carrot/sound/game_win.mp3');

let started = false;
let score = 0;
let timer = undefined;

field.addEventListener('click', onFieldClick); //(event) => onFieldClick(evnet);

gameBtn.addEventListener('click', ()=>{
    if(started){
        stopGame();

    }else{
        startGame();
    }
});

function startGame(){
    playSound(bgSound);
    started = true;
    initGame();
    showStopButton();
    showTimerAndScore(); 
    startGameTimer();
}

function stopGame(){
    started = false;
    stopGameTimer();
    hideGameButton();
    showPopUpWithText('Replay?');
    playSound(alertSound);
    stopSound(bgSound);

}

function finishGame(win){
    started = false;
    hideGameButton();
    stopGameTimer();
    if(win){
        playSound(winSound);
    } else {
        playSound(alertSound);
    }
    stopSound(bgSound);
    showPopUpWithText(win? 'YOU WON 😆' : 'YOU LOST 😛');
}
function showStopButton(){
    const icon = gameBtn.querySelector('.fas');
    icon.classList.add('fa-stop');
    icon.classList.remove('.fa-play');
    gameBtn.style.visibility= 'visible';
}

function hideGameButton(){
    gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore(){
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';

};

function startGameTimer(){
    let remainingTimeSec = GAME_DURATION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(()=> {
      if(remainingTimeSec <= 0){
          clearInterval(timer);
          finishGame(CARROT_COUNT === score);
          return;
      }
      updateTimerText(--remainingTimeSec);
    },1000);
}
function stopGameTimer(){
    clearInterval(timer);
}

function updateTimerText(time){
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerHTML = `${minutes}:${seconds}`;
}

function showPopUpWithText(text){
popUPText.innerText = text;
popUp.classList.remove('pop-up--hide');
}

popUpRefresh.addEventListener('click', ()=>{
    startGame();
    hidePopup();
   
});

function hidePopup(){
    popUp.classList.add('pop-up--hide');
}

function initGame(){
    score = 0;
    field.innerHTML ='';
    gameScore.innerText = CARROT_COUNT;
    //벌레와 당근을 생성한 뒤 field에 추가해줌
    addItem('carrot', 10, '/carrot/img/carrot.png');
    addItem('bug',10,'/carrot/img/bug.png');
}

function onFieldClick(event){
    
    if(!started){
        return;
    }
    const target = event.target;
    if(target.matches('.carrot')){
        //당근!
        target.remove();
        score++;
        playSound(carrotSound);
        updateScoreBoard();
        if(score === CARROT_COUNT){
            finishGame(true);
        }
    } else if(target.matches('.bug')){
        //벌레!
        playSound(bugSound);

        finishGame(false);
    };
}

function updateScoreBoard(){
    gameScore.innerText = CARROT_COUNT - score;
}

function playSound(sound){
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound){
    sound.pause();
}
function addItem(className, count, imgPath){
    //클래스의 이름과 개수 그리고 이미지의 경로를 추가해준다.
    const x1 = 0;
    const y1 = 0;
    const x2= fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;
    for(let i = 0; i<count; i++){
        const item = document.createElement('img');
        item.setAttribute('class', className);
        item.setAttribute('src', imgPath); 
        item.style.position = 'absolute';
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item);
    }
}

function randomNumber(min, max){
    return Math.random() * (max - min) + min;
}