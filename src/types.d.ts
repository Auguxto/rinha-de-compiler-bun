export type File = {
  name: string;
  expression: Term;
  location: Location;
};

export type Parameter = {
  text: string;
  location: Location;
};

export type Location = {
  start: number;
  end: number;
  filename: string;
};

export type BinaryOP =
  | "Add"
  | "Sub"
  | "Mul"
  | "Div"
  | "Rem"
  | "Eq"
  | "Neq"
  | "Lt"
  | "Gt"
  | "Lte"
  | "Gte"
  | "And"
  | "Or";

export type Term =
  | {
      kind: "Int";
      value: number;
      location: Location;
    }
  | {
      kind: "Str";
      value: string;
      location: Location;
    }
  | {
      kind: "Bool";
      value: boolean;
      location: Location;
    }
  | {
      kind: "Print";
      value: Term;
      location: Location;
    }
  | {
      kind: "Binary";
      lhs: Term;
      op: BinaryOP;
      rhs: Term;
      location: Location;
    }
  | {
      kind: "If";
      condition: Term;
      then: Term;
      otherwise: Term;
      location: Location;
    }
  | {
      kind: "Tuple";
      first: Term;
      second: Term;
      location: Location;
    }
  | {
      kind: "Var";
      text: string;
      location: Location;
    }
  | {
      kind: "Let";
      name: Parameter;
      value: Term;
      next: Term;
      location: Location;
    }
  | {
      kind: "Call";
      callee: Term;
      arguments: Term[];
      location: Location;
    }
  | {
      kind: "Function";
      parameters: Parameter[];
      value: Term;
      location: Location;
    };
