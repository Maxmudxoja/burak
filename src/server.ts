// ## Architectural Patterns

// 1. MVC (Model-View-Controller)**
// Splits your app into three parts:
// - Model – handles data and business logic (e.g., a User class, database queries)
// - View – what the user sees (HTML, UI, JSON response)
// - Controller – the middleman; takes requests, asks the Model for data, sends it to the View

// Easy analogy: A restaurant. Model = kitchen (makes food), View = the plate presented to you, Controller = waiter (takes your order, brings food back).

// 2. Dependency Injection (DI)
// Instead of a class creating the things it needs internally, you "inject" (pass in) those dependencies from outside.

// ```ts
// // Without DI
// class UserService {
//   db = new Database(); // tightly coupled
// }

// // With DI
// class UserService {
//   constructor(private db: Database) {} // passed in
// }
// ```

// Easy analogy: Instead of a chef growing his own vegetables, someone delivers the vegetables to him. Easier to swap suppliers (or use fake ones for testing).

// 3. MVP (Model-View-Presenter)
// Similar to MVC, but the **Presenter** takes over more responsibility from the View — the View becomes very "dumb" (just displays what it's told) and the Presenter handles all the logic of what to show.

// Easy analogy:MVC's waiter (Controller) just relays messages. MVP's Presenter is more like a manager who decides exactly what the customer sees and does more of the thinking.

// ---

// ## Design Patterns

// 4. Middleware**
// Functions that run *in between* a request coming in and the final response going out — each one can inspect, modify, or block the request before passing it along.

// ```ts
// app.use((req, res, next) => {
//   console.log("Request received");
//   next(); // pass to the next step
// });
// ```

// Easy analogy:* Airport security checkpoints — your request passes through several checks (auth, logging, validation) before reaching its destination.

// 5. Decorator
// Adds new behavior to an object or function *without changing its original code* — you "wrap" it with extra functionality.

// ```ts
// function withLogging(fn: Function) {
//   return (...args: any[]) => {
//     console.log("Calling function...");
//     return fn(...args);
//   };
// }
// ```

// Easy analogy: Putting a phone case on your phone. The phone still works the same, but now it has extra protection — without altering the phone itself.

// ---

// Quick summary table:

// | Pattern    | Type.         | What it solves                                |
// |---         |---            |---                                            |
// | MVC        | Architectural | Organizes app into Data/UI/Logic              |
// | DI         | Architectural | Reduces tight coupling between classes        |
// | MVP        | Architectural | Like MVC, but View is passive                 |
// | Middleware | Design        | Processes requests in a pipeline              |
// | Decorator  | Design        | Adds features without modifying original code |
