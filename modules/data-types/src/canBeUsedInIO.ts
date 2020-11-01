import { GLOBoolean, GLODataType, GLOInteger, GLOReal, GLOString } from '.';

export default function canBeUsedInIO(type: typeof GLODataType) {
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
