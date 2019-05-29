import { TagCursor } from '#/common/models/file';
import * as launchEditorUtil from 'react-dev-utils/launchEditor';
import { of } from 'rxjs';

const launchEditor = (cursor: TagCursor) =>
  of(launchEditorUtil(cursor.fileName, cursor.lineNumber, cursor.columnNumber));

export default launchEditor;
