(function(me){
//#include "lib.jsxinc"
    
    var exec = function()
    {
        var target = system;
        var str = "system \r\n";
        str += getPropertyList(target);
        CONSOLE.writeLn(str);

    }
    exec();
})(this);