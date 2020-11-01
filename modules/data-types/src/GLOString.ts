import { GLODataType } from '.';

export default class GLOString extends GLODataType {
  constructor(public readonly value: string) {
    super();
  }

  public print() {
    return this.value;
  }

  public lessThan(right: GLOString): boolean {
    return this.value < right.value;
  }
  public greaterThan(right: GLOString): boolean {
    return this.value > right.value;
  }
  public lessEqualsThan(right: GLOString): boolean {
    return this.value <= right.value;
  }
  public greaterEqualsThan(right: GLOString): boolean {
    return this.value >= right.value;
  }
  public equals(right: GLOString): boolean {
    return this.value == right.value;
  }
  public notEquals(right: GLOString): boolean {
    return this.value != right.value;
  }
}
