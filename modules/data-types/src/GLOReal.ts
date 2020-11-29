import GLODataType from './GLODataType';

export default class GLOReal extends GLODataType {
  public static readonly PRECISION = 2;
  public internalValue: string;

  public get value() {
    return parseFloat(this.internalValue);
  }

  constructor(value: number) {
    super();
    // Hack to avoid toFixed rounding: Add one more digit and remove after string conversion
    this.internalValue = value.toFixed(GLOReal.PRECISION + 1).slice(0, -1);
  }

  public print(): string {
    return this.internalValue;
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
