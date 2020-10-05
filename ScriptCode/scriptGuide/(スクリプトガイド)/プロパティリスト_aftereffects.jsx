(function(me){
//#include "lib.jsxinc"
    
    var exec = function()
    {
        var target = aftereffects;
        var str = "aftereffects \r\n";
        str += getPropertyList(target);
        CONSOLE.writeLn(str);

    }
    exec();
})(this);