import { Token } from '.';
import * as Types from '@glossa-glo/data-types';

export default class StringConstantToken extends Token {
  constructor(public readonly value: Types.GLOString) {
    super();
  }
}
