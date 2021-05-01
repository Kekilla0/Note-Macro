import { logger } from './logger.js';
import { helper } from './helper.js';
import { settings } from "./settings.js";


logger.info('Initializing Module');
Hooks.on('init', settings.register);
Hooks.on('ready', helper.register);
Hooks.on('renderNoteConfig', NoteMacroConfig._init);

