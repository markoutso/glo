import AST from './AST';
import VariableAST from './VariableAST';
import VariableDeclarationAST from './VariableDeclarationAST';

export default class ProcedureDeclarationAST extends AST {
  constructor(
    public readonly name: VariableAST,
    public readonly args: VariableAST[],
    public readonly declarations: VariableDeclarationAST[],
    public readonly statementList: AST[],
  ) {
    super();
    this.addChild(...args, ...declarations, ...statementList);
  }
}
