import { DebugInfoProvider } from '@glossa-glo/error';

export default abstract class Token extends DebugInfoProvider {
  public abstract value: any;
}
