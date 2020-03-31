
	// ********************************************************************************
	
	// ********************************************************************************
	// ********************************************************************************

#includepath "./;../"
#include "bryScriptLib.jsxinc"
(function(me){
	//UIの配列
	//ターゲット
	
	var layoutMode = 0;
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var aeclipPath = File.decode($.fileName.getParent()+"/aeclip.exe");
	var targetFolder = new Folder ( File.decode($.fileName.getParent() + "/(" +$.fileName.getName().changeExt("")+ ")"));
	var prefPath = new Folder ( File.decode($.fileName.getParent() + "/" +$.fileName.getName().changeExt(".pref")));
	var matchNames = [
		"layout",//00
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
		"Ctrl effect All"//21
	];
	var iconPaths = [
		"Add00Layoutset.png",//00
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
		"Add_fx_all.png"//21
		];
		var iconStart = 2;
		var iconEnd = 20;
		

	// ********************************************************************************
	var prefSave = function()
	{
		var pref = {};
		pref.layoutMode = layoutMode;
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
			var tmp = addSub(g0,"ADBE Vector Filter - RC","open");
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
		var ac = BRY.getActiveComp();
		if (ac==null) return;
		var lyr = BRY.getActiveLayer(ac);
		var p = BRY.getPropertyBase(lyr);
		if (p==null) return;

		var pg = p.findContent();
		if(pg.matchName =="ADBE Vector Group"){
			pg = pg.property(2);
		}

		try{
			if (pg.canAddProperty(mn) == true)
			{
				app.beginUndoGroup("add " + mn);
				var pp  = pg.addProperty(mn);
				pp.selected = true;
				app.endUndoGroup();
			}else{
				alert("er" + pg.name);
			}
		}catch(e){
			alert(e.toString());
		}
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
	var w = 25 + 10;
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
		
		for (var i=0; i<imageFiles.length; i++)
		{
			imageCtrls.push(winObj.add("iconbutton", [  x,   y,   x +  25,   y +  25] , imageFiles[i]));
			imageCtrls[i].mname = matchNames[i];
			y += 25;
		}
		for (var i=iconStart; i<=iconEnd; i++)
		{
			imageCtrls[i].onClick = function(){
				addShapes(this.mname);
			}
		};
		imageCtrls[0].onClick= function()
		{
			layoutMode = (layoutMode +1) % 2;
			layoutSet();
			prefSave();
		}
		imageCtrls[1].onClick= createShapeLayer;
		imageCtrls[21].onClick= function(){
			makeTemplate();
			addExpCtrolAll();
		}
	}
	
	// ********************************************************************************
	var layoutSet = function()
	{
		//windowサイズ
		var sz = 25;
		var w = 0
		var h = 0;
		switch(layoutMode){
			case 0:
				w = sz + 10;
				h = imageFiles.length * sz + 10;
				break;
			case 1:
				h = sz + 10;
				w = imageFiles.length * sz + 10;
				break;
		}
		var b = winObj.bounds;
		b[2] = b[0]+w;
		b[3] = b[1]+h;

		var x = 5;
		var y = 5;
		for (var i=0; i<imageFiles.length; i++)
		{
			var b = imageCtrls[i].bounds;

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
        layoutSet();
    }
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