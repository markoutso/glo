import AST from './AST';
import FunctionDeclarationAST from './FunctionDeclarationAST';
import ProcedureDeclarationAST from './ProcedureDeclarationAST';
import ConstantDeclarationAST from './ConstantDeclarationAST';
import VariableDeclarationAST from './VariableDeclarationAST';

export default class ProgramAST extends AST {
  constructor(
    public readonly name: string,
    public readonly declarations: (
      | ConstantDeclarationAST
      | VariableDeclarationAST
      | ProcedureDeclarationAST
      | FunctionDeclarationAST
    )[],
    public readonly statementList: AST[],
  ) {
    super();
    this.addChild(...declarations, ...statementList);
    this.name = name;
  }
}
