/**
 * Sudoku solver utility class.
 *
 * @export
 * @class Solver
 */
export class Solver {
    /**
     * Creates an instance of Solver.
     *
     * @constructor
     * @param {!number[][]} grid The sudoku grid to solve.
     * @param {number=} size The size of the grid (default 9).
     * @throws {Error} If the grid breaks Sudoku rules or has no solution.
     */
    constructor(grid, size = 9) {
        /**
        * Sudoku grid containing the original clues.
        * @type {!number[][]}
        */
        this.clueGrid = grid.map(row => [...row]);
        /**
        * Solved sudoku grid.
        * @type {!number[][]}
        */
        this.grid = grid;
        /** @private {number} */
        this.size = size;

        if (this.hasMistakes()) throw new Error('Grid breaks sudoku rules.');
    
        const isSolveable = this.solve();
        if (!isSolveable) throw new Error('Grid has no solution.');
    }

    /**
     * Finds one solution for the clues in the grid using backtracking.
     *
     * @returns {boolean} True if solution was found, otherwise false.
     */
    solve() {
        const emptyCell = this.findEmpty();
        if (!emptyCell) return true;
        const [r, c] = emptyCell;

        for (const value of this.getUsable(r, c)) {
            this.grid[r][c] = value;
            if (this.solve()) {
                return true;
            }
        }
        this.grid[r][c] = 0;
        return false;
    }

    /**
     * Finds the next empty cell.
     *
     * @returns {?number[]} The row and col of empty cell or null if no empty cells.
     */
    findEmpty() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === 0) return [r, c];
            }
        }
        return null;
    }

    /**
     * Returns the values that can be used for the given empty cell.
     * 
     * @param {number} row
     * @param {number} col
     * @returns {!number[]} Array of valid numbers for the cell.
     */
    getUsable(row, col) {
        const notUsable = new Set();

        for (let i = 0; i < this.size; i++) {
            notUsable.add(this.grid[row][i]);
            notUsable.add(this.grid[i][col]);
        }

        const boxStartRow = Math.floor(row / 3) * 3;
        const boxStartCol = Math.floor(col / 3) * 3;
        for (let r = boxStartRow; r < boxStartRow + 3; r++) {
            for (let c = boxStartCol; c < boxStartCol + 3; c++) {
                notUsable.add(this.grid[r][c]);
            }
        }

        const usableValues = [];
        for (let value = 1; value <= this.size; value++) {
            if (!notUsable.has(value)) usableValues.push(value);
        }
        return usableValues;
    }

    /**
     * Checks if grid breaks sudoku rules.
     *
     * @returns {boolean} True if the grid breaks sudoku rules, otherwise false.
     */
    hasMistakes() {
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                let value = this.grid[r][c];
                if (value !== 0) {
                    this.grid[r][c] = 0;
                    if (!this.getUsable(r, c).includes(value)) return true;
                    this.grid[r][c] = value;
                }
            }
        }
        return false;
    }
}