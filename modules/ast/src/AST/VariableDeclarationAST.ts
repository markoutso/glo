import AST from './AST';
import TypeAST from './TypeAST';
import VariableAST from './VariableAST';

export default class VariableDeclarationAST extends AST {
  public readonly type: TypeAST;

  constructor(public readonly variable: VariableAST, type: TypeAST) {
    super();
    this.addChild(variable, type);
    this.type = type;
  }
}
