import { logger } from './logger.js';

export class settings {
  static value(key){
    return game.settings.get(this.data.name, key);
  }

  static registerModule(key){
    settings.data = game.modules.get(key)?.data;
    if(!settings.data) return logger.error("Module Registration Error | Data Error");

    settings.eventKeys = {
      "shiftKey" : "Shift Key",
      "altKey" : "Alt Key",
      "ctrlKey" : "Ctrl Key"
    };
  }
  
  static i18n(key){
    return game.i18n.localize(key);
  }

  static register(){
    settings.registerModule("note-macro");
    logger.info(`Registering All Settings.`);    
    settings.logger();
    settings.icon();
    settings.eventKey();
  }

  static logger(){
    game.settings.register(
      settings.data.name,
      'debug',
      {
        name : settings.i18n("settings.debug.title"),
        hint : settings.i18n("settings.debug.hint"),
        scope : "client",
        config : true,
        default : false,
        type : Boolean
      } 
    );
  }
  static icon(){
    game.settings.register(
      settings.data.name,
      'icon',
      {
        name : settings.i18n("settings.icon.title"),
        hint : settings.i18n("settings.icon.hint"),
        scope : "world",
        config : true,
        default : false,
        type : Boolean
      } 
    );
  }
  static eventKey(){
    game.settings.register(
      settings.data.name,
      'eventKey',
      {
        name : settings.i18n("settings.eventKey.title"),
        hint : settings.i18n("setting.eventKey.hint"),
        scope : "client",
        config : true,
        default : "shiftKey",
        type : String,
        choices : settings.eventKeys,
        onChange : window.location.reload,
      }
    )
  }
}