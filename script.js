import { Solver } from './solver.js';

/**
 * The currently selected cell in the Sudoku grid.
 *
 * @type {?HTMLElement}
 */
let selectedCell = null;

window.onload = () => {
    initializeGrid();
    initializeNumpad();
    initializeButtons();
};

/**
 * Initializes the sudoku grid with cells and event listeners.
 */
function initializeGrid() {
    const grid = document.getElementById('grid');

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = createCell(r, c);
            grid.appendChild(cell);
        }
    }

    selectedCell = document.getElementById('cell00');
    selectCell(selectedCell);
}

/**
 * Creates a single cell element with styling and event listener.
 * @param {number} row The row index of the cell.
 * @param {number} col The column index of the cell.
 * @returns {HTMLElement} The created cell element.
 */
function createCell(row, col) {
    const cell = document.createElement('div');
    cell.id = `cell${row}${col}`;
    cell.classList.add('cell');
    if (row === 2 || row === 5) cell.classList.add('horizontal-border');
    if (col === 2 || col === 5) cell.classList.add('vertical-border');
    cell.addEventListener('click', () => selectCell(cell));
    return cell;
}

/**
 * Initializes the numpad and delete button.
 */
function initializeNumpad() {
    const numpad = document.getElementById('numpad');
    for (let i = 1; i <= 9; i++) {
        const numButton = createNumpadButton(i);
        numpad.appendChild(numButton);
    }

    const deleteButton = createDeleteButton();
    numpad.appendChild(deleteButton);
}

/**
 * Creates a numpad button with a click event listener.
 * 
 * @param {number} number The number on the button.
 * @returns {HTMLElement} The numpad button element.
 */
function createNumpadButton(number) {
    const numButton = document.createElement('div');
    numButton.id = number;
    numButton.innerText = number;
    numButton.classList.add('num');
    numButton.addEventListener('click', () => setCell(number));
    return numButton;
}

/**
 * Creates a delete button to clear the selected cell.
 * 
 * @returns {HTMLElement} The delete button element.
 */
function createDeleteButton() {
    const deleteButton = document.createElement('div');
    deleteButton.id = 'delete';
    deleteButton.innerText = 'delete';
    deleteButton.classList.add('delete');
    deleteButton.addEventListener('click', clearCell);
    return deleteButton;
}

/**
 * Initializes control buttons for clearing, solving, and toggling help display.
 */
function initializeButtons() {
    document.getElementById('clear').addEventListener('click', clearGrid);
    document.getElementById('solve').addEventListener('click', solveGrid);
    document.getElementById('help').addEventListener('click', toggleHelp);

    document.getElementById('descr').style.display = 'none';
}

/**
 * Selects a cell and highlights it.
 * 
 * @param {HTMLElement} cell - The cell to select.
 */
function selectCell(cell) {
    if (selectedCell) selectedCell.classList.remove('cell-selected');
    selectedCell = cell;
    selectedCell.classList.add('cell-selected');
}

/**
 * Sets the value of the selected cell.
 * 
 * @param {number} number - The number to set in the cell.
 */
function setCell(number) {
    if (selectedCell) {
        selectedCell.style.color = 'black';
        selectedCell.innerText = number;
    }
}

/**
 * Clears the value of the selected cell.
 */
function clearCell() {
    if (selectedCell) selectedCell.innerText = '';
}

/**
 * Clears all cells on the Sudoku grid.
 */
function clearGrid() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            document.getElementById(`cell${r}${c}`).innerText = '';
        }
    }
}

/**
 * Toggles the display of the decription.
 */
function toggleHelp() {
    const description = document.getElementById('descr');
    if (description.style.display === 'none') {
        description.style.display = 'flex';
        document.body.scrollIntoView(false);
    } else {
        description.style.display = 'none';
    }
}

/**
 * Solves the Sudoku grid using the Solver class and updates the grid.
 */
function solveGrid() {
    const grid = parseGrid();

    try {
        const solver = new Solver(grid);
        updateGrid(solver.grid);
    } catch (error) {
        console.error(error);
        alert('ERROR: Grid has a mistake.');
    }
}

/**
 * Retrieves the current values of the grid.
 * 
 * @returns {number[][]} The current grid values.
 */
function parseGrid() {
    const grid = [];
    for (let r = 0; r < 9; r++) {
        const row = [];
        for (let c = 0; c < 9; c++) {
            const cellValue = document.getElementById(`cell${r}${c}`).innerText;
            row.push(cellValue === '' ? 0 : parseInt(cellValue));
        }
        grid.push(row);
    }
    return grid;
}

/**
 * Updates the grid with the solution from the Solver.
 * @param {number[][]} solvedGrid - The solved grid.
 */
function updateGrid(solvedGrid) {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.getElementById(`cell${r}${c}`);
            if (cell.innerText === '') {
                cell.style.color = '#5e80e6';
                cell.innerText = solvedGrid[r][c].toString();
            }
        }
    }
}

/**
 * Handles keyboard input to enter and delete digits, and navigate cells.
 */
document.onkeyup = (e) => {
    if (selectedCell) {
        if (e.code.includes('Digit') && e.code[5] !== '0') {
            setCell(e.code[5]);
        } else if (e.code === 'Backspace') {
            clearCell();
        } else if (e.code.includes('Arrow')) {
            navigateArrows(e.code);
        }
    }
};

/**
 * Navigates the selected cell using arrow keys.
 * @param {string} arrowCode - The arrow key code.
 */
function navigateArrows(arrowCode) {
    let r = parseInt(selectedCell.id[4]);
    let c = parseInt(selectedCell.id[5]);

    switch (arrowCode) {
        case 'ArrowDown':
            r = (r + 1) % 9;
            break;

        case 'ArrowUp':
            r = (r + 8) % 9;
            break;

        case 'ArrowLeft':
            c = (c + 8) % 9;
            break;

        case 'ArrowRight':
            c = (c + 1) % 9;
            break;
    }

    const cell = document.getElementById(`cell${r}${c}`);
    selectCell(cell);
}
