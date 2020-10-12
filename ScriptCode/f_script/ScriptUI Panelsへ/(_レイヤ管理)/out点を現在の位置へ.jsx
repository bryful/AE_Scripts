(function(me){
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
    
    var scriptName = "out点を現在の位置へ";

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
            var lt = 0;
            if(( lyr.source !=null)&&( lyr.source.duration !=0))
            {
                lt = lyr.startTime + lyr.source.duration;
            }else{
                lt = ac.duration;
            }
            if ( (ac.time < lt)&&(ac.time >= lyr.inPoint))
            {
                app.beginUndoGroup(scriptName);
                lyr.outPoint = ac.time;
                app.endUndoGroup();
            }
        }
	}
    exec();
})(this);