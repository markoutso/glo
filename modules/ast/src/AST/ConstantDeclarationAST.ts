import { GLODataType } from '@glossa-glo/data-types';
import AST from './AST';
import VariableAST from './VariableAST';

export default class ConstantDeclarationAST extends AST {
  public type: typeof GLODataType | null = null;
  public value: GLODataType | null = null;

  constructor(
    public readonly variable: VariableAST,
    public readonly expression: AST,
  ) {
    super();
    this.addChild(variable, expression);
  }
}
