import { GLODataType } from '.';

export default class GLOVoid extends GLODataType {
  public print(): string {
    throw new Error('Program error: Cannot print void');
  }
}
