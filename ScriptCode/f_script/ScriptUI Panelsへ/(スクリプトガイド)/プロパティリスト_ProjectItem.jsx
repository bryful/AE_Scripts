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
        var target = app.project.activeItem;
        if (target==null) {
            alert("何か選んで")
            return;
        }
        var str = "[" +target.name + "] / " + typeof(target)+" \r\n";
        str += getPropertyList(target);
        CONSOLE.writeLn(str);

    }
    exec();
})(this);