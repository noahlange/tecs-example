/* eslint-disable max-classes-per-file */
declare module 'bondage' {
  interface StorageHandler {
    get: (name: string) => any;
    set: (name: string, value: any) => void;
  }

  class Result {
    public text: string;
    public data: string;
    public lineNum: number;
  }

  export class OptionsResult extends Result {
    public selected: number;
    public options: string[];
    public select(index: number): void;

    public constructor(options: unknown[], lineNum: number);
  }

  export class CommandResult extends Result {
    public constructor(text: string, yarnNodeData: unknown, lineNum: number);
  }

  export class TextResult extends Result {}

  export type ResultNode = OptionsResult | CommandResult | TextResult;

  export class Runner {
    public load(data: unknown): void;
    public setVariableStorage(storageHandler: StorageHandler): void;
    public registerFunction(name: string, fn: Function): void;

    public run(startNode: string): Iterator<ResultNode>;

    protected evalNodes(
      nodes: unknown[],
      yarnNodeData: unknown
    ): IterableIterator<ResultNode>;

    protected handleSelections(
      selections: unknown[]
    ): IterableIterator<ResultNode>;

    public constructor();
  }
}
