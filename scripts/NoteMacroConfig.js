import { logger } from "./logger.js";
import { settings } from "./settings.js";

export class NoteMacroConfig extends MacroConfig{
  /*
    Override
  */
  constructor(object, options){
    super(object,options);
  }

  /*
    Override
  */
  static get defaultOptions(){
    return mergeObject(super.defaultOptions, {
      template : "modules/note-macro/templates/macro-config.html",
      sheets : ["sheet","macro-sheet"],
    });
  }

  /*
    Override
  */
  async getData(){
    const data = super.getData();
    logger.debug(this);
    data.command = this.document.object.getMacro()?.command || "";
    data.name = this.document.object.getJournal()?.name || "Invalid Journal Name";
    return data;
  }

  /*
    Override
  */
  _onEditImage(event){  }

  /*
    Override
  */
  async _updateObject(event,formData){
    await this.updateMacro(formData);
  }

  /*
    Override
  */
  async _onExecute(event){
    event.preventDefault();
    await this.updateMacro({ 
      command : this._element[0].querySelectorAll('textarea')[0].value, 
      type : this._element[0].querySelectorAll('select')[1].value,
    });
    this.document.object.executeMacro(event);
  }

  async updateMacro({ command, type }){
    await this.document.object.setMacro(new Macro({
      name : this.document.object.getJournal().name || "Invalid Journal Name", type, scope : "global", command, author : game.user.id,
    }));
  }

  static _init(app, html, data){
    logger.debug("App  | ", app);
    logger.debug("HTML | ", html);
    logger.debug("Data | ", data);

    if(game.user.isGM){
      let openButton = $(`<a class="open-note-macro" title="note-macro"><i class="fas fa-sd-card"></i>${settings.value("icon") ? "" : "Note Macro"}</a>`);
      openButton.click( event => {
          let Macro = null;
          for(let key in app.document.apps){
            let obj = app.document.apps[key];
            if(obj instanceof NoteMacroConfig){
              Macro = obj;
              break;
            }
          }
          if(!Macro) Macro = new NoteMacroConfig(app.object);
          Macro.render(true);
      });
      html.closest('.app').find(`.open-note-macro`).remove();
      let titleElement = html.closest('.app').find('.window-title');
      openButton.insertAfter(titleElement);
    }
  }
}