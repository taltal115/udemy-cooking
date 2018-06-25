export class CounterService {
  count: number = 0;

  countOp() {
    this.count++;
    console.log(`the count is: ${this.count}`);
  }
}
