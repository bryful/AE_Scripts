(function(me){
    // ******************************
    var activeComp = function()
    {
        var ac = app.project.activeItem;
        if ((ac instanceof CompItem)==false){
            alert("no aciteved comp");
            return null;
        }
        return ac
    }
    var slectedTextLayers =function(cmp)
    {
        var ret = [];
        var sel = cmp.selectedLayers;
        if (sel.length>0)
        {
            for ( var i=0; i<sel.length;i++)
            {
                if(sel[i] instanceof TextLayer)
                {
                    ret.push(sel[i]);
                }
            }
        }
        return ret;
    }
    var dellNURI = function(lyr)
    {
        var ret = false;
        if ( !( lyr instanceof ShapeLayer)) return ret; 

        var rg = lyr.property("ADBE Root Vectors Group");
        if (rg.numProperties<=0){
            alert("コンテンツがない");
            return false;
        }
        var colFill = null;
        var colStroke = null;
        for ( var i=1; i<=rg.numProperties;i++){
            var t = rg.property(i);
            if (t.matchName !="ADBE Vector Group") continue;
            var t2 = t.property("ADBE Vectors Group");
            if (t2.numProperties<=0) continue;
            
            for ( var j  = t2.numProperties; j >=1; j--) {
                var t3 = t2.property(j);
                var mn = t3.matchName;
                if (mn=="ADBE Vector Graphic - Fill") {
                    colFill = t3.property(4).value;
                    t3.remove();

                }else if ( mn=="ADBE Vector Graphic - Stroke") {
                    colStroke = t3.property(3).value;
                    t3.remove();
                }
            }
        
        }
        try{
            var f = rg.addProperty("ADBE Vector Filter - Merge");
            var f = rg.addProperty("ADBE Vector Graphic - Fill");
            f.property(4).setValue(colFill);
            f.enabled = false;
            var f = rg.addProperty("ADBE Vector Graphic - Stroke");
            f.property(3).setValue(colStroke);
            f.enabled = false;
        }catch(e){

        }
        return true;


    }    
    // ******************************
    var toShape = function(lyr)
    {
        var ac = lyr.containingComp;
        lyr.selected = true;
        app.executeCommand(3781);
        lyr.selected = false;
        var shp = ac.selectedLayers[0];
        shp.selected = false;
        dellNURI(shp);        
        shp.moveAfter(lyr);
    }
    // ******************************
    var exec = function()
    {
        var ac = activeComp();
        if(ac==null) return;
        var sel = slectedTextLayers(ac);
        if(sel.length<=0) return;

        app.beginUndoGroup("TextToShape");
        //選択範囲を消す
        for ( var i=0; i<sel.length;i++) sel[i].selected = false;
        for ( var i=0; i<sel.length;i++)
        {
            toShape(sel[i]);
        }
        app.endUndoGroup();
    }
    exec();

})(this);