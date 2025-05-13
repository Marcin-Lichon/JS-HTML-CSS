let currentScore = 0;
let currentCircle;
let isGameOver = false;
let circleTimeoutId;
let diffTimer;
let circleSize;

const gameArea = document.getElementById('game');
const btStart = document.getElementById('btStart');
const btRestart = document.getElementById('btRestart');
const startScreen = document.getElementById('startScreen');
const scoreScreen = document.getElementById('scoreScreen');
const gameScreen = document.getElementById('gameScreen');
const highScoreSpan = document.getElementById("highScoreSpan");
const scoreSpan = document.getElementById("scoreSpan");
const scoreLives = document.getElementById("scoreLives");

if (localStorage.getItem('bestScore') === null) {
    localStorage.setItem('bestScore', 0);
}


function settingDifficulty()
{
 const selectedDifficulty = document.getElementById('difficulty').value;

    switch(selectedDifficulty)
    {

        case 'easy': 
        diffTimer = 2000;
        circleSize = 70;
        break;

        case 'medium':
        diffTimer = 3000;
        circleSize = 50;
        break;

        case 'hard':
        diffTimer = 2000;
        circleSize = 25;
        break;
   }
}


function startGame() {
    isGameOver = false;

    settingDifficulty();
    
    startScreen.classList.add('hidden');
    scoreScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    statsReset()
    circleRemove();
    addTarget();
}

function statsReset(){
    currentScore = 0;
    highScoreSpan.textContent = localStorage.getItem('bestScore');
    scoreSpan.textContent = currentScore;
    document.getElementById("scoreLives").textContent = 3;
}

function restartGame() {
    startGame(); 
}


function addTarget() {

    const circle = document.createElement('div');
    circle.classList.add('circle');
    gameArea.appendChild(circle);

    circle.style.width = circleSize + 'px';
    circle.style.height = circleSize + 'px';

    const area = gameArea.getBoundingClientRect();

    const randomY = Math.random()*(area.height-circleSize)
    const randomX = Math.random()*(area.width-circleSize)

    circle.style.left=randomX+'px';
    circle.style.top=randomY+'px';

    currentCircle = circle;

    CircleLifeTimer();

    currentCircle.addEventListener('click', () => {
        if (isGameOver) return;
        circleHit();
        circleRemove();
        addTarget(); 
    });
}


function circleRemove() {
    if (currentCircle) 
    {
        currentCircle.remove();
        clearTimeout(circleTimeoutId);
        currentCircle = null;
    }
}

function CircleLifeTimer()
{
    clearTimeout(circleTimeoutId);


    circleTimeoutId=setTimeout(() => {
                        circleRemove()
                        circleMiss()
                        addTarget()
                    }, diffTimer);
}

function circleHit() {
    if (isGameOver) return;

    currentScore++;
    scoreSpan.textContent = currentScore;

    if (currentScore >= 25) {
        gameOver(true);
    }
}


function circleMiss() {
    if (isGameOver) return;

    let lives = parseInt(scoreLives.textContent);

    if (lives > 0)
    {
        lives--;
        scoreLives.textContent = lives;
    }

    if (lives === 0) 
    {
        gameOver(false);
    }
}


function gameOver(result) {
    isGameOver = true;

    circleRemove(); 

    gameScreen.classList.add('hidden');
    score.classList.remove('hidden');

    const yourScore = document.getElementById('finalScore');
    const highScore = document.getElementById('highScore');

    yourScore.textContent = currentScore;
    highScore.textContent = localStorage.getItem('bestScore');

    settingHighScore();

    const endMessage = document.getElementById('end-message');
    endMessage.textContent = result ? "You won!" : "You lost!";
}


function settingHighScore() {
    const bestScore = parseInt(localStorage.getItem('bestScore'));

    if (currentScore > bestScore) 
        localStorage.setItem('bestScore', currentScore); 
}


gameArea.addEventListener('click', (event) => {
    if (!event.target.classList.contains('circle')) {
        circleMiss();
    }
});

btStart.addEventListener('click', startGame);
btRestart.addEventListener('click', restartGame);
