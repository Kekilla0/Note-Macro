import { logger } from "./logger.js";
import { settings } from "./settings.js";

export class helper{

  static register(){
    logger.info(`Registering Helper Functions.`);
    helper.registerNote();
    helper.registerJournal();
  }

  static registerNote(){
    logger.info(`Registering Note Helper Functions.`);
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
      if(!macro instanceof Macro) return logger.error(settings.i18n("error.setMacro"));
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
        ui.notifications.error(settings.i18n("error.chatMacro"));
        logger.error(err);
      } 
    }

    NoteDocument.prototype._executeScript = function(...args){
      //add variable to the evaluation of the script
      const note = this;
      const macro = note.getMacro();
      const speaker = ChatMessage.getSpeaker();
      const actor = game.actors.get(speaker.actor);
      const token = canvas.tokens.get(speaker.token);
      const character = game.user.character;
      const event = getEvent();

      //build script execution
      const body = `(async () => {
        ${macro.data.command}
      })();`;
      const fn = Function("note", "speaker", "actor", "token", "character", "event", "args", body);

      //attempt script execution
      try {
        fn.call(macro, note, speaker, actor, token, character, event, args);
      }catch (err) {
        ui.notifications.error(settings.i18n("error.scriptMacro"));
        logger.error(err);
      }

      function getEvent(){
        let a = args[0];
        if(a instanceof Event) return args.shift();
        if(a?.originalEvent instanceof Event) return args.shift().originalEvent;
        if(a?.data?.originalEvent instanceof Event) return args.shift().data.originalEvent;
        return undefined;
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

  static registerJournal(){
    logger.info(`Registering Journal Helper Functions.`);

    JournalEntry.prototype.setMacro = async function(macro){
      logger.debug("SetMacro | ", macro);
      if(!macro instanceof Macro) return logger.error(settings.i18n("error.setMacro"));
      await this.unsetFlag(settings.data.name, "macro");
      return await this.setFlag(settings.data.name, "macro", { data :  macro.data });
    }

    JournalEntry.prototype.hasMacro = function(){
      return !!this.getFlag(settings.data.name, `macro`)?.data?.command;
    }

    JournalEntry.prototype.getMacro = function(){
      if(this.hasMacro())
        return new Macro(this.getFlag(settings.data.name, `macro`).data);
    }

    JournalEntry.prototype.executeMacro = function(...args){
      if(!this.hasMacro()) return;

      switch(this.getMacro().data.type){
        case "chat" :
          //return this._executeChat(...args);
          break;
        case "script" :
          //return this._executeScript(...args);
      }
    }
  }

  static async addNoteMacro(document, options, id){
    const wait = async (ms) => new Promise((resolve)=> setTimeout(resolve, ms));
    let journal = game.journal.get(document.data.entryId);
    let macro = journal.getMacro();

    logger.debug(document);

    await wait(1000);

    if(!macro)
      await document.setMacro(macro);

    logger.debug("Attempted Macro Transfer", document, macro);
  }
}