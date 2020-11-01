import AST from './AST';

export default class WriteAST extends AST {
  constructor(public readonly args: AST[]) {
    super();
    this.addChild(...args);
  }
}
