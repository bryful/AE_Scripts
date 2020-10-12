(function(me){
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
    
    var scriptName = "タイムリマップで3コマ打ちに";

    //-----------------------------
	var  exec = function()
	{
       var sel = app.project.selectedLayers();
        if (sel.length>0){
            app.beginUndoGroup(scriptName);
            for ( var i=0; i<sel.length; i++){
                sel[i].setRemapKoma(3);
            }
            app.endUndoGroup();
        }else{
            alert("no execute!");
        }
	}
    exec();
})(this);