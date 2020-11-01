import ConstantAST from './ConstantAST';
import { GLOBoolean } from '@glossa-glo/data-types';

export default class TrueConstantAST extends ConstantAST {
  dataType = GLOBoolean;
  public readonly value = new GLOBoolean(true);
}
