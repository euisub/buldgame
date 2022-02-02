//DOM
const body  = document.querySelector(".wrapper");
const resetBtn  = document.querySelector(".reset-btn");
const energyBar = document.querySelector(".energy-bar");
const energyImg = document.querySelector(".energy");
const playground = document.querySelector(".playground > ul");
const mouseFocus = document.querySelector(".mouse-focus");
const gameText = document.querySelector(".game-text")
const restartButton = document.querySelector(".game-text > button")
const scoreDisplay = document.querySelector(".score")
const scoreText = document.querySelector(".score-text")
const timeText = document.querySelector(".time-text")

//audio
const audio = document.getElementById("audio");
const audioPlay = document.getElementById("audio-play");

audio.volume = 0.01;

//Setting 
const GAME_ROWS = 14;
const GAME_COLS = 10;

//Variables
let scoreNumber = 0;
let duration  = 30;
let mouseFlag = false;
let startX;
let startY;
let focusObj = {
    left : 0, 
    top : 0,
    width : 0,
    height : 0,
}
let succeseArr = [];
let energyNumber = 0;
let time = 0;
let timeInterval;
let energyInterval;
const energyBarWidth = energyBar.offsetWidth;
let imagechenged = false;
let gameOverFlag = false;

init()
setTimeInterval()
energyBarInterval()

function init(){
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

//효과음
function audioPlayControll(){
    audioPlay.play();

    setTimeout(()=>{
        audioPlay.pause();
        audioPlay.currentTime = 0;
    },200)
}

//시간 ++
function setTimeInterval(){
    clearInterval(timeInterval);
    timeInterval = setInterval(()=>{
        time++;
        setLevel()
    },1000)
}
//시간이 지날수록 duration을 작게하여 어렵게 하는작업
function setLevel(){
    if(duration > 2){
        if(time % 10 === 0){
            duration -= 2;
            energyBarInterval()
        }
    }
}
//duration 마다 energyBar 왼쪽으로 이동
function energyBarInterval(){
    clearInterval(energyInterval);
    energyInterval = setInterval(()=>{
        energyImg.style.left = energyNumber+"px";
        energyNumber --;
        if(!imagechenged){
            setEnergyColor(energyNumber);
        }
        checkEnergyBox(energyNumber);
    },duration)
}
//energy 의 color를 변경하여 얼마 안남았음을 알려줌
function setEnergyColor(energy){
    const energyAbs = Math.abs(energy);
    if( Math.floor(energyBarWidth / 2) -30 < energyAbs){
        energyImg.src = "images/energy-red.png";
        imagechenged = true;
        energyAnimation()
    }
}
//energy animation
function energyAnimation(){
    energyImg.classList.add("vibration");
}
//energybar가 끝나면 게임종료
function checkEnergyBox(energy){
    if((energyBarWidth + energy) < 30){
        clearInterval(energyInterval);
        clearInterval(timeInterval);
        showGameOverText();
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
            scoreNumber += (5*plusJumsu);
        })
        scoreDisplay.innerText = scoreNumber;
        energyNumber = 0;
        energyImg.src = "images/energy.png";
        energyImg.classList.remove("vibration");
        imagechenged = false;
        audioPlayControll()
    }else{
        resetSeleter()
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

//gameover
function showGameOverText(){
    scoreText.innerText = `SCORE : ${scoreNumber}`;
    timeText.innerText = `TIME : ${time}s`;
    gameText.style.display = 'flex';

    gameOverFlag = true;
}
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
    //범위안에 있는지 check
    rangeSelect(focusObj.left,focusObj.top,wlSum,htSum);
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

//Event
body.addEventListener("mousedown",(e)=>{
    if(gameOverFlag) return;

    mouseDownEvent(e)
})

//mousemove는 메모리를 많이 잡아먹어서 throttle 라이브러리 사용
body.addEventListener("mousemove",_.throttle(function (e){
    if(!mouseFlag) return false;
    mouseMoveEvent(e)
}, 100))


window.addEventListener("mouseup",(e)=>{
    mouseUpEvent(e)
})

//mouseup 이벤트가 발생되지 않았을 시 대비
body.addEventListener("click",(e)=>{
    if(!mouseFlag) return false;
    mouseUpEvent()
})
//재생성
resetBtn.addEventListener("click",()=>{
    playground.innerHTML = "";
    //재생성 버튼 클릭 할 시간을 좀 주기위함
    energyNumber += 5;
    init();
})
//다시시작
restartButton.addEventListener("click",()=>{
    playground.innerHTML = "";
    gameText.style.display = "none";

    //초기화 
    init()
    scoreNumber = 0;
    time = 0;
    energyNumber = 0;
    duration = 20;
    mouseFlag = false;
    imagechenged = false;
    setTimeInterval()
    energyBarInterval()
    scoreDisplay.innerText = "0";
    energyImg.src = "images/energy.png";
    energyImg.classList.remove("vibration");
    gameOverFlag = false;

})
