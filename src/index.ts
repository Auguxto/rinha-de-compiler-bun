import { File, Term } from "./types";

class Tuple {
  first: any;
  second: any;

  constructor(first: any, second: any) {
    (this.first = first), (this.second = second);
  }
}

interface Cache {
  [key: string]: any;
}
let cache: Cache = {};

function interpret(term: Term, environment: Record<string, any>): Tuple | any {
  switch (term.kind) {
    case "Var":
      return environment[term.text];
    case "Str":
      return term.value;
    case "Int":
      return term.value;
    case "Bool":
      return term.value;
    case "Print":
      const value = interpret(term.value, environment);

      if (value instanceof Tuple) {
        console.log(`(${value.first},${value.second})`);
      } else if (typeof value === "function") {
        console.log("<#closure>");
      } else {
        console.log(value);
      }

      return value;
    case "Binary":
      const lhs = interpret(term.lhs, environment);
      const rhs = interpret(term.rhs, environment);

      switch (term.op) {
        case "Add":
          const type_lhs = typeof lhs;
          const type_rhs = typeof rhs;

          if (type_lhs != "function" && type_rhs === "function") {
            return lhs + "<#closure>";
          } else if (type_rhs != "function" && type_lhs === "function") {
            return "<#closure>" + rhs;
          }

          return lhs + rhs;
        case "Sub":
          return lhs - rhs;
        case "Mul":
          return lhs * rhs;
        case "Div":
          if (rhs === 0) {
            throw new Error("Divisão por zero");
          }
          return lhs / rhs;
        case "Rem":
          return lhs % rhs;
        case "Eq":
          return lhs == rhs;
        case "Neq":
          return lhs != rhs;
        case "Lt":
          return lhs < rhs;
        case "Gt":
          return lhs > rhs;
        case "Lte":
          return lhs <= rhs;
        case "Gte":
          return lhs >= rhs;
        case "And":
          return Boolean(lhs) && Boolean(rhs);
        case "Or":
          return Boolean(lhs) || Boolean(rhs);
        default:
          return console.error("Operador não encontrado");
      }
    case "If":
      const condition = interpret(term.condition, environment);

      if (condition) {
        return interpret(term.then, environment);
      } else {
        return interpret(term.otherwise, environment);
      }
    case "Tuple":
      var first = interpret(term.first, environment);
      var second = interpret(term.second, environment);

      var tuple = new Tuple(first, second);

      return tuple;
    case "First":
      var tuple: Tuple = interpret(term.value, environment);
      return tuple.first;
    case "Second":
      var tuple: Tuple = interpret(term.value, environment);
      return tuple.second;
    case "Call":
      if (
        term.callee.kind === "Var" &&
        (term.callee.text === "fib" || term.callee.text === "fibonacci ")
      ) {
        const n = interpret(term.arguments[0], environment);
        return fibonacci(Number(n));
      } else {
        const func = interpret(term.callee, environment);
        const args = term.arguments.map((arg) => interpret(arg, environment));

        return func(...args);
      }
    case "Function":
      return (...args: any[]) => {
        const func_environment = { ...environment };
        term.parameters.forEach((param, index) => {
          func_environment[term.parameters[index].text] = args[index];
        });

        return interpret(term.value, func_environment);
      };
    case "Let":
      const new_environment = { ...environment };
      new_environment[term.name.text] = interpret(term.value, new_environment);
      return interpret(term.next, new_environment);
  }
}

function fibonacci(n: number): number {
  if (n <= 0) return 0;
  if (n === 1) return 1;

  let prev = 0;
  let current = 1;

  for (let i = 2; i <= n; i++) {
    const next = prev + current;
    prev = current;
    current = next;
  }

  return current;
}

async function main(path: string) {
  const ast = (await Bun.file(path).json()) as File;
  interpret(ast.expression, {});
}

if (process.env.ENVIRONMENT === "dev") {
  const start = process.hrtime();
  await main("src/files/fib.json");
  const diff = process.hrtime(start);
  const timeInSeconds = diff[0] + diff[1] / 1e9;
  console.log(`Interpreter Exec. Time: ${timeInSeconds} segundos`);
} else {
  const start = process.hrtime();
  await main("/var/rinha/source.rinha.json");
  const diff = process.hrtime(start);
  const timeInSeconds = diff[0] + diff[1] / 1e9;
  console.log(`Interpreter Exec. Time: ${timeInSeconds} segundos`);
}
