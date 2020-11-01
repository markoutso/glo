import { Token } from '.';
import * as Types from '@glossa-glo/data-types';

export default class IntegerConstToken extends Token {
  public readonly value: Types.GLOInteger;

  constructor(value: Types.GLOInteger) {
    super();
    this.value = value;
  }
}
