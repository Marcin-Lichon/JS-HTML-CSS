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
    GetDataForInGameRank();
    CreateCards();
    mainScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
};

function ShowRankings(){
    mainScreen.classList.add('hidden');
    mainRankings.classList.remove('hidden');
    GetDataForRanking();
}

function ReturnToMenu(){
    mainScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    mainRankings.classList.add('hidden');
    insertData.classList.add('hidden');
    DeleteListnerFromCards();
    DeleteCards();
    RestartGameStats();
    counter=0;
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
    DeleteListnerFromCards();
    DeleteCards();
    CreateCards();
    RestartGameStats();
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
        ResetingBoard();
        counter++;
        if(counter==8)
            GameEnding();
    }
    else{
        timerID = setTimeout(() => {
                firstCard.classList.remove("flipped");
                secondCard.classList.remove("flipped");
                ResetingBoard();
            }, 1000);
    }
}

function CountingMoves()
{
    moves++;
    document.getElementById("moves").innerText = 'Moves: ' + moves;
}

function ResetingBoard() {
    [firstCard, secondCard] = [null, null];
    lockGame = false;
    clearTimeout(timerID);
}

function GameEnding(){
    mainScreen.classList.add('hidden');
    insertData.classList.remove('hidden');
    ShowEndingStats();
    DeleteListnerFromCards();
}

 function StartGameTimer(){
    gameTime = 0;   

    gameTimerInterval = setInterval(() => {
        gameTime++;
        document.getElementById("timer").innerText = 'Time: ' + gameTime + 's';
    }, 1000);
 }

 function RestartGameStats(){
    document.getElementById("timer").innerText = "Time: 0 s";
    document.getElementById("moves").innerText = "Moves: 0";
    clearInterval(gameTimerInterval);
    gameTimerInterval = null;
    moves=0;
    gameTime=0;
}

function ShowEndingStats(){
    document.getElementById("timer").innerText = "Time:" +gameTime+ "s";
    document.getElementById("moves").innerText = "Moves: " + moves;
    clearInterval(gameTimerInterval);
    gameTimerInterval=null;
}

function GetNick(){
    nick = document.getElementById("nick").value.trim();

      if (!nick) {
        alert("Wprowadź nick!");
        return; 
    }
    
    SaveDataInAPI();
}



function GetDataForInGameRank(){
    ShowLoader();
    fetch("/api/scores")
        .then((res)=>res.json())
        .then((data)=>{
         const rankingList = document.getElementById("inGameRakings");
            rankingList.innerHTML = "";  

            data.forEach(entry => {       
                const rankingEntry = document.createElement("div");
                rankingEntry.classList.add("rankingEntry");

                const rankingText = document.createElement("div");
                rankingText.classList.add("rankingText");
                rankingText.textContent = `${entry.name} - ${entry.moves} ruchy, ${entry.time}s`;

                rankingEntry.appendChild(rankingText);
                rankingList.appendChild(rankingEntry);
            });
        })
        .catch((error) =>{
            ShowError("Check your connection with server");
        }).finally(()=>{
             HideLoader();
        });
}


function GetDataForRanking(){
    ShowLoader();
    fetch("/api/scores")
        .then((res) => res.json())
        .then((data) => {
            const rankingList = document.getElementById("rankings");
            rankingList.innerHTML = "";  

            data.forEach(entry => {       
                const rankingEntry = document.createElement("div");
                rankingEntry.classList.add("rankingEntry");

                const rankingText = document.createElement("div");
                rankingText.classList.add("rankingText");
                rankingText.textContent = `${entry.name} - ${entry.moves} ruchy, ${entry.time}s`;

                const deleteButtons = document.createElement("div");
                deleteButtons.classList.add("deleteButton");

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";

                 const handler = function () {
                    DeleteData(entry.id, handler, deleteBtn);
                };

                deleteBtn.addEventListener('click', handler);
             
                deleteButtons.appendChild(deleteBtn);

                rankingEntry.appendChild(rankingText);
                rankingEntry.appendChild(deleteButtons);
                rankingList.appendChild(rankingEntry);
            });
        })
        .catch((error) =>{
            ShowError("Check your connection with server");
        })
        .finally(()=>{
             HideLoader();
        });
}

function SaveDataInAPI(){
    ShowLoader();
    fetch("/api/scores", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({name: nick, moves, time: gameTime}),
        }).then(()=>{
            RestartGameStats()
        })
        .catch((error) =>{
            ShowError("Check your connection with server");
        })
        .finally(()=>{
            HideLoader();
        });
}



function DeleteData(id, handler, deleteBtn){
    ShowLoader();
    fetch(`/api/scores/${id}`, { method: "DELETE" })
        .then(() => {
            deleteBtn.removeEventListener('click', handler);
            GetDataForRanking();
        })
        .catch((error) =>{
            ShowError("Check your connection with server");
        }).finally(()=>{
             HideLoader();
        });
}

function ShowError(message) {
    alert("Error: " + message);
}

function ShowLoader() {
    document.getElementById('loader').classList.remove('hidden');
}

function HideLoader() {
    document.getElementById('loader').classList.add('hidden');
}


btnGameStart.addEventListener('click',StartGame);
btnRankings.addEventListener('click',ShowRankings);
btnRestartGame.addEventListener('click',RestartGame);
btnSubmit.addEventListener('click',GetNick);
btnBackToMenuFromGame.addEventListener('click', ReturnToMenu);
btnBackToMenuFromRanking.addEventListener('click', ReturnToMenu);
