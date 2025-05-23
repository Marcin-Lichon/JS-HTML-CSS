const container = document.querySelector('#gameArea');
const mainScreen = document.getElementById("mainScreen")
const gameScreen = document.getElementById("gameScreen")
const mainRankings = document.getElementById("mainRankings")  

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

    for (let i = 0; i < 16; i++) {
        const box = document.createElement('div');
        box.className = 'card';
        box.textContent = `Box ${i + 1}`;
        container.appendChild(box);
    }
};



btnGameStart.addEventListener('click',StartGame);
btnRankings.addEventListener('click',ShowRankings);