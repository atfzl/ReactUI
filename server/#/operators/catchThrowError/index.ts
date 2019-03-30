import { Fault, FaultArguments } from '#/common/models/Fault';
import { Observable } from 'rxjs';

export const catchThrowFault = <T>(...args: FaultArguments<any>) => (
  source: Observable<T>,
) => {
  return new Observable<T>(observer => {
    return source.subscribe({
      next(x) {
        observer.next(x);
      },
      error(err) {
        observer.error(
          new Fault(args[0], { ...args[1], baseError: err }, args[2]),
        );
      },
      complete() {
        observer.complete();
      },
    });
  });
};
