(function(me){
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
    
    var scriptName = "レイヤの選択をすべて解除";
    //-----------------------------
	var  exec = function()
	{
        var ac = app.project.getActiveComp();
        if(ac!=null)
        {
            var sel = ac.selectedLayers;
            if (sel.length>0){
                app.beginUndoGroup(scriptName);
                for (var i=0; i<sel.length;i++)
                {
                    sel[i].selected = false;
                }                

                app.endUndoGroup();
            }
        }else{
            alert("Comp no actived!");
        }
	}
    exec();
})(this);