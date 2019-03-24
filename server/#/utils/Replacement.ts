import * as stable from 'stable';
import * as ts from 'typescript';

export class Replacement {
  public static insert(pos: number, text: string) {
    return new Replacement(pos, pos, text);
  }

  public static delete(start: number, end: number) {
    return new Replacement(start, end, '');
  }

  public static replaceNodeWithText<T extends ts.Node, Y extends ts.Node>(
    source: T,
    node: Y,
    text: string,
  ) {
    return [
      Replacement.delete(
        node.getStart() - source.getStart(),
        node.getEnd() - source.getStart(),
      ),
      Replacement.insert(node.getStart() - source.getStart(), text),
    ];
  }

  public static applyReplacements(source: string, replacements: Replacement[]) {
    replacements = stable(replacements, (r1, r2) => r2.start - r1.start);

    for (const replacement of replacements) {
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
