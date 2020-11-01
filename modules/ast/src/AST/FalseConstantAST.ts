import ConstantAST from './ConstantAST';
import { GLOBoolean } from '@glossa-glo/data-types';

export default class FalseConstantAST extends ConstantAST {
  public readonly value = new GLOBoolean(false);
  dataType = GLOBoolean;
}
