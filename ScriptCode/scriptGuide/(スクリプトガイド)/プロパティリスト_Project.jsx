(function(me){
//#include "lib.jsxinc"
    
    var exec = function()
    {
        var target = app.project;
        var str = "app.project \r\n";
        str += getPropertyList(target);
        CONSOLE.writeLn(str);

    }
    exec();
})(this);