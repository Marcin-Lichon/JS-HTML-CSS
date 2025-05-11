let currentScore=0;
let currentCircle;

function startGame(){
    const btStart = document.getElementById("btStart");
    const btRestart = document.getElementById("btRestart");
    const gameScreen = document.getElementById('gameScreen');
    const startScreen = document.getElementById('startScreen');
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    addTarget();
}

function addTarget()
{
    const circle = document.createElement('div');
    circle.classList.add('circle');
    const gameArea = document.getElementById('game');
    gameArea.appendChild(circle);
    currentCircle=circle;

    currentCircle.addEventListener('click', ()=> {
        circleHit();
        circleRemove();
    });
}

function circleRemove()
{
    if(currentCircle)
    {
        currentCircle.remove();
        currentCircle = null;
    }
}

function circleHit()
{
    currentScore++;
    const scoreSpan = document.getElementById("scoreSpan");
    scoreSpan.textContent = currentScore;

}



btStart.addEventListener('click',startGame);