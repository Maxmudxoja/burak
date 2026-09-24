//MIT tasks

//M-Task
interface NumberSquare {
  number: number;
  square: number;
}

function getSquareNumbers(numbers: number[]): NumberSquare[] {
  return numbers.map((num) => ({
    number: num,
    square: num * num,
  }));
}

console.log(getSquareNumbers([1, 2, 3]));
