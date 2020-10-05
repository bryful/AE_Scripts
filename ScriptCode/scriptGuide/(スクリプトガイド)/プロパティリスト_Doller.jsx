(function(me){
//#include "lib.jsxinc"
    
    var exec = function()
    {
        var target = $;
        var str = "Doller \r\n";
        str += getPropertyList(target);
        CONSOLE.writeLn(str);

    }
    exec();
})(this);