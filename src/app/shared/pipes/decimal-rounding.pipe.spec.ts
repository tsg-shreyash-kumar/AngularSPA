import { DecimalRoundingPipe } from './decimal-rounding.pipe';

describe('DecimalRoundingPipe', () => {
  it('create an instance', () => {
    const pipe = new DecimalRoundingPipe();
    expect(pipe).toBeTruthy();
  });
});
