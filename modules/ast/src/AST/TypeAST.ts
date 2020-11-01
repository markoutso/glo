import AST from './AST';
import { GLODataType } from '@glossa-glo/data-types';

export default abstract class TypeAST extends AST {
  public abstract dataType: typeof GLODataType;
}
