const testNumber1 = 3;
const testNumber2 = 5;

// fibbonaci algo
function fib(n) {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

console.log( fib(testNumber1) );
console.log( fib(testNumber2) ); 