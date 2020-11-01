import AST from './AST';

export default class RepeatAST extends AST {
  constructor(
    public readonly condition: AST,
    public readonly statementList: AST[],
  ) {
    super();
    this.addChild(condition, ...statementList);
  }
}
