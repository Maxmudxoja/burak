//MIT tasks

//W-TASK

// function chunkArray<T>(arr: T[], size: number): T[][] {
//   const result: T[][] = [];

//   for (let i = 0; i < arr.length; i += size) {
//     result.push(arr.slice(i, i + size));
//   }

//   return result;
// }

// console.log(chunkArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3));

//V-TASK
// function countChars(str: string): Record<string, number> {
//   const result: Record<string, number> = {};

//   for (const char of str) {
//     if (result[char]) {
//       result[char]++;
//     } else {
//       result[char] = 1;
//     }
//   }

//   return result;
// }

// console.log(countChars("hello"));

//U - TASK;
// function sumOdds(num: number): number {
//   let count = 0;
//   for (let i = 0; i < num; i++) {
//     if (i % 2 !== 0) count++;
//   }
//   return count;
// }

// console.log(sumOdds(9));
// console.log(sumOdds(11));

//T-TASK
// function mergeSortedArrays(arr1: number[], arr2: number[]): number[] {
//   const result: number[] = [];
//   let i = 0;
//   let j = 0;

//   while (i < arr1.length && j < arr2.length) {
//     if (arr1[i] <= arr2[j]) {
//       result.push(arr1[i]);
//       i++;
//     } else {
//       result.push(arr2[j]);
//       j++;
//     }
//   }

//   while (i < arr1.length) result.push(arr1[i++]);
//   while (j < arr2.length) result.push(arr2[j++]);

//   return result;
// }

// console.log(mergeSortedArrays([0, 3, 4, 31], [4, 6, 30]));

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
