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
    Note.prototype.hasMacro = function (){
      return !!this.document.getFlag(settings.data.id, "macro.command");
    }

    Note.prototype.getMacro = function (){
      if(this.hasMacro())
        return new Macro(this.document.getFlag(settings.data.id, "macro"));
    }

    Note.prototype.getJournal = function(){
      if(this.entry.id)
        return game.journal.get(this.entry.id);
    }

    Note.prototype.setMacro = async function(macro){
      logger.debug("SetMacro | ", macro);
      if(!macro instanceof Macro) return logger.error(settings.i18n("error.setMacro"));
      await this.document.unsetFlag(settings.data.id, "macro");
      return await this.document.setFlag(settings.data.id, "macro", macro.toObject());
    }

    Note.prototype.executeMacro = function(...args){
      logger.debug("executeMacro | args | ", args);
      if(this.hasMacro()){
        switch(this.getMacro().type){
          case "chat" :
            return this._executeChat(...args);
          case "script" :
            return this._executeScript(...args);
        }
      }

      function executeChat(...args){

      }

      function executeScript(...args){

      }
    }

    Note.prototype._executeChat = function(...args){  
      const macro = this.getMacro();

      if(!macro) return;
      try {
        ui.chat.processMessage(macro.command);
      }catch(err){
        ui.notifications.error(settings.i18n("error.chatMacro"));
        logger.error(err);
      } 
    }

    Note.prototype._executeScript = function(...args){
      //add variable to the evaluation of the script
      const note = this;
      const journal = note.getJournal();
      const macro = note.getMacro();
      const speaker = ChatMessage.getSpeaker();
      const actor = game.actors.get(speaker.actor);
      const token = canvas.tokens.get(speaker.token);
      const character = game.user.character;
      const event = getEvent();

      //build script execution
      const body = `(async () => {
        ${macro.command}
      })();`;
      const fn = Function("note", "journal", "speaker", "actor", "token", "character", "event", "args", body);

      //attempt script execution
      try {
        fn.call(macro, note, journal, speaker, actor, token, character, event, args);
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
      //Execute if the key is held and gm or if player execution is enabled
      if(event.data.originalEvent[settings.value("eventKey")] && (game.user.isGM||settings.value("permission"))){ 
        const note = this.notes?.hover;
        logger.debug("Corresponding Note:",note)
        if(note) note.executeMacro(event);
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
      if(!macro instanceof Macro) return logger.error(settings.i18n("error.setMacro"));
      await this.unsetFlag(settings.data.id, "macro");
      return await this.setFlag(settings.data.id, "macro", macro.toObject());
    }

    JournalEntry.prototype.hasMacro = function(){
      return !!this.getFlag(settings.data.id, "macro.command");
    }

    JournalEntry.prototype.getMacro = function(){
      if(this.hasMacro())
        return new Macro(this.getFlag(settings.data.id, "macro"));
    }

    JournalEntry.prototype.executeMacro = function(...args){
      if(!this.hasMacro()) return;

      switch(this.getMacro().type){
        case "chat" :
          return this._executeChat(...args);
        case "script" :
          return this._executeScript(...args);
      }
    }

    JournalEntry.prototype._executeChat = function(){
      const macro = this.getMacro();

      if(!macro) return;
      try {
        ui.chat.processMessage(macro.command);
      }catch(err){
        ui.notifications.error(settings.i18n("error.chatMacro"));
        logger.error(err);
      }
    }

    JournalEntry.prototype._executeScript = function(...args){
      //add variable to the evaluation of the script
      const journal = this;
      const macro = journal.getMacro();
      const speaker = ChatMessage.getSpeaker();
      const actor = game.actors.get(speaker.actor);
      const token = canvas.tokens.get(speaker.token);
      const character = game.user.character;
      const event = getEvent();

      //build script execution
      const body = `(async () => {
        ${macro.command}
      })();`;
      const fn = Function("journal", "speaker", "actor", "token", "character", "event", "args", body);

      //attempt script execution
      try {
        fn.call(macro, journal, speaker, actor, token, character, event, args);
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
  }

  static addContext(options){
    if(!game.user.isGM) return;

    logger.info("Adding Context Menu Items");

    options.push({
      name : "Update All Note Macros",
      icon : '<i class="fas fa-redo"></i>',
      condition : () => game.user.isGM,
      callback : (li) => helper.updateNotes(li?.data("entityId"))
    });
  }

  static async updateNotes(_id){
    logger.debug("Update Notes Called | ", _id);
    
    const journal = game.journal.get(_id);
    const notes = game.scenes.reduce((a,s) => {
      const n = s.notes.filter(note => note.entry.id === _id);
	  return a.concat(n);
    }, []);

    logger.debug({journal, notes});

    const macro = journal.getMacro();

    if(!macro) return;

    for(const note of notes)
      await note.object.setMacro(macro);
  }

  static async addNoteMacro(document, options, id){
    if(!settings.value("journal")) return;
    let journal = document.object.getJournal();

    logger.debug(document, journal);

    if(journal.hasMacro())
      await document.object.setMacro(journal.getMacro());

    logger.debug("Attempted Macro Transfer", document, journal);
  }


}