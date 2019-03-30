import { Fault } from '#/common/models/Fault';

/**
 * verify and clean stack so that it creates stable snapshots
 */
export const verifyFault = (fault: Fault) => {
  expect(fault instanceof Fault).toBeTruthy();
  expect(typeof fault.stack).toBe('string');
  const cleanFault = { ...fault, stack: undefined };
  expect(cleanFault).toMatchSnapshot();
};
