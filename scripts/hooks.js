import { helper } from './helper.js';
import { settings } from './settings.js';
import { NoteMacroConfig } from './NoteMacroConfig.js'
import { JournalMacroConfig } from './JournalMacroConfig.js';

Hooks.on('init', settings.register);
Hooks.on('setup', helper.register);
Hooks.on('renderNoteConfig', NoteMacroConfig._init);
Hooks.on('renderJournalSheet', JournalMacroConfig._init);
Hooks.on('createNote', helper.addNoteMacro);


/*
  Issues :
    Transfer of Macro from Journal to Note is not working.

  Minor Fixes : 

  Ideas :
    Attach Macro to Journal (for editting not "Execution"), when note is created from Journal, copy the macro over to the NoteDocument
    context menu for Journal Macro propagation to all notes linked to that specific journal.
*/
