(function(me){
//#include "lib.jsxinc"
    
    var exec = function()
    {
        var target = $.global;
        var str = "$.global \r\n";
        str += getPropertyList(target);
        CONSOLE.writeLn(str);

    }
    exec();
})(this);