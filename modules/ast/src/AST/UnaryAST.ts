import AST from './AST';

export default abstract class UnaryAST extends AST {
  constructor(public target: AST) {
    super();
    this.addChild(target);
  }
}
