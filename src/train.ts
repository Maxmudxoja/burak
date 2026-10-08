//MIT tasks

//S-Task

// function missingNumber(nums: number[]): number {
//   const n = nums.length;
//   const expectedSum = (n * (n + 1)) / 2;
//   const actualSum = nums.reduce((sum, num) => sum + num, 0);
//   return expectedSum - actualSum;
// }

// console.log(missingNumber([3, 0, 1]));
// console.log(missingNumber([0, 1]));
// console.log(missingNumber([9, 6, 4, 2, 3, 5, 7, 0, 1]));

//R-Task

// function calculate(expression: string): number {
//   return expression
//     .split("+")
//     .map((num) => Number(num.trim()))
//     .reduce((sum, num) => sum + num, 0);
// }

// console.log(calculate("1+3"));
// console.log(calculate("10+20+5"));
// console.log(calculate("2 + 7"));

//Q-Task

// function hasProperty(obj: object, key: string): boolean {
//   return Object.prototype.hasOwnProperty.call(obj, key);
// }

// console.log(hasProperty({ name: "BMW", model: "M3" }, "model"));
// console.log(hasProperty({ name: "BMW", model: "M3" }, "year"));

//P- task

// function objectToArray(obj: Record<string, number>): [string, number][] {
//   const result: [string, number][] = [];

//   for (const key in obj) {
//     result.push([key, obj[key]]);
//   }

//   return result;
// }

// console.log(objectToArray({ a: 10, b: 20 }));

//O-task
// function calculateSumOfNumbers(values: any[]): number {
//   return values.reduce((sum, value) => {
//     return typeof value === "number" && Number.isFinite(value)
//       ? sum + value
//       : sum;
//   }, 0);
// }

// console.log(calculateSumOfNumbers([10, "10", { son: 10 }, true, 35]));

//N-Task
// function palindromCheck(str: string): boolean {
//   const reversed = str.split("").reverse().join("");
//   return str === reversed;
// }

// console.log(palindromCheck("dad"));
// console.log(palindromCheck("son"));

//M-Task
// interface NumberSquare {
//   number: number;
//   square: number;
// }

// function getSquareNumbers(numbers: number[]): NumberSquare[] {
//   return numbers.map((num) => ({
//     number: num,
//     square: num * num,
//   }));
// }

// console.log(getSquareNumbers([1, 2, 3]));
