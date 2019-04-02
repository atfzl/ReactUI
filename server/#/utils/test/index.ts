import { Fault } from '#/common/models/Fault';

/**
 * verify and clean stack so that it creates stable snapshots
 */
export const verifyFault = (fault: Fault) => {
  expect(fault instanceof Fault).toBeTruthy();
  expect(typeof fault.stack).toBe('string');
  if (fault.data && fault.data.parent && fault.data.parent.stack) {
    delete fault.data.parent.stack;
  }
  const cleanFault = { ...fault, stack: undefined };
  expect(cleanFault).toMatchSnapshot();
};
