//DOM
const body  = document.querySelector(".wrapper");
const playground = document.querySelector(".playground > ul");
const gameFrame = document.querySelector(".game-frame");
const gamePlay = document.querySelector(".game-play");
const playView = document.querySelector(".play-view");
const settingView = document.querySelector(".setting-view");
const gameOverView = document.querySelector(".gameover-view");
const mouseFocus = document.querySelector(".mouse-focus");
const energy = document.querySelector(".energy");

//button
const gamePlayButton = document.querySelector(".play-button > img");
const resetButton = document.querySelector(".reset-button > img");
const homeWhiteButton = document.querySelector(".home-white-button > img");
const homeButton = document.querySelector(".home-button > img");
const setWhiteButton = document.querySelector(".set-white-button > img");
const setButton = document.querySelector(".set-button > img");
const bgmSetting = document.querySelector(".bgm-setting");
const audioSetting = document.querySelector(".audio-setting");
const vibrationSetting = document.querySelector(".vibration-setting");

//text
const timeText  = document.querySelector(".time");
const scoreText = document.querySelector(".score");
const overScoreText = document.querySelector(".over-score");
const overTimeText  = document.querySelector(".over-time");
const rankTitle = document.querySelector(".rank-title");

//audio
const bgm = document.getElementById("bgm");
const audio = document.getElementById("audio");
const gameover = document.getElementById("gameover");

//rank
const rankJoinView = document.querySelector(".rank-join-view");

//Setting 
const GAME_ROWS = 10;
const GAME_COLS = 20;

//Variables
let duration  = 40;
let energyNumber = 0;
let score = 0;
let time  = 0;
let timeInterval;
let energyInterval;
let startX;
let startY;
let focusObj = {
    left : 0, 
    top : 0,
    width : 0,
    height : 0,
}
let succeseArr = [];
let buldCount = 0;
let gameOverFlag = false;
let energyVibration = false;
let audioFlag = true;
let mouseFlag = false;

let energyBarHeight = energy.offsetHeight;


//효과음
function audioPlayControll(audioType){
    if(audioFlag){
        audioType.play();

        setTimeout(()=>{
            audioType.pause();
            audioType.currentTime = 0;
        },1000)
    }
}

function gamePlayButtonClick(){
    gamePlay.style.display = "none";
    init()
    setTimeInterval()
    setEnergyInterval()
}

function resetButtonClick(){
    init()
}

function init(){
    playground.innerHTML = "";
    for(let i = 0 ; i < GAME_ROWS ; i++){
        const li = document.createElement("li");
        const ul = document.createElement("ul");
        for(let j = 0 ; j < GAME_COLS ; j++){
            const matrix = document.createElement("li");
            const randomNumber = Math.floor(Math.random() * 9)+1;
            matrix.style.backgroundImage = `url(../images/num_${randomNumber}.png)`;
            matrix.style.backgroundSize = "cover";
            matrix.classList.add("number");
            matrix.accessKey = randomNumber;
            ul.prepend(matrix);
        }
    
        li.prepend(ul);
        playground.prepend(li);
    }
}

//시간 ++
function setTimeInterval(){
    clearInterval(timeInterval);
    timeInterval = setInterval(()=>{
        time++;
        timeText.innerText = time;
        setLevel()
    },1000)
}
//시간이 지날수록 duration을 작게하여 어렵게 하는작업
function setLevel(){
    if(duration > 2){
        if(time % 20 === 0){
            duration--;
            energyBarInterval()
        }
    }
}
function setEnergyInterval(){
    clearInterval(energyInterval);
    energyInterval = setInterval(()=>{
        energy.style.top = energyNumber+"px";
        energyNumber ++;
        if(!energyVibration){
            setTimeout(()=>{
                setEnergyColor(energyNumber);
            },0)
        }
        setTimeout(()=>{
            checkEnergyBox(energyNumber);
        })
    },duration)
}

//energy 의 color를 변경하여 얼마 안남았음을 알려줌
function setEnergyColor(energyNumber){
    const energyAbs = Math.abs(energyNumber);
    if( Math.floor(energyBarHeight / 2)  < energyAbs){
        energy.style.backgroundColor = "red";
        energyVibration = true;
        energyAnimation()
    }
}
//energy animation
function energyAnimation(){
    energy.classList.add("vibration");
}
//energybar가 끝나면 게임종료
function checkEnergyBox(energyNumber){
    if((energyBarHeight - energyNumber) < 10){
        clearInterval(energyInterval);
        clearInterval(timeInterval);
        showGameOverText();
    }
}

//gameover
function showGameOverText(){
    audioPlayControll(gameover)

    let prams = {
        flag  :"rankSelect",
        score : score,
        time  : time,
        count : buldCount,
    }

    $.ajax({
        url:"/php/rank.php",
        method:"POST",
        data: prams,
        erro:function(){
            alert("error");
        },
        success:function(data){
            if(data < 100){
                rankJoinView.style.display = "flex";
                rankTitle.innerText = (Number(data)+1)+"등 입니다.";
            }else{
                rankJoinView.style.display = "none";
            }
            overScoreText.innerText = `SCORE : ${score}`;
            overTimeText.innerText = `TIME : ${time}s`;
            playView.style.display = "none";
            settingView.style.display = "none";
            gamePlay.style.display = 'flex';
            gameOverView.style.display = 'flex';
            gameOverFlag = true;
        }
    });
}

function reSet(){
    clearInterval(energyInterval);
    clearInterval(timeInterval);
    duration  = 40;
    energyNumber = 0;
    score = 0;
    time  = 0;
    succeseArr = [];
    buldCount = 0;
    gameOverFlag = false;
    energyVibration = false;
    energyBarHeight = energy.offsetHeight;
    startX;
    startY;
    scoreText.innerText = 0;
    timeText.innerText = 0;
    energy.style.top = 0;
    energy.style.backgroundColor = "rgb(255, 166, 0)";
    energy.classList.remove("vibration");
}

function homeButtonClick(){
    reSet()
    settingView.style.display = "none";
    gameOverView.style.display = "none";
    gamePlay.style.display = "flex";
    playView.style.display = "flex";
}
function setButtonClick(){
    reSet()
    playView.style.display = "none";
    gameOverView.style.display = "none";
    gamePlay.style.display = "flex";
    settingView.style.display = "flex";
}
function settingEventClick(flag){
    reSet()
    if(flag == "A"){
        if(bgmSetting.classList.contains("on")){
            bgmSetting.classList.remove("on");
            bgmSetting.style.backgroundImage = `url(../images/bgm_off.png)`;
            bgm.play();
        }else{
            bgmSetting.classList.add("on");
            bgmSetting.style.backgroundImage = `url(../images/bgm_on.png)`;
            bgm.pause();
            bgm.currentTime = 0;
        }
    }else if(flag == "B"){
        if(audioSetting.classList.contains("on")){
            audioSetting.classList.remove("on");
            audioSetting.style.backgroundImage = `url(../images/audio_off.png)`;
            audioFlag = true;
        }else{
            audioSetting.classList.add("on");
            audioSetting.style.backgroundImage = `url(../images/audio_on.png)`;
            audioFlag = false;
        }
    }else{
        if(vibrationSetting.classList.contains("on")){
            vibrationSetting.classList.remove("on");
            vibrationSetting.style.backgroundImage = `url(../images/vibration_off.png)`;
        }else{
            vibrationSetting.classList.add("on");
            vibrationSetting.style.backgroundImage = `url(../images/vibration_on.png)`;
        }
    }
}

//li 가 mosemove 좌표 범위 안에 있는지 check
//javascipt로 좌표 가져오는 것을 못해서 jquery 사용
function rangeSelect(x1, y1, x2, y2){
    const selector = ".playground ul li ul li";
    $(selector).each(function() {
        const $this = $(this);
        const offset = $this.offset();
        const x = offset.left;
        const y = offset.top;
        const w = $this.width() *0.1;
        const h = $this.height() *0.1;
        
        if(x >= x1-20 && y >= y1-20 && x + w <= x2 && y + h <= y2){
            $this.addClass('focus-on');
            window.navigator.vibrate(50);
        }else{
            $this.removeClass('focus-on');
        }
    });
}

//해당 범위에 속해있는 li 의 key값의 합이 10인지 아닌지 check
function checkMatch(){
    const childNodes = playground.childNodes;
    let sumNumber = 0;
    succeseArr = [];
    childNodes.forEach(child=>{
        child.children[0].childNodes.forEach(li=>{
            if(li.classList.contains("focus-on") && !li.classList.contains("seized")){
                sumNumber += Number(li.accessKey);
                succeseArr.push(li);
            }
        })
    })
    
    if(sumNumber === 10){
        let plusJumsu = 1;
        succeseArr.forEach((element,index)=>{
            element.classList.add("seized");
            //한번에 많은 li를 깨면 점수 더 줌
            if(index > 7){
                plusJumsu = 10;
            }else if(index > 5){
                plusJumsu = 7;
            }else if(index > 2){
                plusJumsu = 5;
            }else{
                plusJumsu = 1;
            }
            score += (5*plusJumsu);
            buldCount++;
        })
        scoreText.innerText = score;
        energyNumber = 0;
        energy.style.top = 0;
        energy.style.backgroundColor = "rgb(255, 166, 0)";
        energy.classList.remove("vibration");
        imagechenged = false;
        audioPlayControll(audio)
    }else{
        setTimeout(()=>{
            resetSeleter()
        },0)
    }
}
//해당 범위의 합이 10이 아닌경우 다시 class 제거
function resetSeleter(){
    const childNodes = playground.childNodes;
    childNodes.forEach(child=>{
        child.children[0].childNodes.forEach(li=>{
            if(li.classList.contains("focus-on")){
                li.classList.remove("focus-on");
            }
        })
    })
}


//Event
gamePlayButton.addEventListener("click",()=>{
    gamePlayButtonClick()
})
resetButton.addEventListener("click",()=>{
    resetButtonClick()
})
homeWhiteButton.addEventListener("click",()=>{
    homeButtonClick()
})
homeButton.addEventListener("click",()=>{
    homeButtonClick()
})
setWhiteButton.addEventListener("click",()=>{
    setButtonClick()
})
setButton.addEventListener("click",()=>{
    setButtonClick()
})
bgmSetting.addEventListener("click",()=>{
    settingEventClick("A")
})
audioSetting.addEventListener("click",()=>{
    settingEventClick("B")
})
vibrationSetting.addEventListener("click",()=>{
    settingEventClick("C")
})

//=========pc===========================
//mousedown
function mouseDownEvent(e){
    mouseFlag = true;
    startX = e.clientX;
    startY = e.clientY;
    focusObj.width  = 0;
    focusObj.height = 0;
    mouseFocus.style.display = "flex";
}
//mousemove
function mouseMoveEvent(e){
    const x = e.clientX;
    const y = e.clientY;
    focusObj.width = Math.max(x - startX, startX - x);
    focusObj.left  = Math.min(startX, x);
    focusObj.height = Math.max(y - startY, startY - y);
    focusObj.top = Math.min(startY, y); 
    const wlSum = focusObj.width + focusObj.left;
    const htSum = focusObj.height + focusObj.top;
    
    mouseFocus.style.width = focusObj.width+"px";
    mouseFocus.style.left = focusObj.left+"px";
    mouseFocus.style.height = focusObj.height+"px";
    mouseFocus.style.top = focusObj.top+"px";

    setTimeout(()=>{
        //범위안에 있는지 check
        rangeSelect(focusObj.left,focusObj.top,wlSum,htSum);
    },0)
}
//mouseup
function mouseUpEvent(e){
    mouseFlag = false;
    mouseFocus.style.display = "none";
    mouseFocus.style.width = "0px";
    mouseFocus.style.height = "0px";
    //범위안에 있는 값이 10인지 확인하는 함수
    checkMatch()
}
function throttle(callback, limit = 500) {
    let waiting = false
    return function() {
        if(!waiting) {
            callback.apply(this, arguments)
            waiting = true
            setTimeout(() => {
                waiting = false
            }, limit)
        }
    }
}


body.addEventListener("mousedown",(e)=>{
    if(gameOverFlag) return;
    mouseDownEvent(e)
})

//mousemove는 메모리를 많이 잡아먹어서 throttle 라이브러리 사용
body.addEventListener("mousemove",throttle((e)=>{
    if(!mouseFlag) return false;
    
    mouseMoveEvent(e)
}, 0))


window.addEventListener("mouseup",(e)=>{
    mouseUpEvent(e)
})

//mouseup 이벤트가 발생되지 않았을 시 대비
body.addEventListener("click",(e)=>{
    if(!mouseFlag) return false;
    mouseUpEvent()
})

//=========mobile===========================

// [모바일 : 터치 시작 내부 함수 - (주의) 클릭 이벤트와 겹칠 수 있음]
function handleStart(evt) {
    if(gameOverFlag) return;

    mouseFlag = true;
    startX = evt.changedTouches[0].clientX;
    startY = evt.changedTouches[0].clientY;
    focusObj.width  = 0;
    focusObj.height = 0;
    mouseFocus.style.display = "flex";
};


// [모바일 : 터치 이동 내부 함수]
function handleMove(evt) {
    if(gameOverFlag) return;

    const x = evt.changedTouches[0].clientX;
    const y = evt.changedTouches[0].clientY;
    focusObj.width = Math.max(x - startX, startX - x);
    focusObj.left  = Math.min(startX, x);
    focusObj.height = Math.max(y - startY, startY - y);
    focusObj.top = Math.min(startY, y); 
    const wlSum = focusObj.width + focusObj.left;
    const htSum = focusObj.height + focusObj.top;
    mouseFocus.style.width = focusObj.width+"px";
    mouseFocus.style.left = focusObj.left+"px";
    mouseFocus.style.height = focusObj.height+"px";
    mouseFocus.style.top = focusObj.top+"px";

    setTimeout(()=>{
        //범위안에 있는지 check
        rangeSelect(focusObj.left,focusObj.top,wlSum,htSum);
    },0)
};


// [모바일 : 터치 종료 내부 함수] 
function handleEnd(evt) {

    mouseFlag = false;
    mouseFocus.style.display = "none";
    mouseFocus.style.width = "0px";
    mouseFocus.style.height = "0px";
    //범위안에 있는 값이 10인지 확인하는 함수
    setTimeout(()=>{
        checkMatch()
    },0)
    
};


body.addEventListener("touchstart",handleStart,false);
body.addEventListener("touchmove",handleMove,false);
body.addEventListener("touchend",handleEnd,false);