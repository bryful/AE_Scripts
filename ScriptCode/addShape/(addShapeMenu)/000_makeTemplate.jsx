(function(me){

    var scriptName = "makeTemplate";

    var addExpCtrolAll = function(lyr)
	{
		function addSub(lyr1,mn,na)
		{
			var efg = lyr1.property("ADBE Effect Parade");
			var fx = null;
			if (efg.canAddProperty(mn)){
				fx = efg.addProperty(mn);
				if (fx!=null) {
					fx.name = na;
					fx.enabled =false;
				}
			}
			return fx;
		}
		var ret = null;
		if (lyr==null) return ret;
		if ( lyr.matchName !="ADBE Vector Layer") return ret;

		var fx = addSub(lyr,"ADBE Slider Control","open");
		if (fx!=null) fx.property(1).setValue(100);
		var fx = addSub(lyr,"ADBE Slider Control","close");
		if (fx!=null) fx.property(1).setValue(100);
		var fx = addSub(lyr,"ADBE Slider Control","width");
		if (fx!=null) fx.property(1).setValue(1600);
		var fx = addSub(lyr,"ADBE Slider Control","height");
		if (fx!=null) fx.property(1).setValue(900);

		lyr.selected = true;
		return lyr;

	}
	var addSub = function(pb,mn,na)
		{
			var ret = null;
			if (pb.canAddProperty(mn)){
				ret = pb.addProperty(mn);
				if (ret!=null) {
					ret.name = na;
				}
			}
			return ret;
		}
    var makeTemplate = function()
	{
        var lyr = getActiveLayer();
		if (lyr==null) return;

        app.beginUndoGroup(scriptName);
		addExpCtrolAll(lyr);

		
		if ( lyr.matchName !="ADBE Vector Layer") return;
		try{
			var ct = lyr.property("ADBE Root Vectors Group");
			var g0 = addSub(ct,"ADBE Vector Group","Foo");
			if (g0 == null) {
				app.endUndoGroup();
				return;
			}
			var g0 = g0.property(2);
			var tmp = addSub(g0,"ADBE Vector Shape - Rect","size");
			tmp.enabled = false;
			tmp.property(2).setValue([1440,810]);
			tmp.property(2).expression = "[effect(\"width\")(1),effect(\"height\")(1)]";
			var tmp = addSub(g0,"ADBE Vector Filter - Offset","open");
			tmp.enabled = false;
			tmp.property(1).setValue(100);
			tmp.property(1).expression = "effect(\"open\")(1)";
			var tmp = addSub(g0,"ADBE Vector Group","Foo");
		}catch(e){
			app.endUndoGroup();
			alert(e.toString());
			return;
		}
		app.endUndoGroup();
		lyr.selected = true;
		//lyr.active = true;
	}
    makeTemplate();
})(this);