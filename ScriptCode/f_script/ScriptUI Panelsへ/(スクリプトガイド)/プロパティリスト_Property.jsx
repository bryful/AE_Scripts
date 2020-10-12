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
    
    var exec = function()
    {
        var sel = app.project.selectedProperty();
        if(sel.length>0)
        {
            var target = sel[0];
            var str = "[" +target.name + "] \r\n";
            str += getPropertyList(target);

            CONSOLE.writeLn(str);

        }else{
            alert("レイヤを選んでください");
        }

    }
    exec();
})(this);