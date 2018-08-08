/* tslint:disable:no-unused-variable */

import { ReversePipe } from './reverse.pipe';

describe('AppComponent', () => {
  it('should create the app', (() => {
    const reverse = new ReversePipe();
    expect(reverse.transform('tal')).toEqual('lat');
  }));
});
