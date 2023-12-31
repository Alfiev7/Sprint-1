var timerInterval;

const MINE = '💣'
const FLAG = '🚩'
var isHintActive = false;

var gBoard;
var gLevel = {
    SIZE: 4,
    MINES: 2
};


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 2,
    hints: 3,
    isFirstClick: true,
    safeClicks: 3,
}

function onInit() {
    gBoard = buildBoard();
    renderBoard(gBoard);
    updateLives()

    gGame.isOn = false;
}

function buildBoard() {

    var board = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            };
        }
    }
    return board;
}

function renderBoard(gBoard) {

    console.log("Inside renderBoard function: ", gBoard);

    var strHTML = '';
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="board-row">\n`
        for (var j = 0; j < gBoard[0].length; j++) {
            const cell = gBoard[i][j];
            var cellContent = '';

            if (cell.isMarked) {
                cellContent = FLAG;
            } else if (cell.isShown) {
                if (cell.isMine) {
                    cellContent = MINE;
                } else {
                    cellContent = cell.minesAroundCount > 0 ? cell.minesAroundCount : '';
                    if (cell.minesAroundCount > 0) {
                        cell.isShown = true;
                    }
                }
            }
            var cellShown = cell.isShown ? 'shown' : '';
            console.log(cellShown)

            strHTML += `<td class="${cellShown} ${cell.isSafe ? 'safe-cell' : ''}" onclick="onCellClicked(${i}, ${j})" oncontextmenu="onRightClick(event, ${i}, ${j}); return false;">${cellContent}</td>`;
        }
        strHTML += `</tr>\n`;
    }

    const elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}


function onCellClicked(i, j) {
    if (gGame.lives === 0) return;


    if (!gGame.isOn) {
        isFirstClick = false;

        startTimer();

        startGame(i, j);

        gGame.isOn = true;
    }

    const cell = gBoard[i][j];
    if (cell.isMarked || cell.isShown) return;

    if (cell.isMine) {
        gameOver();
    } else {
        if (cell.minesAroundCount === 0) {
            expandShown(i, j);
        }
    }

    cell.isShown = true;
    renderBoard(gBoard);
    checkWinGame();
}

function placeMines(board, x, y) {
    for (var i = 0; i < gLevel.MINES; i++) {
        let row = Math.floor(Math.random() * gLevel.SIZE);
        let col = Math.floor(Math.random() * gLevel.SIZE);

        while ((row === x && col === y) || board[row][col].isMine) {
            row = Math.floor(Math.random() * gLevel.SIZE);
            col = Math.floor(Math.random() * gLevel.SIZE);
        }

        board[row][col].isMine = true;
    }
}

function onRightClick(event, i, j) {
    event.preventDefault();
    var cell = gBoard[i][j];
    cell.isMarked = !cell.isMarked;
    renderBoard(gBoard);
    checkWinGame()
}

function gameOver() {
    gGame.lives--;
    updateLives();

    if (gGame.lives === 0) {
        stopTimer();
        revealMines();
        renderBoard(gBoard)
        showLoseModal();
        gGame.isOn = false;

        var elSmiley = document.querySelector('.smiley');
        elSmiley.innerText = '🤯';
    } else {
        renderBoard(gBoard);
    }
}

function revealMines() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine) {
                cell.isShown = true;
            }
        }
    }
}

function checkWinGame() {
    var allMinesFlaggedOrShown = true;
    var allNumberCellsShown = true;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];

            if (cell.isMine && !cell.isMarked && !cell.isShown) {
                allMinesFlaggedOrShown = false;
            }

            if (!cell.isMine && !cell.isShown) {
                allNumberCellsShown = false;
            }
        }
    }

    if (allMinesFlaggedOrShown && allNumberCellsShown) {
        stopTimer();
        var elSmiley = document.querySelector('.smiley');
        elSmiley.innerText = '😎';
        showWinModal();
    }
}

function beginnerLevel(gBoard) {
    if (timerInterval) stopTimer();
    gLevel.SIZE = 4
    gLevel.MINES = 2
    gGame.lives = 2
    gGame.safeClicks = 3;
    updateSafeClicks();
    onInit();
}

function mediumLevel() {
    if (timerInterval) stopTimer();
    gLevel.SIZE = 8
    gLevel.MINES = 14
    gGame.lives = 3
    gGame.safeClicks = 3;
    updateSafeClicks()

    onInit()
}

function expertLevel() {
    if (timerInterval) stopTimer();

    gLevel.SIZE = 12
    gLevel.MINES = 32
    gGame.lives = 3
    gGame.safeClicks = 3;

    updateSafeClicks();
    onInit();
}

function expandShown(i, j) {
    for (var x = i - 1; x <= i + 1; x++) {
        for (var y = j - 1; y <= j + 1; y++) {
            if (x === i && y === j) continue;

            if (x >= 0 && x < gBoard.length && y >= 0 && y < gBoard[0].length) {
                var neighborCell = gBoard[x][y];
                if (!neighborCell.isMine && !neighborCell.isShown) {
                    neighborCell.isShown = true;
                    if (neighborCell.minesAroundCount === 0) {
                        expandShown(x, y);
                    }
                }
            }
        }
    }
}

function updateLives() {
    var elLives = document.querySelector('.lives');
    elLives.innerHTML = '💚= ' + gGame.lives;
}

function resetGame() {
    stopTimer();
    gGame.isOn = false;

    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gBoard = buildBoard();
    renderBoard(gBoard);

    if (gLevel.SIZE === 4 && gLevel.MINES === 2) {
        gGame.lives = 2;
        gGame.safeClicks = 3;
    } else {
        gGame.lives = 3;
        gGame.safeClicks = 3;
    }

    updateSafeClicks();
    updateLives();

    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = '😃';
}

function updateHints() {
    var elHintButton = document.querySelector('.hintButton');
    elHintButton.innerText = '💡: ' + gGame.hints;
    alert('Hints are coming soon!')

    if (gGame.hints === 0) {
        elHintButton.disabled = true;
    }
}

function onHintClick() {
    console.log("Hint button clicked!");
    alert('Hints are coming soon!');

    if (gGame.hints > 0) {
        isHintActive = true;

        var elHintButton = document.querySelector('.hintButton');
        elHintButton.style.backgroundColor = 'yellow';
        elHintButton.style.transform = 'scale(1.1)';

        gGame.hints--;

        elHintButton.innerText = '💡: ' + gGame.hints;
    }
}

function startTimer() {
    var startTime = Date.now();

    timerInterval = setInterval(function () {
        var elapsedTime = Date.now() - startTime;
        var minutes = Math.floor(elapsedTime / (60 * 1000));
        var seconds = Math.floor((elapsedTime % (60 * 1000)) / 1000);
        var milliseconds = Math.floor((elapsedTime % 1000));
        var minutesStr = (minutes < 10 ? '0' : '') + minutes;
        var secondsStr = (seconds < 10 ? '0' : '') + seconds;
        var millisecondsStr = (milliseconds < 100 ? '0' : '') + (milliseconds < 10 ? '0' : '') + milliseconds;

        var timerString = minutesStr + ':' + secondsStr + '.' + millisecondsStr;

        document.querySelector('.timer').innerText = timerString;
    }, 10);
}

function stopTimer() {
    clearInterval(timerInterval);
    document.querySelector('.timer').innerText = '00:00:000';
}

function startGame(x, y) {
    gBoard = buildBoard();

    placeMines(gBoard, x, y);

    setMinesNegsCount(gBoard);
}

function onSafeClick() {
    if (gGame.safeClicks === 0) return;

    var hiddenCells = [];
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (!cell.isShown && !cell.isMine) {
                hiddenCells.push({i, j});
            }
        }
    }

    if (hiddenCells.length === 0) return;

    var randomIdx = getRandomInt(0, hiddenCells.length - 1);
    var safeCell = hiddenCells[randomIdx];


    markSafeCell(safeCell.i, safeCell.j, 2000);

    gGame.safeClicks--;
    updateSafeClicks();
}

function markSafeCell(i, j, duration) {
    var cell = gBoard[i][j];
    cell.isSafe = true;
    renderBoard(gBoard);

    setTimeout(function () {
        cell.isSafe = false;
        renderBoard(gBoard);
    }, duration);
}

function updateSafeClicks() {
    var elSafeClicks = document.querySelector('.safe-click-btn');
    elSafeClicks.innerText = 'Safe Clicks: ' + gGame.safeClicks;
}