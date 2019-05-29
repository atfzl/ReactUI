import * as _ from 'lodash';
import * as stable from 'stable';

export class Replacement {
  public static insert(pos: number, text: string) {
    return new Replacement(pos, pos, text);
  }

  public static delete(start: number, end: number) {
    return new Replacement(start, end, '');
  }

  public static applyReplacements(source: string, replacements: Replacement[]) {
    replacements = stable(replacements, (r1, r2) => r2.start - r1.start);

    const uniqueReplacements = _.uniqWith(replacements, _.isEqual);

    for (const replacement of uniqueReplacements) {
      source =
        source.slice(0, replacement.start) +
        replacement.text +
        source.slice(replacement.end);
    }

    return source;
  }

  constructor(
    readonly start: number,
    readonly end: number,
    readonly text = '',
  ) {}
}
