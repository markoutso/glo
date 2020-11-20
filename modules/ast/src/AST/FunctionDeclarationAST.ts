import AST from './AST';
import TypeAST from './TypeAST';
import VariableAST from './VariableAST';
import VariableDeclarationAST from './VariableDeclarationAST';
import ConstantDeclarationAST from './ConstantDeclarationAST';

export default class FunctionDeclarationAST extends AST {
  constructor(
    public readonly name: VariableAST,
    public readonly args: VariableAST[],
    public readonly returnType: TypeAST,
    public readonly constantDeclarations: ConstantDeclarationAST[],
    public readonly variableDeclarations: VariableDeclarationAST[],
    public readonly statementList: AST[],
  ) {
    super();
    this.addChild(
      ...args,
      returnType,
      ...constantDeclarations,
      ...variableDeclarations,
      ...statementList,
    );
  }
}
