import { logger } from "./logger.js";
import { settings } from "./settings.js";

export function i18n(str)
{
  return game.i18n.localize(str);
}

export class helper{
  static name = "Note Macro";
  static key = "note-macro";
  static scope = "macro";

  static register(){
    logger.info(`Registering Helper Functions.`);

    //add Note helper functions
    Note.prototype.hasMacro = function (){
  
    }
    Note.prototype.getMacro = function (){
  
    }
    Note.prototype.executeMacro = function(...args){
  
    }
  
    //register note clicking interactions
    const orig = Note.prototype._onClickLeft;
    Note.prototype._onClickLeft = function(event) {
      if(event.data.originalEvent.shiftKey && game.user.isGM)
      {
  
      }else{
        orig.call(this, event);
      }
    };
  }
}