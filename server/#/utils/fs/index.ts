import * as fs from 'fs';
import { bindNodeCallback } from 'rxjs';

export const writeFile = bindNodeCallback(fs.writeFile);
