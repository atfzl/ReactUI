import CopyElementApi from '#/common/api/CopyElement';
import DeleteElementApi from '#/common/api/DeleteElement';
import LaunchEditorApi from '#/common/api/LaunchEditor';
import CopyElementService from '#/services/copyElement';
import DeleteElementService from '#/services/deleteElement';
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
