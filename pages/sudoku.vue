<template>
  <v-container fluid class="pa-4">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-4" elevation="4">
          <v-row align="center" justify="space-between">
            <div>
              <h2 class="mb-1">Sudoku — Vuetify 2 + Nuxt 2</h2>
              <div class="subtitle-2">
                UI to play, pencil notes mode, highlight conflicts
              </div>
            </div>
            <div>
              <v-btn small @click="resetBoard">Reset</v-btn>
              <v-btn small color="primary" @click="fillExample"
                >Load Example</v-btn
              >
              <v-btn small color="secondary" @click="togglePencil">{{
                pencilMode ? "Notes" : "Pencil"
              }}</v-btn>
            </div>
          </v-row>

          <div class="sudoku-wrapper mt-4">
            <div class="sudoku-grid">
              <div
                v-for="(cell, index) in flatBoard"
                :key="index"
                :class="[
                  'cell',
                  cellClass(index),
                  {
                    selected: isSelected(index),
                    given: isGiven(index),
                    conflict: hasConflict(index),
                  },
                ]"
                @click="selectCell(index)"
              >
                <template v-if="cell.value">
                  <span class="cell-value"> {{ cell.value }} </span>
                </template>
                <template v-else-if="hintMode"> t </template>

                <template v-else>
                  <div class="notes">
                    <span
                      v-for="n in 9"
                      :key="n"
                      class="note"
                      v-show="cell.notes.includes(n)"
                      >{{ n }}</span
                    >
                  </div>
                </template>
              </div>
            </div>
          </div>

          <v-row class="mt-4" align="center" justify="center">
            <v-col cols="12" sm="8" md="7">
              <v-row justify="center" no-gutters>
                <v-col cols="12" class="d-flex justify-center">
                  <div class="keypad">
                    <v-btn
                      v-for="n in 9"
                      :key="n"
                      small
                      class="ma-1"
                      @click="pressNumber(n)"
                    >
                      {{ n }}
                    </v-btn>

                    <v-btn small class="ma-1" color="error" @click="erase"
                      >Erase</v-btn
                    >
                    <v-btn small class="ma-1" @click="togglePencil">{{
                      pencilMode ? "Pencil ON" : "Pencil OFF"
                    }}</v-btn>
                    <v-btn small class="ma-1" @click="toggleHint">{{
                      hintMode ? "Hint ON" : "Hint OFF"
                    }}</v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-divider class="my-4"></v-divider>

          <v-row>
            <v-col cols="12">
              <div class="help">
                Click a cell then choose a number. Use Pencil mode to toggle
                notes (small numbers). Given cells (from example) are locked.
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    {{ board }}
  </v-container>
</template>

<script>
// Simple Sudoku UI — minimal logic for playing and notes
export default {
  name: "SudokuBoard",
  data() {
    return {
      // board is 9x9, each cell: { value: number|null, notes: [], given: boolean }
      board: [],
      selectedIndex: null,
      pencilMode: false,
      hintMode: false,
      example: [
        // example puzzle (0 means empty)
        5, 3, 0, 0, 7, 0, 0, 0, 0, 6, 0, 0, 1, 9, 5, 0, 0, 0, 0, 9, 8, 0, 0, 0,
        0, 6, 0, 8, 0, 0, 0, 6, 0, 0, 0, 3, 4, 0, 0, 8, 0, 3, 0, 0, 1, 7, 0, 0,
        0, 2, 0, 0, 0, 6, 0, 6, 0, 0, 0, 0, 2, 8, 0, 0, 0, 0, 4, 1, 9, 0, 0, 5,
        0, 0, 0, 0, 8, 0, 0, 7, 9,
      ],
    };
  },
  computed: {
    flatBoard() {
      return this.board;
    },
  },
  created() {
    this.resetBoard();
  },
  methods: {
    resetBoard() {
      // assing to this.board column and row number

      this.board = Array.from({ length: 81 }).map((_, index) => {
        const row = Math.floor(index / 9); // Calculate row number
        const col = index % 9; // Calculate column number
        const group = Math.floor(row / 3) * 3 + Math.floor(col / 3); // Calculate group number

        return {
          value: null,
          notes: [],
          hints: [],
          given: false,
          row, // Add row number
          col, // Add column number
          group, // Add group number
        };
      });
      this.selectedIndex = null;
      this.pencilMode = false;
      this.hintMode = false;
    },
    fillExample() {
      this.resetBoard();
      this.example.forEach((v, i) => {
        if (v && v > 0) {
          this.board[i].value = v;
          this.board[i].given = true;
        }
      });
    },
    selectCell(index) {
      if (this.board[index].given) {
        // don't select givens for editing (but allow selection to view)
        this.selectedIndex = index;
        return;
      }
      this.selectedIndex = index;
    },
    isSelected(index) {
      return this.selectedIndex === index;
    },
    isGiven(index) {
      return this.board[index] && this.board[index].given;
    },
    cellClass(index) {
      const row = Math.floor(index / 9);
      const col = index % 9;
      const classes = [];
      // add heavier borders for block separations
      if (col % 3 === 2 && col !== 8) classes.push("border-right-strong");
      if (col % 3 === 0 && col !== 0) classes.push("border-left-strong");
      if (row % 3 === 2 && row !== 8) classes.push("border-bottom-strong");
      if (row % 3 === 0 && row !== 0) classes.push("border-top-strong");
      return classes;
    },
    pressNumber(n) {
      if (this.selectedIndex === null) return;
      const cell = this.board[this.selectedIndex];

      // if n is the same cell, then erase
      if (cell.value === n && !this.pencilMode) {
        cell.value = null;
        return;
      }

      if (cell.given) return;

      if (this.pencilMode) {
        // toggle note
        const idx = cell.notes.indexOf(n);
        if (idx === -1) cell.notes.push(n);
        else cell.notes.splice(idx, 1);
        // keep notes sorted
        cell.notes.sort((a, b) => a - b);
      } else {
        // place number, clear notes
        cell.value = n;
        cell.notes = [];
      }
    },
    erase() {
      if (this.selectedIndex === null) return;
      const cell = this.board[this.selectedIndex];
      if (cell.given) return;
      cell.value = null;
      cell.notes = [];
    },
    togglePencil() {
      this.pencilMode = !this.pencilMode;
    },
    toggleHint() {
      // not implemented
      this.hintMode = !this.hintMode;
    },
    // check if current cell conflicts with other cells (simple row/col/box check)
    hasConflict(index) {
      const val = this.board[index].value;
      if (!val) return false;
      const row = Math.floor(index / 9);
      const col = index % 9;
      // row
      for (let c = 0; c < 9; c++) {
        const i = row * 9 + c;
        if (i !== index && this.board[i].value === val) return true;
      }
      // col
      for (let r = 0; r < 9; r++) {
        const i = r * 9 + col;
        if (i !== index && this.board[i].value === val) return true;
      }
      // box
      const br = Math.floor(row / 3) * 3;
      const bc = Math.floor(col / 3) * 3;
      for (let r = br; r < br + 3; r++) {
        for (let c = bc; c < bc + 3; c++) {
          const i = r * 9 + c;
          if (i !== index && this.board[i].value === val) return true;
        }
      }
      return false;
    },
  },
};
</script>

<style scoped>
.sudoku-wrapper {
  display: flex;
  justify-content: center;
}
.sudoku-grid {
  width: 100%;
  max-width: 520px;
  display: grid;
  grid-template-columns: repeat(9, 1fr);
  gap: 0;
  border: 2px solid rgba(0, 0, 0, 0.12);
}
.cell {
  width: 100%;
  aspect-ratio: 1/1;
  border: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  background: white;
}
.cell.selected {
  background: #e3f2fd;
}
.cell.given {
  background: #f5f5f5;
  font-weight: 700;
}
.cell.conflict {
  background: #ffebee;
}
.cell .cell-value {
  font-size: 1.25rem;
  font-weight: 600;
}
.notes {
  font-size: 0.55rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  width: 80%;
}
.note {
  text-align: center;
  line-height: 1.2;
}
.border-right-strong {
  border-right: 2px solid rgba(0, 0, 0, 0.18);
}
.border-left-strong {
  border-left: 2px solid rgba(0, 0, 0, 0.18);
}
.border-top-strong {
  border-top: 2px solid rgba(0, 0, 0, 0.18);
}
.border-bottom-strong {
  border-bottom: 2px solid rgba(0, 0, 0, 0.18);
}
.keypad {
  display: flex;
  flex-wrap: wrap;
  max-width: 420px;
  justify-content: center;
}
.help {
  color: rgba(0, 0, 0, 0.6);
}
</style>
