if (localStorage.getItem('bestScore') === null) {
    localStorage.setItem('bestScore', 0);
}
let isGameOver = false; 

function startGame(){
    const gameScreen = document.getElementById('gameScreen');
    const startScreen = document.getElementById('startScreen');

    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    addTarget();
}

function restartGame(){
    isGameOver = false;
    const gameScreen = document.getElementById('gameScreen');
    const scoreScreen = document.getElementById('scoreScreen');

    gameScreen.classList.add('hidden');
    scoreScreen.classList.remove('hidden');

    currentScore = 0;

    document.getElementById("scoreSpan").textContent = 0;
    document.getElementById("scoreLives").textContent = 3;

    circleRemove();
    addTarget();
}

gameArea.addEventListener('click', (event) => {
    if (!event.target.classList.contains('circle')) {
        console.log("Kliknięto poza kółkiem! Kliknięcia:");
        circleMiss();
    }
});

function addTarget()
{
    const circle = document.createElement('div');
    circle.classList.add('circle');
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
    if (isGameOver) return
    currentScore++;
    const scoreSpan = document.getElementById("scoreSpan");
    scoreSpan.textContent = currentScore;
}

function circleMiss()
{
    if (isGameOver) return
    scoreLives = document.getElementById("scoreLives");
    scoreLives.textContent = scoreLives.textContent-1;
    if(scoreLives.textContent==0)
        gameOver();
}

function gameOver()
{
    isGameOver = true;
    const gameScreen = document.getElementById('gameScreen');
    const scoreScreen = document.getElementById('scoreScreen');

    gameScreen.classList.add('hidden');
    scoreScreen.classList.remove('hidden');

    const yourScore = document.getElementById('finalScore');
    const highScore = document.getElementById('highScore');
    yourScore.textContent = currentScore;
    highScore.textContent = localStorage.getItem('bestScore');

    settingHighScore();

}

function settingHighScore()
{
    const bestScore = localStorage.getItem('bestScore');
    if(currentScore>bestScore)
        localStorage.setItem('bestScore', currentScore);
}




btStart.addEventListener('click',startGame);
btRestart.addEventListener('click',startGame);