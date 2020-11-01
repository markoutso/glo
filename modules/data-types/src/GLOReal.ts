import GLODataType from './GLODataType';

export default class GLOReal extends GLODataType {
  constructor(public readonly value: number) {
    super();
  }

  public print(): string {
    return this.value.toString();
  }

  public add(right: GLOReal): GLOReal {
    return new GLOReal(this.value + right.value);
  }
  public subtract(right: GLOReal): GLOReal {
    return new GLOReal(this.value - right.value);
  }
  public multiply(right: GLOReal): GLOReal {
    return new GLOReal(this.value * right.value);
  }
  public divide(right: GLOReal): GLOReal {
    return new GLOReal(this.value / right.value);
  }
  public exponent(right: GLOReal): GLOReal {
    return new GLOReal(Math.pow(this.value, right.value));
  }
  public equals(right: GLOReal): boolean {
    return this.value == right.value;
  }
  public notEquals(right: GLOReal): boolean {
    return this.value != right.value;
  }
  public lessThan(right: GLOReal): boolean {
    return this.value < right.value;
  }
  public greaterThan(right: GLOReal): boolean {
    return this.value > right.value;
  }
  public lessEqualsThan(right: GLOReal): boolean {
    return this.value <= right.value;
  }
  public greaterEqualsThan(right: GLOReal): boolean {
    return this.value >= right.value;
  }
  public unaryPlus(): GLOReal {
    return new GLOReal(this.value);
  }
  public unaryMinus(): GLOReal {
    return new GLOReal(-this.value);
  }
}
