(function(me){
//#include "lib.jsxinc"
    
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