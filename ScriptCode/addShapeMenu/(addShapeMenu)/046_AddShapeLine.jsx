(function(me){
	//#include "addShapeMenu.jsxinc" //debug時用のライブラリ

	var addLineGS =function(cnt,idx)
	{
		var addP = function(ct,mn,name)
		{	
			var ret = null;
			var pg = ct;
			if(pg.matchName =="ADBE Vector Group"){
				pg = pg.property(2);
			}
			if(pg.canAddProperty(mn)==true)
			{
				ret = pg.addProperty(mn);
				if((name!=null)&&(name!="")){
					ret.name = name;
				}
			}
			return ret;

		}
		var ret = null;
		if ((cnt.matchName=="ADBE Root Vectors Group")||(cnt.matchName=="ADBE Vector Group")){
			
		}else{
			return ret;
		}
		ret = addP(cnt,"ADBE Vector Group","line");
		var pos = addP(ret,"ADBE Vector Graphic - G-Stroke","pos");
		pos.enabled = false;
		pos(4).setValue([-100,-100]);
		pos(5).setValue([100,100]);
		pos(10).setValue(6);
		var line = addP(ret,"ADBE Vector Group","line");
		line(3)(2).expression =
		"p0 = thisProperty.propertyGroup(4)(2)(\"pos\")(4).value;\r\n"+
		"p1 = thisProperty.propertyGroup(4)(2)(\"pos\")(5).value;\r\n"+
		"(p0+p1)/2;\r\n";
		line(3)(6).expression =
		"p0 = thisProperty.propertyGroup(4)(2)(\"pos\")(4).value;\r\n"+
		"p1 = thisProperty.propertyGroup(4)(2)(\"pos\")(5).value;\r\n"+
		"if(p0[0]==p1[0]){\r\n"+
		"0;\r\n"+
		"}else if (p0[1]==p1[1]){\r\n"+
		"90;\r\n"+
		"}else{\r\n"+
		"r = Math.atan(Math.abs(p1[0]-p0[0])/Math.abs(p1[1]-p0[1]))*180/Math.PI;\r\n"+
		"if (p0[1]<p1[1]) r*=-1;\r\n"+
		"if (p0[0]>p1[0]) r*=-1;\r\n"+
		"r;\r\n"+
		"}\r\n";

		var lineC = addP(line,"ADBE Vector Shape - Rect","lineC");
		lineC(2).expression = 
		 "p0 = thisProperty.propertyGroup(5)(2)(\"pos\")(4).value;\r\n"+
		"p1 = thisProperty.propertyGroup(5)(2)(\"pos\")(5).value;\r\n"+
		"w = thisProperty.propertyGroup(5)(2)(\"pos\")(10).value;\r\n"+
		"h = Math.sqrt(Math.pow(p1[0]-p0[0],2) + Math.pow(p1[1]-p0[1],2));\r\n"+
		"[w,h];\r\n";

	
		var fill = addP(ret,"ADBE Vector Graphic - Fill","");

		if(idx>0){
			var pg = ret.propertyParent;
			var retIdx = ret.propertyIndex;
			if((idx>0)&&(idx<retIdx)){
				ret.moveTo(idx);
				ret = pg.property(idx);
			}
		}
		ret.selected = true;
		return ret;

	}
	var addLineG =function()
	{
		var ret = null;
		var lyr = getActiveLayer();
		var stat = getShapeLayerStatus(lyr);
		if(stat.content==null) {
			alert("select error");
			return null;
		}
		var tt =  stat.propertyGroup;
		var idx = 0;
		if(tt!=null) {
			idx = stat.propertyGroup.propertyIndex+1;
		}
		ret = addLineGS(stat.content,idx); 
		return ret;		
	}
	addLineG();

})(this);
