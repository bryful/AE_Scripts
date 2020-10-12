(function(me){
/*
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
*/   
    
    //
    var scriptName = "カラーキー白";
    var exec = function()
	{
        var lyr = app.project.getActiveLayer();
        if (lyr!=null)
        {
            var fxg = lyr(5);

            if (fxg.canAddProperty("ADBE Color Key")==true){	
                var fx0 = fxg.addProperty("ADBE Color Key");
                fx0.name = "カラーキー白";
                fx0(1).setValue([1, 1, 1, 1]);
            }

        }
	}
    exec();
})(this);

