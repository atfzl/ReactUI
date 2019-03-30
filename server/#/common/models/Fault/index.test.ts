import { Fault } from './';

it('should show stack trace on Error', () => {
  const fault = new Fault('error!!!', { meta: 'foobar' }, 1);

  expect(fault).toMatchSnapshot();

  expect(fault instanceof Fault).toBeTruthy();
});
