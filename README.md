# Note Macro

This is a FoundryVTT module that allows macros to be saved inside of a note. The note can then be executed by hovering over the note and [Shift, Alt, Ctrl] Clicking the note.
You can execute the macro from the "noteDocument" class using the executeMacro(...args) function, from the note-macros macro window, or by [Shift, Alt, Ctrl] clicking the note.

# Known Issues

None known.

# Installation

1. Inside Foundry's Configuration and Setup screen, go to **Add-on Modules**
2. Click "Install Module"
3. Seach for the Module, install in the Module Manager.
4. (OR) In the Manifest URL field paste: `https://github.com/Kekilla0/Note-Macro/raw/master/module.json`

# Usage

Once activated, open an Tile Configuration Window, click on the Note Macro button to open the Macro window.
![In Action](https://i.gyazo.com/82482f226e3262808701a9bcad5557ac.gif)

Various different settings will change the way Tile Macro interacts with the game.
![In Action](https://i.gyazo.com/6244808d730b93a0b8a38a510820c6ba.png)

With a simple [Shift, Alt, Ctrl] click, execute the macro directly from the canvas!
![In Action](https://i.gyazo.com/46414ca582561ac56113d78007e36645.gif)

## Available Helpers
The following variables are available
`note` - The note placeable the macro is bound to
`journal` - The respective journal of the note
`speaker` - Return of ChatMessage.getSpeaker()
`actor` - The actor associated with the speaker
`token` - The token associated with the speaker
`character` - The executing user's character

## Added Item Functionality

1. TileDocument.hasMacro() => returns boolean on if the note has a macro command
2. TileDocument.getMacro() => returns Macro instance, if the note has a macro command
3. TileDocument.setMacro(Macro) => overwrites and saves given Macro to the note
4. TileDocument.executeMacro(...args) => executes Macro command, giving note, macro, speaker, actor, token, character, and event constants. Pass an event as the first argument.

# Support

For questions, feature requests, or bug reports, feel free to contact me on the Foundry Discord (Kekilla#7036) or open an issue here directly.

# License

This Foundry VTT module, written by Kekilla, is licensed under [Mit License](https://github.com/Kekilla0/Note-Macro/blob/main/LICENSE)

This work is licensed under [Foundry Virtual Tabletop EULA - Limited License Agreement for module development](https://foundryvtt.com/article/license/).
