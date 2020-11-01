import VariableAST from './VariableAST';
import AST from './AST';
import ArrayAccessAST from './ArrayAccessAST';

export default class ForAST extends AST {
  constructor(
    public readonly counter: VariableAST | ArrayAccessAST,
    public readonly startValue: AST,
    public readonly endValue: AST,
    public readonly step: AST,
    public readonly statementList: AST[],
  ) {
    super();
    this.addChild(counter, step, startValue, endValue, ...statementList);
  }
}
