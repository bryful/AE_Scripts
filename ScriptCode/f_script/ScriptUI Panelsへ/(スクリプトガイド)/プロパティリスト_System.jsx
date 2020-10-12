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
        var target = system;
        var str = "system \r\n";
        str += getPropertyList(target);
        CONSOLE.writeLn(str);

    }
    exec();
})(this);