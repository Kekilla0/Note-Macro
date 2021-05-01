import { logger } from './logger.js';

export class settings{
  static name = "Note Macro";
  static key = "note-macro";

  static value(str){
    return game.settings.get(this.key, str);
  }
  

  static register(){
    logger.info(`Registering All Settings.`);
    settings.logger();
    settings.icon();
  }

  static logger(){
    game.settings.register(
      this.key,
      'debug',
      {
        name : i18n("settings.debug.title"),
        hint : i18n("settings.debug.hint"),
        scope : "client",
        config : true,
        default : false,
        type : Boolean
      } 
    );
  }
  static icon(){
    game.settings.register(
      this.key,
      'icon',
      {
        name : i18n("settings.icon.title"),
        hint : i18n("settings.icon.hint"),
        scope : "world",
        config : true,
        default : false,
        type : Boolean
      } 
    );
  }
}