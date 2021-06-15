import { logger } from "./logger.js";
import { settings } from "./settings.js";

export class JournalMacroConfig extends MacroConfig{
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
    data.command = this.object.getMacro()?.data?.command;
    data.name = this?.object?.data?.name || "Invalid Journal Name";
    return data;
  }

  /*
    Override
  */
  _onEditImage(event){ }

  /*
    Override
  */
  async _updateObject(event, formData){
    logger.debug("Event | ", event);
    logger.debug("formData | ", formData);

    await this.updateMacro(formData);
  }

  /*
    Override
  */
  async _onExecute(event){
    logger.debug("Event | ", event);
    event.preventDefault();
    await this.updateMacro({
      command :  this._element[0].querySelectorAll('textarea')[0].value,
      type : this._element[0].querySelectorAll('select')[1].value,
    });
    this.object.executeMacro(event);
  }

  async updateMacro({ command, type }){
    await this.object.setMacro(new Macro({
      name : this?.object?.data?.name || "Invalid Journal Name", 
      type, command, 
      scope : "global",
      author : game.user.id,
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
            if(obj instanceof JournalMacroConfig){
              Macro = obj;
              break;
            }
          }
          if(!Macro) Macro = new JournalMacroConfig(app.object);
          Macro.render(true);
      });
      html.closest('.app').find(`.open-note-macro`).remove();
      let titleElement = html.closest('.app').find('.window-title');
      openButton.insertAfter(titleElement);
    }
  }
}