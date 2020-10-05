(function(me){
//#include "lib.jsxinc"
    
    var exec = function()
    {
        var sel = app.project.selectedPropertyGroup();
        if(sel.length>0)
        {
            var target = sel[0];
            var str = "[" +target.name + "] \r\n";
            str += getPropertyList(target);
            if(target.numProperties>0)
            {
                for (var i=1; i<=target.numProperties;i++)
                {
                    var pp = target.property(i);
                    str += "  Property(" + i + ") = " + pp.name +"[" + pp.matchName+"]\r\n"; 
                }
            }
            CONSOLE.writeLn(str);

        }else{
            alert("レイヤを選んでください");
        }

    }
    exec();
})(this);