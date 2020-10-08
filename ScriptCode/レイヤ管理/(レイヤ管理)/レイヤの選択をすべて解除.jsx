(function(me){
    //prototypeUno.jsxのロードが必要。
    
    var scriptName = "レイヤの選択をすべて解除";
    //-----------------------------
	var  layerSelectionAllOFF = function()
	{
        var c = app.project.getActiveComp();
        if(c!=null)
        {
            app.beginUndoGroup(scriptName);
            c.selectionNone();
            app.endUndoGroup();
        }else{
            alert("Comp no actived!");
        }
	}
    layerSelectionAllOFF();
})(this);