//
(function(me){
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
    
    var scriptName = "in点を現在の位置へ";

    //-----------------------------
	var  exec = function()
	{
        var ac =  app.project.getActiveComp();
        if(ac == null){
            alert("コンポがアクティブになっていません");
            return;
        }
        var lyr = app.project.getActiveLayer(ac);
        if (lyr != null)
        {
            if (ac.time < lyr.outPoint)
            {
                app.beginUndoGroup(scriptName);
                lyr.inPoint = ac.time;
                app.endUndoGroup();
            }
        }
	}
    exec();
})(this);