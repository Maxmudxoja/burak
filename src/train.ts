/** API types
 * Traditionally, API types are defined in a separate file (e.g., `apiTypes.ts`) to maintain a clear separation of concerns. This file contains TypeScript interfaces and types that describe the structure of the data exchanged between the client and server. By defining these types in a dedicated file, we can ensure consistency across the application and facilitate easier maintenance and updates to the API contracts.
 *
 * Rest API types are typically used to define the expected request and response formats for various endpoints. This includes specifying the shape of request bodies, query parameters, and response objects. By using TypeScript's type system, we can catch potential errors at compile time, improving the overall reliability of the application.
 *
 * GraphQL API types, on the other hand, are often generated automatically based on the GraphQL schema. Tools like GraphQL Code Generator can generate TypeScript types that correspond to the GraphQL queries and mutations defined in the schema. This allows developers to work with strongly typed data when interacting with a GraphQL API, reducing the likelihood of runtime errors and improving developer productivity.
 */

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
