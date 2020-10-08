//新規調整シェイプレイヤ
(function(me){
    //prototypeUno.jsxのロードが必要。
    var scriptName = "新規調整シェイプレイヤ";
    var createAdjust = function()
    {
        var ac = app.project.getActiveComp();
        if (ac ==null) {
            alert("コンポを選択してください。",scriptName);
            return;
        }
        var 
        var targetLayers = app.project.selectedLayers();

        app.beginUndoGroup(scriptName);
        var sl = ac.layers.addShape();
        sl.name = "調整シェイプレイヤ ";
        
        var rct = sl.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
        rct.name = "前面長方形";
        //サイズをあわせるエクスプレッション
        rct.property("ADBE Vector Rect Size").expression = "[thisComp.width*thisComp.pixelAspect,thisComp.height];";
        rct.property("ADBE Vector Rect Position").expression = "[0,0];";
        rct.property("ADBE Vector Rect Roundness").expression = "0;";

        sl.property("ADBE Transform Group").property("ADBE Anchor Point").expression = "[0,0];";
        sl.property("ADBE Transform Group").property("ADBE Position").expression = "[thisComp.width/2, thisComp.height/2];";
        

        var fil = sl.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
        fil.name = "塗り";
        fil.property("ADBE Vector Fill Color").setValue( [1,1,1] );
        sl.adjustmentLayer = true;
        if ( targetLayers.length >0 )
        {
            sl.moveBefore(targetLayers[0]); 
        }
        app.endUndoGroup();
    }
    createAdjust();
})(this);