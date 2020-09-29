//createShapeLayer
(function(me){
    //prototypeUno.jsxのロードが必要。
    var scriptName = "createShapeLayer";
    var createShapeLayer = function()
	{
		var ret = false;
		
		var ac = app.project.getActiveComp();
		if (ac==null) return ret;

		var  lyr = null;
		
		if (ac.selectedLayers.length>0)
		{
			lyr = ac.selectedLayers[0];
		}

		
		app.beginUndoGroup(scriptName);
		var sl = ac.layers.addShape();
		if (sl !== null ){
            if (lyr !== null)
            {
                sl.moveBefore(lyr);
            }
            ret = true;
		}else{
	    	alert("errer!");
        }
		app.endUndoGroup();
        return ret;
	}
    createShapeLayer();
})(this);