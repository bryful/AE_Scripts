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
    var scriptName = "コンポのサイズを設定";
	

    var exec = function()
    {
        var props = app.project.selectedProperty();
        if(props.length>0)
        {
            var s = "";
            for (var i=0; i<props.length;i++)
            {
                s += "// **********************\r\n"
                s += props[i].getPathString()+"\r\n";
                s += props[i].getPathStringIndex()+"\r\n";
            }

            CONSOLE.writeLn(s);
        }
    }
    exec();
})(this);