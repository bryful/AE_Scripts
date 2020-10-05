(function(me){
//#include "lib.jsxinc"
    
    var exec = function()
    {
        var ac = app.project.activeItem;
        if ( (ac instanceof CompItem)==false) {
            alert("コンポがアクティブじゃないです")
            return;
        }
        var sel = ac.selectedLayers;
        if(sel.length>0)
        {
            var lyr = sel[0];
            var fr = lyr.containingComp.frameRate;
            var dsf = app.project.displayStartFrame;
            var str 
                 = "    Coomp : " +lyr.containingComp.name +" ("+fr +"fps)\r\n";
            str += " duration : " + (lyr.containingComp.duration * fr) +"\r\n";
            str += "layerName : " + lyr.name +"\r\n";
            str += "startTime : " + ( lyr.startTime*fr + dsf) + "\r\n";
            str += "  inPoint : " + ( lyr.inPoint*fr + dsf) + "\r\n";
            str += " outPoint : " + ( lyr.outPoint*fr + dsf) + "\r\n";


            CONSOLE.writeLn(str);

        }else{
            alert("レイヤを選んでください");
        }

    }
    exec();
})(this);