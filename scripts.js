class Table {
  constructor(size) {
    this.size = size;
    this.element = document.querySelector(".background-table");
    this.createTable();
  }

  createTable() {
    for (let i = 0; i < this.size; i++) {
      let row = this.element.insertRow();
      for (let j = 0; j < this.size; j++) {
        row.insertCell();
      }
    }
  }

  getCell(row, col) {
    return this.element.rows[row].cells[col];
  }

  clearCell(row, col) {
    this.getCell(row, col).innerText = "";
  }

  setCellContent(row, col, content) {
    this.getCell(row, col).innerText = content;
  }
}

class Gravity {
  constructor(row, col, symbol, table) {
    this.row = row;
    this.col = col;
    this.symbol = symbol;
    this.alive = true;
    this.table = table;
  }

  render() {
    this.table.setCellContent(this.row, this.col, this.symbol);
  }

  clear() {
    this.table.clearCell(this.row, this.col);
  }

  move(direction) {
    if (!this.alive) return;

    this.clear();

    const [deltaRow, deltaCol] = direction;
    const newRow = this.row + deltaRow;
    const newCol = this.col + deltaCol;

    if (
      newRow < 0 ||
      newRow >= this.table.size ||
      newCol < 0 ||
      newCol >= this.table.size
    ) {
      this.table.setCellContent(this.row, this.col, Space.boomEmoji);
      this.alive = false;

      setTimeout(() => {
        this.table.clearCell(this.row, this.col);
      }, 1000);
    } else {
      this.row = newRow;
      this.col = newCol;
      this.render();
    }
  }
}

class Space {
  constructor() {
    this.tableSize = this.getTableSize();
    this.table = new Table(this.tableSize);
    this.gravityEffects = [];
    this.directions = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1],
      upLeft: [-1, -1],
      upRight: [-1, 1],
      downLeft: [1, -1],
      downRight: [1, 1],
    };
    this.numEffects = 10;
    Space.boomEmoji = "Boom";
    this.init();
  }

  getTableSize() {
    const root = document.documentElement;
    return parseInt(
      getComputedStyle(root).getPropertyValue("--table-size"),
      10,
    );
  }

  static getRandomAsciiSymbol() {
    const asciiRange = [33, 126];
    return String.fromCharCode(
      Math.floor(Math.random() * (asciiRange[1] - asciiRange[0] + 1)) +
        asciiRange[0],
    );
  }

  addRandomGravityEffect() {
    if (this.gravityEffects.length < this.numEffects) {
      let row = Math.floor(Math.random() * this.tableSize);
      let col = Math.floor(Math.random() * this.tableSize);
      let symbol = Space.getRandomAsciiSymbol();

      const newGravity = new Gravity(row, col, symbol, this.table);
      newGravity.render();
      this.gravityEffects.push(newGravity);
    }
  }

  moveGravityEffects() {
    this.gravityEffects.forEach((gravity, index) => {
      const directionName = Object.keys(this.directions)[
        Math.floor(Math.random() * Object.keys(this.directions).length)
      ];
      const direction = this.directions[directionName];
      gravity.move(direction);
      if (!gravity.alive) {
        this.gravityEffects.splice(index, 1);
      }
    });
  }

  init() {
    this.addEffectsPeriodically();
    this.moveEffectsPeriodically();
  }

  addEffectsPeriodically() {
    setInterval(() => {
      this.addRandomGravityEffect();
    }, 1000);
  }

  moveEffectsPeriodically() {
    setInterval(() => {
      this.moveGravityEffects();
    }, 1000);
  }
}

const space = new Space();
