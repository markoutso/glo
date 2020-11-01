import AST from './AST';

export default class ProcedureCallAST extends AST {
  constructor(public readonly name: string, public readonly args: AST[]) {
    super();
    this.addChild(...args);
  }
}
