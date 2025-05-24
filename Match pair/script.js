const gameArea = document.querySelector('#gameArea');
const mainScreen = document.getElementById("mainScreen")
const gameScreen = document.getElementById("gameScreen")
const mainRankings = document.getElementById("mainRankings")  
let counter;

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
    counter++;
    const clickedCard = e.currentTarget;
    clickedCard.classList.toggle("flipped");
};

function CheckCards(counter)
{

}

btnGameStart.addEventListener('click',StartGame);
btnRankings.addEventListener('click',ShowRankings);
btnRestartGame.addEventListener('click',RestartGame);
