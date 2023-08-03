



function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            neighborsCount = getNeighbors(i, j, board);
            board[i][j].minesAroundCount = neighborsCount;
        }
    }
}

function getNeighbors(i, j, board) {


    var neighborsCount = 0;

    for (var x = i - 1; x <= i + 1; x++) {

        //if it reaches the edges, continue
        if (x < 0 || x >= board.length) continue
        for (var y = j - 1; y <= j + 1; y++) {

            //not to count myself, continue
            if (x === i && y === j) continue

            //if edges again continue
            if (y < 0 || y >= board[i].length) continue

            //count mines
            if (board[x][y].isMine)
                neighborsCount++
        }
    }
    return neighborsCount
}

function cheat() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine && !cell.isMarked) {
                cell.isMarked = true;
            }
        }
    }
    renderBoard(gBoard);
}


function showLoseModal() {
    var modal = document.querySelector(".lose-modal");
    var close = document.querySelector(".close-button")


    modal.style.display = "block";

    close.onclick = function () {
        modal.style.display = "none";
    }



}

function showWinModal() {
    var modal = document.querySelector(".win-modal");
    var close = document.querySelector(".win-close-button")

    modal.style.display = "block";

    close.onclick = function () {
        modal.style.display = "none";
    }


}


function toggleDarkMode() {
    var body = document.body;
    body.classList.toggle('dark-mode');
}



