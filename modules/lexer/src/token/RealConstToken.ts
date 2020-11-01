import { Token } from '.';
import * as Types from '@glossa-glo/data-types';

export default class RealConstToken extends Token {
  public readonly value: Types.GLOReal;

  constructor(value: Types.GLOReal) {
    super();
    this.value = value;
  }
}
