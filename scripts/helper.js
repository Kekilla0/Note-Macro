import { logger } from "./logger.js";
import { settings } from "./settings.js";

export class helper{

  static register(){
    logger.info(`Registering Helper Functions.`);

    //add Note helper functions
    NoteDocument.prototype.hasMacro = function (){
      return !!this.getFlag(settings.data.name,"macro")?.data?.command;
    }

    NoteDocument.prototype.getMacro = function (){
      if(this.hasMacro())
        return new Macro(this.getFlag(settings.data.name, "macro").data);
    }

    NoteDocument.prototype.setMacro = async function(macro){
      logger.debug("SetMacro | ", macro);
      if(!macro instanceof Macro) return logger.error("Incorrect Macro type");
      await this.unsetFlag(settings.data.name, "macro");
      return await this.setFlag(settings.data.name, "macro", { data :  macro.data });
    }

    NoteDocument.prototype.executeMacro = function(...args){
      logger.debug("executeMacro | args | ", args);
      if(this.hasMacro()){
        switch(this.getMacro().data.type){
          case "chat" :
            return this._executeChat(...args);
          case "script" :
            return this._executeScript(...args);
        }
      }
    }

    NoteDocument.prototype._executeChat = function(...args){  
      const macro = this.getMacro();

      if(!macro) return;
      try {
        ui.chat.processMessage(macro.data.command);
      }catch(err){
        ui.notifications.error("There was an error in your chat message syntax.");
        logger.error(err);
      } 
    }

    NoteDocument.prototype._executeScript = function(...args){
      logger.debug("_executeScript | args | ", args[0].data.originalEvent.constructor.metadata);

      //add variable to the evaluation of the script
      const note = this;
      const macro = note.getMacro();
      const speaker = ChatMessage.getSpeaker();
      const actor = game.actors.get(speaker.actor);
      const token = canvas.tokens.get(speaker.token);
      const character = game.user.character;
      const event = args[0]?.data?.originalEvent ? (args.shift()).data.originalEvent : undefined;

      //build script execution
      const body = `(async () => {
        ${macro.data.command}
      })();`;
      const fn = Function("note", "speaker", "actor", "token", "character", "event", "args", body);

      //attempt script execution
      try {
        fn.call(macro, note, speaker, actor, token, character, event, args);
      }catch (err) {
        ui.notifications.error(`There was an error in your macro syntax. See the console (F12) for details`);
        logger.error(err);
      }
    }
  
    //register note clicking interactions 
    const orig = Canvas.prototype._onClickLeft;
    Canvas.prototype._onClickLeft = function(event){
      logger.debug("Click Detected | Accepted : ", event.data.originalEvent[settings.value("eventKey")]);
      if(event.data.originalEvent[settings.value("eventKey")] && game.user.isGM){
        const document = this.notes?._hover?.document;

        if(document) document.executeMacro(event);
      }else{
        orig.call(this, event);
      }
    }

    Note.prototype._onClickLeft = function(event) {
      Canvas.prototype._onClickLeft.call(canvas, event);
    }
  }
}