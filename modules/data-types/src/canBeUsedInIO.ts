import { GLOBoolean, GLODataType, GLOInteger, GLOReal, GLOString } from '.';

export function canBeRead(type: typeof GLODataType) {
  if (type === GLOInteger || type === GLOReal || type === GLOString) {
    return true;
  } else {
    return false;
  }
}

export function canBeWritten(type: typeof GLODataType) {
  if (
    type === GLOBoolean ||
    type === GLOInteger ||
    type === GLOReal ||
    type === GLOString
  ) {
    return true;
  } else {
    return false;
  }
}
