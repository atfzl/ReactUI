import AppendIntrinsicTagApi from '#/common/api/AppendIntrinsicTag';
import CopyElementApi from '#/common/api/CopyElement';
import DeleteElementApi from '#/common/api/DeleteElement';
import FlushStylesApi from '#/common/api/FlushStyles';
import LaunchEditorApi from '#/common/api/LaunchEditor';
import AppendIntrinsicTagService from '#/services/appendIntrinsicTag';
import CopyElementService from '#/services/copyElement';
import DeleteElementService from '#/services/deleteElement';
import FlushStylesService from '#/services/flushStyles';
import LaunchEditorService from '#/services/launchEditor';
import PasteElementService from '#/services/pasteElement';
import { writeFile } from '#/utils/fs';
import { switchMap } from 'rxjs/operators';

LaunchEditorApi.answerRenderer(LaunchEditorService);
DeleteElementApi.answerRenderer(data =>
  DeleteElementService(data).pipe(
    switchMap(text => writeFile(data.fileName, text)),
  ),
);
CopyElementApi.answerRenderer(payload =>
  CopyElementService(payload.source, payload.target).pipe(
    switchMap(PasteElementService),
    switchMap(text => writeFile(payload.target.fileName, text)),
  ),
);
AppendIntrinsicTagApi.answerRenderer(data =>
  AppendIntrinsicTagService(data.tagName)(data.cursor).pipe(
    switchMap(text => writeFile(data.cursor.fileName, text)),
  ),
);
FlushStylesApi.answerRenderer(data =>
  FlushStylesService(data.style)(data.cursor).pipe(
    switchMap(text => writeFile(data.cursor.fileName, text)),
  ),
);
