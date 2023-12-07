export class DebugLog {
  constructor(private readonly verbose: boolean) {}

  log(message: string) {
    if (this.verbose) {
      console.log(message);
    }
  }
}
