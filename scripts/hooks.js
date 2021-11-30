import { helper } from './helper.js';
import { settings } from './settings.js';
import { NoteMacroConfig } from './NoteMacroConfig.js'
import { JournalMacroConfig } from './JournalMacroConfig.js';
import { logger } from './logger.js';

Hooks.on('init', settings.register);
Hooks.on('setup', helper.register);
Hooks.on('renderNoteConfig', NoteMacroConfig._init);
Hooks.on('renderJournalSheet', JournalMacroConfig._init);
Hooks.on('createNote', helper.addNoteMacro);

Hooks.on('getJournalDirectoryEntryContext', (html, options) => helper.addContext(options));

/*
  Issues :

  Minor Fixes : 

  Ideas :
    * Update for v9 compatibility
*/
