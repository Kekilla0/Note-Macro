import { helper } from './helper.js';
import { settings } from './settings.js';
import { NoteMacroConfig } from './NoteMacroConfig.js'

Hooks.on('init', settings.register);
Hooks.on('setup', helper.register);
Hooks.on('renderNoteConfig', NoteMacroConfig._init);


/*
  Minor Fixes
    immitate foundry code execution?
*/
