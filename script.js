const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restart');
const toggleModeButton = document.getElementById('toggle-mode');
const scoreXElement = document.getElementById('score-x');
const scoreOElement = document.getElementById('score-o');
const roundElement = document.getElementById('round');

let currentPlayer = 'X';
let gameActive = true;
let againstAI = false;
let round = 1;
let scoreX = 0;
let scoreO = 0;
const gameState = ['', '', '', '', '', '', '', '', ''];
const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    clickedCell.classList.add(currentPlayer === 'X' ? 'x-marker' : 'o-marker');

    if (checkWin()) {
        gameActive = false;
        if (currentPlayer === 'X') {
            scoreX++;
        } else {
            scoreO++;
        }
        updateScores();
        if (scoreX === 2 || scoreO === 2) {
            setTimeout(endGame, 500); 
        } else {
            setTimeout(nextRound, 1000); 
        }
    } else if (isDraw()) {
        gameActive = false;
        setTimeout(nextRound, 1000); 
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (againstAI && currentPlayer === 'O') {
            aiMove();
        }
    }
}

function checkWin() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winCondition.forEach(index => cells[index].classList.add('winning-cell'));
            drawStrikeLine(winCondition);
            break;
        }
    }
    return roundWon;
}

function drawStrikeLine(winCondition) {
    const [a, b, c] = winCondition;
    const firstCell = cells[a];
    const lastCell = cells[c];

    const strike = document.createElement('div');
    strike.classList.add('strike');
    
    const firstCellRect = firstCell.getBoundingClientRect();
    const lastCellRect = lastCell.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const strikeLength = lastCellRect.right - firstCellRect.left;
    const strikeHeight = lastCellRect.bottom - firstCellRect.top;
    const strikeWidth = Math.sqrt(Math.pow(strikeLength, 2) + Math.pow(strikeHeight, 2));

    const strikeX = (firstCellRect.left + lastCellRect.right) / 2 - boardRect.left;
    const strikeY = (firstCellRect.top + lastCellRect.bottom) / 2 - boardRect.top;

    strike.style.width = `${strikeWidth}px`;
    strike.style.left = `${strikeX - strikeWidth / 2}px`;
    strike.style.top = `${strikeY - 2}px`;
    strike.style.transform = `rotate(${Math.atan2(lastCellRect.top - firstCellRect.top, lastCellRect.left - firstCellRect.left) * 180 / Math.PI}deg)`;

    board.appendChild(strike);
}

function isDraw() {
    return !gameState.includes('');
}

function aiMove() {
    let availableCells = [];
    gameState.forEach((cell, index) => {
        if (cell === '') {
            availableCells.push(index);
        }
    });

    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    gameState[randomIndex] = 'O';
    cells[randomIndex].innerText = 'O';
    cells[randomIndex].classList.add('o-marker');

    if (checkWin()) {
        gameActive = false;
        scoreO++;
        updateScores();
        if (scoreO === 2) {
            setTimeout(endGame, 500); 
        } else {
            setTimeout(nextRound, 1000); 
        }
    } else if (isDraw()) {
        gameActive = false;
        setTimeout(nextRound, 1000); 
    } else {
        currentPlayer = 'X';
    }
}

function updateScores() {
    scoreXElement.innerText = scoreX;
    scoreOElement.innerText = scoreO;
}

function nextRound() {
    round++;
    if (round > 3) {
        endGame();
        return;
    }
    roundElement.innerText = round;
    gameActive = true;
    currentPlayer = 'X';
    gameState.fill('');
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('winning-cell', 'x-marker', 'o-marker');
    });
    const strike = document.querySelector('.strike');
    if (strike) {
        strike.remove();
    }
}

function endGame() {
    if (scoreX > scoreO) {
        alert('Player X wins the game!');
    } else if (scoreO > scoreX) {
        alert('Player O wins the game!');
    } else {
        alert('The game is a draw!');
    }
    handleRestartGame();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = 'X';
    round = 1;
    scoreX = 0;
    scoreO = 0;
    updateScores();
    roundElement.innerText = round;
    gameState.fill('');
    cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('winning-cell', 'x-marker', 'o-marker');
    });
    const strike = document.querySelector('.strike');
    if (strike) {
        strike.remove();
    }
}

function toggleMode() {
    againstAI = !againstAI;
    toggleModeButton.innerText = againstAI ? 'Play against Human' : 'Play against AI';
    handleRestartGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', handleRestartGame);
toggleModeButton.addEventListener('click', toggleMode);
