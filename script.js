
const cells = Array.from(document.querySelectorAll("[data-cell]"));

const statusElement = document.getElementById("game-status");

const scoreXElement = document.getElementById("score-x");
const scoreOElement = document.getElementById("score-o");

const playerXCard = document.getElementById("player-x-card");
const playerOCard = document.getElementById("player-o-card");

const resetRoundButton = document.getElementById("reset-round");
const newGameButton = document.getElementById("new-game");

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

let board = Array(9).fill(null);
let currentPlayer = "X";
let gameActive = true;

const scores = {
    X: 0,
    O: 0
};

function updateScores() {
    scoreXElement.textContent = scores.X;
    scoreOElement.textContent = scores.O;
}

function highlightPlayer(player) {
    playerXCard.classList.toggle("is-active", player === "X");
    playerOCard.classList.toggle("is-active", player === "O");
}

function updateCellLabel(index, player = null) {
    const row = Math.floor(index / 3) + 1;
    const column = (index % 3) + 1;

    const label = `Row ${row}, column ${column}`;

    cells[index].setAttribute(
        "aria-label",
        player ? `${label}, ${player}` : label
    );
}

function handleCellClick(event) {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.cell);

    // Ignore occupied squares and moves after the game ends.
    if (!gameActive || board[index] !== null) {
        return;
    }

    // Record the move.
    board[index] = currentPlayer;

    cell.textContent = currentPlayer;
    cell.dataset.player = currentPlayer;
    cell.disabled = true;

    updateCellLabel(index, currentPlayer);

    // Check whether the current player has won.
    const winningCombination = winningCombinations.find(combination =>
        combination.every(position => board[position] === currentPlayer)
    );

    if (winningCombination) {
        finishGame(winningCombination);
        return;
    }

    // If every square is filled, the game is a draw.
    if (board.every(mark => mark !== null)) {
        gameActive = false;

        cells.forEach(boardCell => {
            boardCell.disabled = true;
        });

        statusElement.textContent =
            "It's a draw! No one takes this round.";

        highlightPlayer(null);
        return;
    }

    // Switch to the other player.
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    statusElement.textContent = `Player ${currentPlayer}'s turn`;

    highlightPlayer(currentPlayer);
}

function finishGame(winningCombination) {
    gameActive = false;

    scores[currentPlayer] += 1;
    updateScores();

    // Highlight the three winning squares.
    winningCombination.forEach(position => {
        cells[position].classList.add("is-winning");
    });

    // Prevent further moves after a win.
    cells.forEach(cell => {
        cell.disabled = true;
    });

    statusElement.textContent =
        `Player ${currentPlayer} wins this round!`;

    highlightPlayer(currentPlayer);
}

function resetRound() {
    board = Array(9).fill(null);
    currentPlayer = "X";
    gameActive = true;

    cells.forEach((cell, index) => {
        cell.textContent = "";
        cell.disabled = false;

        delete cell.dataset.player;

        cell.classList.remove("is-winning");

        updateCellLabel(index);
    });

    statusElement.textContent = "Player X's turn";

    highlightPlayer("X");
}

function startNewGame() {
    scores.X = 0;
    scores.O = 0;

    updateScores();
    resetRound();
}

// Register the game controls.
cells.forEach(cell => {
    cell.addEventListener("click", handleCellClick);
});

resetRoundButton.addEventListener("click", resetRound);
newGameButton.addEventListener("click", startNewGame);

// Set up the initial game.
updateScores();
resetRound();
