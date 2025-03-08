/**
 * General utility types
 */
export enum Status {
  SUCCESS,
  WARNING,
  SKIPPED,
  ERROR,
}

export type Result = {
  success: boolean,
  status: Status,
  message?: string,
}

export type CombinationGenerator = {
  outer: string[];
  inner: string[];
  generatePairs: () => Generator<[string, string], void, unknown>;
};

export class generatorObject implements CombinationGenerator {
  outer: string[];
  inner: string[];

  constructor(outer: string[], inner: string[]) {
    this.outer = outer;
    this.inner = inner;
  }

  * generatePairs(): Generator<[string, string], void, unknown> {

    for (const n of this.outer) {
      for (const m of this.inner) {
        yield [n, m];
      }
    }
  }
}