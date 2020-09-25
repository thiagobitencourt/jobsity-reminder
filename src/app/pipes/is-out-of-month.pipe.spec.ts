import { IsOutOfMonthPipe } from './is-out-of-month.pipe';

describe('IsOutOfMonthPipe', () => {
  it('create an instance', () => {
    const pipe = new IsOutOfMonthPipe();
    expect(pipe).toBeTruthy();
  });
});
