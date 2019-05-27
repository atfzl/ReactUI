import DeleteElementApi from '#/common/api/DeleteElement';
import LaunchEditorApi from '#/common/api/LaunchEditor';
import DeleteElementService from '#/services/deleteElement';
import LaunchEditorService from '#/services/launchEditor';
import { writeFile } from '#/utils/fs';
import { switchMap } from 'rxjs/operators';

LaunchEditorApi.answerRenderer(LaunchEditorService);
DeleteElementApi.answerRenderer(data =>
  DeleteElementService(data).pipe(
    switchMap(text => writeFile(data.fileName, text)),
  ),
);
