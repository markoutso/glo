import GLODataType from './GLODataType';
import GLOReal from './GLOReal';

export default class GLOInteger extends GLODataType {
  constructor(public readonly value: number) {
    super();

    this.promote.set(GLOReal, () => {
      return new GLOReal(this.value);
    });
  }

  public promote: Map<typeof GLODataType, () => GLODataType> = new Map();

  public static promotable = [GLOReal];

  public serialize() {
    return this.value;
  }

  public print() {
    return this.value.toString();
  }

  public add(right: GLOInteger): GLOInteger {
    return new GLOInteger(this.value + right.value);
  }
  public subtract(right: GLOInteger): GLOInteger {
    return new GLOInteger(this.value - right.value);
  }
  public multiply(right: GLOInteger): GLOInteger {
    return new GLOInteger(this.value * right.value);
  }
  public divide(right: GLOInteger): GLOReal {
    return new GLOReal(this.value / right.value);
  }
  public integerDivide(right: GLOInteger): GLOInteger {
    return new GLOInteger(Math.trunc(this.value / right.value));
  }
  public mod(right: GLOInteger): GLOInteger {
    return new GLOInteger(this.value % right.value);
  }
  public exponent(right: GLOInteger): GLOInteger {
    return new GLOInteger(Math.pow(this.value, right.value));
  }
  public equals(right: GLOInteger): boolean {
    return this.value == right.value;
  }
  public notEquals(right: GLOInteger): boolean {
    return this.value != right.value;
  }
  public lessThan(right: GLOInteger): boolean {
    return this.value < right.value;
  }
  public greaterThan(right: GLOInteger): boolean {
    return this.value > right.value;
  }
  public lessEqualsThan(right: GLOInteger): boolean {
    return this.value <= right.value;
  }
  public greaterEqualsThan(right: GLOInteger): boolean {
    return this.value >= right.value;
  }
  public unaryPlus(): GLOInteger {
    return new GLOInteger(this.value);
  }
  public unaryMinus(): GLOInteger {
    return new GLOInteger(-this.value);
  }
}
