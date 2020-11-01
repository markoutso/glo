import { GLODataType, GLOReal } from '@glossa-glo/data-types';
import LibraryFunction from './LibraryFunction';

export default new LibraryFunction(
  'Ε',
  [{ args: [['τιμή', GLOReal]], returnType: GLOReal }],
  args => {
    const value = (args[0] as GLOReal).value;

    return new GLOReal(Math.exp(value));
  },
);
