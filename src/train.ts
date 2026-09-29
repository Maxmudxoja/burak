/* Project Standards:
 - Logging standards
 - Naming standards
    function, method, variable => CAMEL    goHome
    class => PASCAL                        MemberService
    folder => KEBAB
    css => SNAKE                           button_style
   
    Error handling standards
    - Use try-catch blocks for error handling in asynchronous code.
    - Log errors with relevant information for debugging.
    - Return appropriate HTTP status codes and messages for different error scenarios.

 - Code structure standards
    - Organize code into modules and folders based on functionality.
    - Use consistent file naming conventions (e.g., kebab-case for folders, camelCase for files).
    - Separate concerns by keeping controllers, services, and models in their respective folders.

 - Testing standards
    - Write unit tests for critical functions and components.
    - Use a testing framework (e.g., Jest) to automate tests.
    - Ensure tests cover edge cases and potential failure scenarios.

 */

//MIT tasks

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
