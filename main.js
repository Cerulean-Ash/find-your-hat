const prompt = require("prompt-sync")({ sigint: true });

//prompt for a field width and height
const width = prompt("Width? ");
const height = prompt("Height? ");

//star start location - can be used to extend the game to allow random start points
let starX = 0;
let starY = 0;

//in game characters
const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";
const breadCrumbCharacter = ".";
const victoryCharacter = "V";
const deathCharacter = "!";

// create field class
class Field {
  constructor(field) {
    this.field = field;
    this.locationX = starX; // my j axes
    this.locationY = starY; // my i axes
  }

  //
  //function to move * character using WASD
  move() {
    while (true) {
      //convert previous stars to breadcrumb trail
      this.field[this.locationY][this.locationX] = breadCrumbCharacter;
      // track new location
      const direction = prompt("Direction? ").toLowerCase();
      let currentPos = this.field.slice(0, this.field.length);
      if (direction == "a") {
        // left right up and down to be defined
        this.locationX -= 1;
      }
      if (direction == "d") {
        this.locationX += 1;
      }
      if (direction == "w") {
        this.locationY -= 1;
      }
      if (direction == "s") {
        this.locationY += 1;
      }

      // Loss for leaving the field
      if (this.locationY > height - 1 || this.locationY < 0 || this.locationX > width - 1 || this.locationX < 0) {
        console.log(this.locationY);
        console.log(this.locationX);
        console.log("You Left the Field - Game Over :(");
        return;
      }
      // Victory condition
      if (this.field[this.locationY][this.locationX] == hat) {
        this.field[this.locationY][this.locationX] = victoryCharacter;
        this.print();
        console.log("You Win :)");
        return;
      }
      //if hit a hole
      if (this.field[this.locationY][this.locationX] == hole) {
        this.field[this.locationY][this.locationX] = deathCharacter;
        this.print();
        console.log("You Fell Down a Hole and Died :(");
        return;
      }
      // update position and reprint field
      this.field[this.locationY][this.locationX] = pathCharacter;
      this.print();
    }
  }

  //
  // function to print the field - also used by move to print field after each move.
  print() {
    const arrayToString = this.field.map((subarray) => subarray.join("")).join("\n");
    console.log(arrayToString);
  }

  //
  // function to generate the field
  static generateField(height, width) {
    // first generate an empty field
    let array = [];
    for (let i = 0; i < height; i++) {
      let innerarray = [];
      for (let j = 0; j < width; j++) {
        innerarray.push(fieldCharacter);
      }
      array.push(innerarray);
    }

    // sub-function to generate holes for the field
    const randomCoord = (h, w, value) => {
      let randomJ = 0;
      let randomI = 0;
      while (randomI == 0 && randomJ == 0) {
        randomJ = Math.floor(Math.random() * h);
        randomI = Math.floor(Math.random() * w);
      }
      return (array[randomJ][randomI] = value);
    };

    // percentage of holes in the field
    let holeQuant = width * height * 0.3;
    for (let k = 0; k < holeQuant; k++) {
      randomCoord(height, width, hole);
    }

    // set star in correct place
    array[starY][starX] = pathCharacter;

    //place hat
    let hatY;
    let hatX;
    do {
      hatY = Math.floor(Math.random() * height);
      hatX = Math.floor(Math.random() * width);
    } while (array[hatY][hatX] == hole || array[hatY][hatX] == pathCharacter);
    array[hatY][hatX] = hat;

    return array;
  }
}

const myField = new Field(Field.generateField(height, width));

myField.print();
myField.move();
