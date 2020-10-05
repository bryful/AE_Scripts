(function(me){
//#include "lib.jsxinc"
    var exec = function()
    {
        var props = app.project.selectedProperties();
        if(props.length>0)
        {
            var s = "";
            for (var i=0; i<props.length;i++)
            {
                s += "**********************\r\n"
                s += props[i].info()+"\r\n";
            }
            CONSOLE.writeLn(s);
        }
    }
    exec();
})(this);