import { GLODataType, GLOInteger, GLOReal } from '@glossa-glo/data-types';
import LibraryFunction from './LibraryFunction';

export default new LibraryFunction(
  'Α_Μ',
  [{ args: [['τιμή', GLOReal]], returnType: GLOReal }],
  (args: GLODataType[]) => {
    const value = (args[0] as GLOReal).value;

    return new GLOInteger(Math.trunc(value));
  },
);
