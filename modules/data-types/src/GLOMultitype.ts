import GLODataType from './GLODataType';

export default function createGLOMultitype(...types: typeof GLODataType[]) {
  return class GLOMultitype extends GLODataType {
    public static multitype = types;

    public print(): string {
      throw new Error('Program error: Cannot print multitype');
    }
  };
}
