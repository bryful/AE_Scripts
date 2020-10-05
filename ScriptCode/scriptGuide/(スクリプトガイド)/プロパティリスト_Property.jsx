(function(me){
//#include "lib.jsxinc"
    
    var exec = function()
    {
        var sel = app.project.selectedProperty();
        if(sel.length>0)
        {
            var target = sel[0];
            var str = "[" +target.name + "] \r\n";
            str += getPropertyList(target);

            CONSOLE.writeLn(str);

        }else{
            alert("レイヤを選んでください");
        }

    }
    exec();
})(this);