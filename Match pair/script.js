const gameArea = document.querySelector('#gameArea');
const mainScreen = document.getElementById("mainScreen")
const gameScreen = document.getElementById("gameScreen")
const mainRankings = document.getElementById("mainRankings")  
const insertData = document.getElementById("insertData")  
let firstCard;
let secondCard;
let counter=0;
let lockGame;
let timerID;
let gameTime = 0;           
let gameTimerInterval = null;  
let moves = 0;       
let nick;   


function StartGame(){
    CreateCards();
    mainScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
};

function ShowRankings(){
    mainScreen.classList.add('hidden');
    mainRankings.classList.remove('hidden');
}

function CreateCards(){

    const pairs = RandomizePairs();

    for (let i = 0; i < 16; i++) {
        const card = document.createElement('div');
        card.classList.add("card");
        gameArea.appendChild(card);

        card.dataset.letter = pairs[i];
        card.innerText = pairs[i];

        card.addEventListener('click', FlipCard);
    }
};

function RandomizePairs(){
    const letters = ['A','B','C','D','E','F','G','H'];

    let pairs = [...letters, ...letters];

    pairs.sort(() => Math.random() - 0.5);

    return pairs;
}

function RestartGame(){
    DeleteCards();
    DeleteListnerFromCards();
    CreateCards();
    RestartGameTimer();
    counter=0;
}

function DeleteListnerFromCards()
{
    const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
        card.removeEventListener('click', FlipCard);
    });
}


function DeleteCards(){
    document.getElementById("gameArea").innerHTML="";
}

function FlipCard(e){
    
    if(!gameTimerInterval)
        StartGameTimer();

    if(lockGame) return;

    const clickedCard = e.currentTarget;

    if (clickedCard === firstCard || clickedCard.classList.contains('flipped')) return;

    clickedCard.classList.add("flipped");

     if (!firstCard){
        firstCard = clickedCard;
        return;
    }

    secondCard = clickedCard;
    lockGame = true;

    CheckCards();
};

function CheckCards(){
    CountingMoves();
    if(firstCard.dataset.letter === secondCard.dataset.letter){
        firstCard.removeEventListener('click', FlipCard);
        secondCard.removeEventListener('click', FlipCard);
        ResetBoard();
        counter++;
        if(counter==8)
            GameEnding();
    }
    else{
        timerID = setTimeout(() => {
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                ResetBoard();
            }, 1000);
    }
    console.log(counter);
}

function CountingMoves()
{
    moves++;
    document.getElementById("moves").innerText = 'Moves: ' + moves;
}

function ResetBoard() {
    [firstCard, secondCard] = [null, null];
    lockGame = false;
    clearTimeout(timerID);
}

function GameEnding(){
    console.log("koniec");
    mainScreen.classList.add('hidden');
    insertData.classList.remove('hidden');
    RestartGameTimer()
}

 function StartGameTimer(){
    gameTime = 0;
    document.getElementById("timer").innerText = "Time: 0 s";

    gameTimerInterval = setInterval(() => {
        gameTime++;
        document.getElementById("timer").innerText = 'Time: ' + gameTime + 's';
    }, 1000);
 }

 function RestartGameTimer(){
    document.getElementById("timer").innerText = "Time: 0 s";
    clearInterval(gameTimerInterval);
    gameTimerInterval=null;
    document.getElementById("moves").innerText = "Moves: 0";
}
function GetNick(){
    nick = document.getElementById("nick").value.trim();
}
 
btnGameStart.addEventListener('click',StartGame);
btnRankings.addEventListener('click',ShowRankings);
btnRestartGame.addEventListener('click',RestartGame);
btnSubmit.addEventListener('click',GetNick);
