import AST from './AST';
import ConstantDeclarationAST from './ConstantDeclarationAST';
import VariableAST from './VariableAST';
import VariableDeclarationAST from './VariableDeclarationAST';

export default class ProcedureDeclarationAST extends AST {
  constructor(
    public readonly name: VariableAST,
    public readonly args: VariableAST[],
    public readonly constantDeclarations: ConstantDeclarationAST[],
    public readonly variableDeclarations: VariableDeclarationAST[],
    public readonly statementList: AST[],
  ) {
    super();
    this.addChild(
      ...args,
      ...constantDeclarations,
      ...variableDeclarations,
      ...statementList,
    );
  }
}
