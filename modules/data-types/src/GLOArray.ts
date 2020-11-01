import { GLODataType, GLOInteger } from '.';
import GLOType from './GLOType';

export function isGLOArray(
  dataType: GLODataType,
): dataType is GLODataType & GLOArrayLike {
  return dataType.isArray;
}

export interface GLOArrayLike {
  value: any;
  changeValue(keys: GLODataType[], value: GLODataType): void;
  getValue(keys: GLODataType[]): GLODataType | undefined;
}

export default function createGLOArray(
  componentType: typeof GLOType,
  dimensionLength: number,
) {
  return class GLOArray extends GLODataType implements GLOArrayLike {
    public static isArrayType = true;
    public isArray = true;
    public static componentType = componentType;
    public static dimensionLength = dimensionLength;

    public static defaultValue = new GLOArray();

    public readonly value: any;

    constructor() {
      super();
      this.value = {};
    }

    public print(): string {
      throw new Error('Program error: Cannot print array');
    }

    public changeValue(keys: GLOInteger[], value: GLODataType) {
      let current = this.value;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const serialized = key.serialize();
        if (!current.hasOwnProperty(serialized)) {
          current[serialized] = {};
        }
        current = current[serialized];
      }

      current[keys[keys.length - 1].serialize()] = value;
    }

    public getValue(keys: GLOInteger[]) {
      let current = this.value;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        const serialized = key.serialize();
        if (!current.hasOwnProperty(serialized)) {
          return undefined;
        }
        current = current[serialized];
      }

      return current[keys[keys.length - 1].serialize()];
    }
  };
}
