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
    settings.register_settings();
  }

  static register_settings(){
    const settingData = {
      debug : { scope : "client", config : true, default : false, type : Boolean },
      icon : { scope : "world", config : true, default : false, type : Boolean },
      eventKey : { scope : "client", config : true, default : "shiftKey", type : String, choices : settings.eventKeys, onChange : ()=> window.location.reload(), },
      journal : { scope : "world", config : true, default : false, type : Boolean, onChange : () => window.location.reload(), },
    };

    Object.entries(settingData).forEach(([key, data])=> {
      game.settings.register(
        settings.data.name, key, {
          name : settings.i18n(`settings.${key}.title`),
          hint : settings.i18n(`settings.${key}.hint`),
          ...data
        }
      );
    });
  } 
}