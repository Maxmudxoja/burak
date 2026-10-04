//MIT tasks

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
