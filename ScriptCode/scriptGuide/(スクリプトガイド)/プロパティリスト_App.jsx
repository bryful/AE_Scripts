(function(me){
//#include "lib.jsxinc"
    
    var exec = function()
    {
        var target = app;
        var str = "app \r\n";
        str += getPropertyList(target);
        CONSOLE.writeLn(str);

    }
    exec();
})(this);