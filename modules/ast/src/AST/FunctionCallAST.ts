import AST from './AST';

export default class FunctionCallAST extends AST {
  constructor(public readonly name: string, public readonly args: AST[]) {
    super();
    this.addChild(...args);
  }
}
