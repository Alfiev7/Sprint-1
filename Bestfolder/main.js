const MINE = '💣'
const EMPTY = ''
const FLAG = '🚩'




var isHintActive = false;
var isFirstClick = true;
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
    lives: 3,
    hints: 3
}

function onInit() {
    gBoard = buildBoard();
    renderBoard(gBoard);
    updateLives()
    
    // false = indicating the game is not yet started.
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
                cellContent = FLAG
            } else if (cell.isShown) {
                if (cell.isMine) {
                    cellContent = MINE;
                } else {
                    cellContent = cell.minesAroundCount > 0 ? cell.minesAroundCount : '';
                }

            }
            var cellShown = cell.isShown ? 'shown' : '';  // New line: Check if the cell is shown
            console.log(cellShown)


            strHTML += `<td class="${cellShown}" onclick="onCellClicked(${i}, ${j})" oncontextmenu="onRightClick(event, ${i}, ${j}); return false;">${cellContent}</td>`;
        }
        strHTML += `</tr>\n`;
    }

    const elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}



function onCellClicked(i, j) {
    const cell = gBoard[i][j];

    if(gGame.lives === 0) return
    console.log(gGame.lives)

    if (!gGame.isOn) {
       
       isFirstClick = false;

        
        gBoard = buildBoard();
        placeMines(gBoard);

        
        setMinesNegsCount(gBoard);

        
        expandShown(i, j);

        
        gGame.isOn = true;
    }

    

    if (cell.isMarked || cell.isShown) return;



    if (cell.isMine) {
        cell.isShown = true;
        renderBoard(gBoard);
        gameOver();
    } else if (cell.minesAroundCount > 0) {
        cell.isShown = true;
        renderBoard(gBoard);
    } else {
        expandShown(i, j);
        renderBoard(gBoard);
    }
    checkWinGame()
}


function placeMines(board) {

    for (var i = 0; i < gLevel.MINES; i++) {
        let row = Math.floor(Math.random() * gLevel.SIZE);
        let col = Math.floor(Math.random() * gLevel.SIZE);

        while (board[row][col].isMine) {
            row = Math.floor(Math.random() * gLevel.SIZE);
            col = Math.floor(Math.random() * gLevel.SIZE);
        }
        board[row][col].isMine = true;


    }
}


function onRightClick(event, i, j) {
    event.preventDefault(); // so that context menu does not pop up
    var cell = gBoard[i][j];
    cell.isMarked = !cell.isMarked;      // every click will mark and unmark
    renderBoard(gBoard);
    checkWinGame()
}


function gameOver(clickedMineCell) {
    // Decrement the number of lives when a mine is clicked
    gGame.lives--;

    // Display the remaining lives on the screen
    updateLives();

    // Check if the game is over (no more lives)
    if (gGame.lives === 0) {
        // Reveal all mines if out of lives
        revealMines();
        renderBoard(gBoard)
        showLoseModal()
        gGame.isOn = false;
        

        //change smiley face to this if lost
        var elSmiley = document.querySelector('.smiley');
        elSmiley.innerText = '🤯';

    } else {
        // If there are still lives left, reveal only the clicked mine cell
        // clickedMineCell.isShown = true;
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
    var allMinesFlagged = true;
    var allNumberCellsShown = true;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];

            if (cell.isMine && !cell.isMarked) {
                allMinesFlagged = false;
            }

            if (!cell.isMine && !cell.isShown) {
                allNumberCellsShown = false;
            }
        }
    }

    if (allMinesFlagged && allNumberCellsShown) {

        //change smiley to this if won 
        var elSmiley = document.querySelector('.smiley');
        elSmiley.innerText = '😎';
        showWinModal()

    }
}

function beginnerLevel(gBoard) {
    gLevel.SIZE = 4
    gLevel.MINES = 2
// gGame.lives = 2
    onInit()
}


function mediumLevel(gBoard) {
    gLevel.SIZE = 8
    gLevel.MINES = 14

    onInit()
}

function expertLevel(gBoard) {
    gLevel.SIZE = 12
    gLevel.MINES = 32

    onInit()
}

function expandShown(i, j) {
    for (var x = i - 1; x <= i + 1; x++) {
        for (var y = j - 1; y <= j + 1; y++) {
            if (x === i && y === j) continue; // Skip the clicked cell itself

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
    gGame.isOn = false;
    gGame.lives = 3;
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.secsPassed = 0;
    gBoard = buildBoard();
    renderBoard(gBoard);
    updateLives()

    // Update the smiley face to normal 😃
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = '😃';
}

function updateHints() {
    var elHintButton = document.querySelector('.hintButton');
    elHintButton.innerText = '💡: ' + gGame.hints;
    if (gGame.hints === 0) {
        elHintButton.disabled = true;
    }
}

function onHintClick() {
    console.log("Hint button clicked!");
    if (gGame.hints > 0) {
        isHintActive = true;

        var elHintButton = document.querySelector('.hintButton');
        elHintButton.style.backgroundColor = 'yellow'; // Added quotation marks
        elHintButton.style.transform = 'scale(1.1)';
        
        // Decrement the hint count
        gGame.hints--;
        
        // Update the hint button text
        elHintButton.innerText = '💡: ' + gGame.hints;
    }
}

