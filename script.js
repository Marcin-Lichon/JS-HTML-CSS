let currentScore = 0;
let currentCircle;
let isGameOver = false;
let circleTimeoutId;



const gameArea = document.getElementById('game');
const btStart = document.getElementById('btStart');
const btRestart = document.getElementById('btRestart');

if (localStorage.getItem('bestScore') === null) {
    localStorage.setItem('bestScore', 0);
}


function startGame() {
    isGameOver = false;
    currentScore = 0;
    
    document.getElementById('startScreen').classList.add('hidden');
    document.getElementById('scoreScreen').classList.add('hidden');
    document.getElementById('gameScreen').classList.remove('hidden');

    document.getElementById("highScoreSpan").textContent = localStorage.getItem('bestScore');
    document.getElementById("scoreSpan").textContent = currentScore;
    document.getElementById("scoreLives").textContent = 3;

    circleRemove();
    addTarget();
}


function restartGame() {
    startGame(); 
}


function addTarget() {

    const selectedDifficulty = document.getElementById('difficulty').value;
    const circle = document.createElement('div');
    circle.classList.add('circle');
    gameArea.appendChild(circle);
    let circleSize;
    switch(selectedDifficulty){

        case 'easy': 
        circleSize = 70;
        break;

        case 'medium':
        circleSize = 50;
        break;

        case 'hard':
        circleSize = Math.random() * (50 - 30) + 30;
        break;
   }
       
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
    const selectedDifficulty = document.getElementById('difficulty').value;
    clearTimeout(circleTimeoutId);

    let diffTimer;
    switch(selectedDifficulty){

        case 'easy': 
        diffTimer = 2000;
        break;

        case 'medium':
        diffTimer = 3000;
        break;

        case 'hard':
        diffTimer = 2000;
        break;
   }

    circleTimeoutId=setTimeout(() => {
                        circleRemove()
                        circleMiss()
                        addTarget()
                    }, diffTimer);
}

function circleHit() {
    if (isGameOver) return;

    currentScore++;
    document.getElementById("scoreSpan").textContent = currentScore;

    if (currentScore >= 25) {
        gameOver(true);
    }
}


function circleMiss() {
    if (isGameOver) return;

    const scoreLives = document.getElementById("scoreLives");
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

    document.getElementById('gameScreen').classList.add('hidden');
    document.getElementById('scoreScreen').classList.remove('hidden');

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
