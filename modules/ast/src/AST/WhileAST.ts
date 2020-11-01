import AST from './AST';

export default class WhileAST extends AST {
  constructor(
    public readonly condition: AST,
    public readonly statementList: AST[],
  ) {
    super();
    this.addChild(condition, ...statementList);
  }
}
