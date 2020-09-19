
	// ********************************************************************************
	
	// ********************************************************************************
	// ********************************************************************************

#includepath "./;../"
#include "bryScriptLib.jsxinc"
(function(me){
	//UIの配列
	//ターゲット
	
	var layoutMode = 0;
	var layoutRow = 1;
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var aeclipPath = File.decode($.fileName.getParent()+"/aeclip.exe");
	var targetFolder = new Folder ( File.decode($.fileName.getParent() + "/(" +$.fileName.getName().changeExt("")+ ")"));
	var prefPath = new Folder ( File.decode($.fileName.getParent() + "/" +$.fileName.getName().changeExt(".pref")));
// #region matchNames
	var matchNames = [
		"layout",//00
		"layout2",//00
		"new Layer",//01
		"ADBE Vector Group",//02
		"ADBE Vector Shape - Rect",//03
		"ADBE Vector Shape - Ellipse",//04
		"ADBE Vector Shape - Star",//05
		"ADBE Vector Shape - Group",//06
		"ADBE Vector Graphic - Fill",//07
		"ADBE Vector Graphic - Stroke",//08
		"ADBE Vector Graphic - G-Fill",//09
		"ADBE Vector Graphic - G-Stroke",//10
		"ADBE Vector Filter - Merge",//11
		"ADBE Vector Filter - Offset",//12
		"ADBE Vector Filter - PB",//13
		"ADBE Vector Filter - Repeater",//14
		"ADBE Vector Filter - RC",//15
		"ADBE Vector Filter - Trim",//16
		"ADBE Vector Filter - Twist",//17
		"ADBE Vector Filter - Roughen",//18
		"ADBE Vector Filter - Wiggler",//19
		"ADBE Vector Filter - Zigzag",//20
		"Ctrl effect All",//21
		"Triangle"//22
	];
// #endregion
	var iconPaths = [
		"Add00Layoutset.png",//00
		"Add00LayoutRow.png",//00
		"Add01ShapeLayer.png",//01
		"AddGroup.png",//02
		"AddRect.png",//03
		"AddEn.png",//04
		"Addstar.png",//05
		"AddShape.png",//06
		"AddFill.png",//07
		"AddStroke.png",//08
		"AddGFill.png",//09
		"AddGStroke.png",//10
		"AddMerge.png",//11
		"AddOffset.png",//12
		"AddPANK.png",//13
		"AddRep.png",//14
		"Addkadomaru.png",//15
		"AddTrim.png",//16
		"AddTwist.png",//17
		"AddRoughen.png",//18
		"AddWjggle.png",//19
		"AddZigzag.png",//20
		"Add_fx_all.png",//21
		"AddTriangle.png",//22
		"AddThreePath.png"//22
		];
		

	// ********************************************************************************
	var prefSave = function()
	{
		var pref = {};
		pref.layoutMode = layoutMode;
		pref.layoutRow = layoutRow;
		var js = pref.toSource();
		var f = new File(prefPath);
		
		try{
			if (f.open("w")){
				f.write(js);
			}
		}finally{
			f.close();
		}
    }
    // ********************************************************************************
    var prefLoad = function ()
    {
        var ret = false;
        var js = "";
        var f = new File(prefPath);
        if (f.exists == true) {
            try {
                if (f.open("r")) {
                    js = f.read();
                }
            } finally {
                f.close();
            }
            var pref = eval(js);
            if ("layoutMode" in pref) {
                var a = pref.layoutMode;
                if (layoutMode != a) {
                    layoutMode = a;
                    ret = true;
                }
            }
            if ("layoutRow" in pref) {
                var a = pref.layoutRow;
                if (layoutRow != a) {
                    layoutRow = a;
                    ret = true;
                }
			}
        }
        return ret;
    }
	// ********************************************************************************
	var addExpCtrolAll = function()
	{
		function addSub(lyr,mn,na)
		{
			var efg = lyr.property("ADBE Effect Parade");
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
		
		var lyr = BRY.getActiveLayer();
		if (lyr==null) return ret;
		if ( lyr.matchName !="ADBE Vector Layer") return ret;

		app.beginUndoGroup("とりあえず追加");
		var fx = addSub(lyr,"ADBE Slider Control","open");
		if (fx!=null) fx.property(1).setValue(100);
		var fx = addSub(lyr,"ADBE Slider Control","close");
		if (fx!=null) fx.property(1).setValue(100);
		var fx = addSub(lyr,"ADBE Slider Control","width");
		if (fx!=null) fx.property(1).setValue(1600);
		var fx = addSub(lyr,"ADBE Slider Control","height");
		if (fx!=null) fx.property(1).setValue(900);
		app.endUndoGroup();

		lyr.selected = true;
		return lyr;

	}
	var makeTemplate = function()
	{
		var lyr = addExpCtrolAll();
		if (lyr==null) return;
		function addSub(pb,mn,na)
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
		if ( lyr.matchName !="ADBE Vector Layer") return;
		app.beginUndoGroup("makeTemplate");
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
		app.project.endUndoGroup();
		lyr.selected = true;
		lyr.active = true;
	}
		// ********************************************************************************
	var createShapeLayer = function()
	{
		var ret = false;
		
		var ac = BRY.getActiveComp();
		if (ac==null) return ret;

		var  lyr = null;
		
		if (ac.selectedLayers.length>0)
		{
			lyr = ac.selectedLayers[0];
		}

		
		app.beginUndoGroup("createShapeLayer");
		var sl = ac.layers.addShape();
		if (sl === null ){
			app.endUndoGroup();
			alert("errer!");
			return ret;
		}
		if (lyr !== null)
		{
			sl.moveBefore(lyr);
		}
		app.endUndoGroup();
	}
	// ********************************************************************************
	var addShapes = function(mn)
	{
		var ret = null;
		var stat = BRY.getShapeLayerStatus();
		if(stat.content==null) {
			alert("select error");
			return null;
		}
		var tt =  stat.propertyGroup;
		var idx = 0;
		if(tt!=null) {
			idx = stat.propertyGroup.propertyIndex+1;
		}
		try{
			var pg = stat.content;
			if(pg.matchName =="ADBE Vector Group"){
				pg = pg.property(2);
			}	 
			if (pg.canAddProperty(mn) == true)
			{
				app.beginUndoGroup("add " + mn);
				var pp  = pg.addProperty(mn);
				var ppIdx = pp.propertyIndex;
				if((idx>0)&&(idx<ppIdx)){
					pp.moveTo(idx);
					pp = pg.property(idx);
				}
				pp.selected = true; 
				ret = pp;
				app.endUndoGroup();
			}else{
				alert("er a" + stat.content.name);
			}
		}catch(e){
			alert(e.toString());
		}
		return ret;
	}
	// ********************************************************************************
	var addTriangle = function()
	{
		var pp =  addShapes("ADBE Vector Shape - Star");
		if(pp==null) return;
		app.beginUndoGroup("add T");
		pp(2).setValue(2);
		pp(3).setValue(3);
		app.endUndoGroup();
	}
	var addThreePath = function()
	{
		var pp =  addShapes("ADBE Vector Shape - Group");
		if(pp==null) return;
		app.beginUndoGroup("add ThreePath");
		var myShape = new Shape();
		myShape.vertices = [[0,-100], [-100,-100], [-100,0]]; 
		myShape.closed = false;
		pp(2).setValue(myShape);


		app.endUndoGroup();
	}
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
		var stat = BRY.getShapeLayerStatus();
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
	// ********************************************************************************
	var imageFiles = [];
	var openImage = function()
	{

		for ( var i =0; i<iconPaths.length; i++)
		{
			var p = targetFolder.fullName +"/" +iconPaths[i];
			var f = new File(p);
			if (f.exists==false) {
				alert(p + "\r\nがありません！");
				return;
			}
			imageFiles.push(f);
		}
	}
	openImage();
	var w = 25 * 3 + 10;
	var h = imageFiles.length * 25 + 10;
	// ********************************************************************************
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "ShapeExpression", [ 0,  0,  w,  h]  ,{resizeable:false, maximizeButton:false, minimizeButton:false});
	// ********************************************************************************
	var ctrl_xx = 15;
	var ctrl_yy = 15;

	// ********************************************************************************
	var imageCtrls = [];
	if (imageFiles.length>0){
		var x = 5;
		var y = 5;
		var idx= 0;

		var h = Math.round(imageFiles.length/2);
		for (var i=0; i<imageFiles.length; i++)
		{
			if (i==h)
			{
				x = 5+25;
				y = 5+25;

			}
			imageCtrls.push(winObj.add("iconbutton", [  x,   y,   x +  25,   y +  25] , imageFiles[i]));
			imageCtrls[i].mname = matchNames[i];
			y += 25;
		}
		idx =0;
		imageCtrls[idx].onClick= function()
		{
			layoutMode = (layoutMode +1) % 2;
			layoutSet();
			prefSave();
		}
		idx++;
		imageCtrls[idx].onClick= function()
		{
			if (layoutRow >=2){
				layoutRow = 1;
			}else{
				layoutRow = 2;
			}
			layoutSet();
		}
		idx++;
		imageCtrls[idx].onClick= createShapeLayer;
		idx++;
		
		var st = idx;
		var lt = idx + 19;
		for (var i=st; i<lt; i++)
		{
			imageCtrls[i].onClick = function(){
				addShapes(this.mname);
			};
			idx++;
		};
		imageCtrls[idx].onClick= function(){
			makeTemplate();
			addExpCtrolAll();
		}
		idx++;
		imageCtrls[idx].onClick= function(){
			addTriangle();
		}
		idx++;
		imageCtrls[idx].onClick= function(){
			//addThreePath();
			addLineG();
		}
	}
	
	// ********************************************************************************
	var layoutSet = function()
	{
		//windowサイズ
		var sz = 25;
		var w = 0
		var h = 0;
		var row = 1;
		if (layoutRow<=1){
			row = 1;
		}else{
			row= 2;
		}

		switch(layoutMode){
			case 0:
				w = sz*row + 10;
				h = Math.round(imageFiles.length * sz/row) + 10;
				break;
			case 1:
				h = sz*row + 10;
				w = Math.round(imageFiles.length * sz/row) + 10;
				break;
		}
		var b = winObj.bounds;
		b[2] = b[0]+w;
		b[3] = b[1]+h;

		var x = 5;
		var y = 5;
		var h = Math.floor(imageFiles.length/row);
		h += (imageFiles.length % 2);
		for (var i=0; i<imageFiles.length; i++)
		{
			var b = imageCtrls[i].bounds;
			
			if (i==h)
			{
				if (layoutMode==0){
					x = 5+25;
					y = 5;
				}else{
					x = 5;
					y = 5+25;
	
				}

			}


			b[0] = x;
			b[1] = y;
			b[2] = b[0] + sz;
			b[3] = b[1] + sz;
			switch(layoutMode){
				case 0:
					y+=sz;
					break;
				case 1:
					x+=sz;
					break;
			}		}
	}
    layoutMode = 0;
    if (prefLoad()) {
    }
    layoutSet();
	// ********************************************************************************
    winObj.onClose = function () {
        prefSave();
    }

	// ********************************************************************************
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);