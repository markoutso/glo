import AST from './AST';

export default class IfAST extends AST {
  public next: IfAST | AST[] | null = null;
  constructor(
    public readonly condition: AST,
    public readonly statementList: AST[],
  ) {
    super();
    this.addChild(condition, ...statementList);
  }

  public addNext(next: IfAST | AST[]) {
    if (this.next) {
      throw new Error('Cannot add next if node more than once');
    }
    this.next = next;
  }
}
