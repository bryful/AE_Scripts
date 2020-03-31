
(function(me){
	//UIの配列
	var cntrlTbl = [];
	//ターゲット
	var targetPath = [];
	var basePath = [];

	#includepath "./;../"
	#include "json2.jsxinc"
	#include "bryScriptLib.jsxinc"


	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var aeclipPath = File.decode($.fileName.getParent()+"/aeclip.exe");
	var jsxinc = File.decode($.fileName.getParent()+"/json2.jsxinc");
	//-------------------------------------------------------------------------
	// ********************************************************************************
	/*
	var toClipbord = function(str)
	{
		var ob = Folder.temp.fullName;
		var pa =  ob + "/tmp.txt";
		var ff = new File(pa);
		ff.encoding = "utf-8";
		if (ff.open("w")){
			try{
				ff.write(str);
			}finally{
				ff.close();
			}
		}
		var fclip = new File(aeclipPath);
		var cmd =  "\"" + fclip.fsName +"\"" + " /c \"" + ff.fsName + "\"";
		if (ff.exists==true){
			try{
				var er = system.callSystem(cmd);
			}catch(e){
				alert("ca" + e.toString());
			}
		}

	}
	*/
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
	/*
		スライダーエフェクト[open]を追加
	*/
	// ********************************************************************************
	var addSilderOpen = function()
	{
		var ret = false;
		
		var ac = BRY.getActiveComp();
		if (ac==null) return ret;

		var  lyr = null;
		
		if (ac.selectedLayers.length>0)
		{
			lyr = ac.selectedLayers[0];
		}

		
		app.beginUndoGroup("addSilderOpen");
		var efg = lyr.property("ADBE Effect Parade");
		var fx = null;
		if (efg.canAddProperty("ADBE Slider Control")){
			fx = efg.addProperty("ADBE Slider Control");
			if (fx!=null) {
				fx.name = "open";
				fx.enabled =false;
				fx.property(1).setValue(100);
			}
		}
		app.endUndoGroup();

	}
	// ********************************************************************************
	/*
		スライダーエフェクト[open]を追加
	*/
	// ********************************************************************************
	var addColor = function()
	{
		var ret = false;
		
		var ac = BRY.getActiveComp();
		if (ac==null) return ret;

		var  lyr = null;
		
		if (ac.selectedLayers.length>0)
		{
			lyr = ac.selectedLayers[0];
		}

		
		app.beginUndoGroup("addSilderOpen");
		var efg = lyr.property("ADBE Effect Parade");
		var fx = null;
		if (efg.canAddProperty("ADBE Color Control")){
			fx = efg.addProperty("ADBE Color Control");
			if (fx!=null) {
				fx.name = "color";
				fx.enabled =false;
				fx.property(1).setValue([234/255,7/255,87/255,1]);
			}
		}
		app.endUndoGroup();

	}
		// ********************************************************************************
	/*
		スライダーエフェクト[open]を追加
	*/
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
		var ret = false;
		
		var ac = BRY.getActiveComp();
		if (ac==null) return ret;

		var  lyr = null;
		
		if (ac.selectedLayers.length>0)
		{
			lyr = ac.selectedLayers[0];
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
		}


	}
	// ********************************************************************************
	/*
		
	*/
	// ********************************************************************************
	var addBaseShape = function()
	{
		
		var ac = BRY.getActiveComp();
		if (ac==null) return ret;
		//var pg = getPropertyGroup(ac);
		//if (pg==null) return ret;
		//alert("pg:" + pg.name);
		
		var ps = ac.selectedProperties;
		if(ps.length>0)
		{
			var p = ps[0];
			var aa = [];
			do{
				aa.push(  p.name + ": " + p.matchName);
				p = p.parentProperty;
			}while(p!=null);
			aa.reverse();
			var s = aa.join("\r\n");
			alert(s);
		}else{
			laert("no");
		}
	}
		// ********************************************************************************
	/*
	*/
	// ********************************************************************************
	var expressionOn = function()
	{
	
		var p = BRY.getProperty();
		if (p==null) return;
		
		if (p.canSetExpression==true){
			if (p.expression =="")
			{
				p.expression = "value";
			}
		}
	}
	
	// ********************************************************************************
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "ShapeExpression", [ 0,  0,  500,  480]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	// ********************************************************************************
	var ctrl_xx = 15;
	var ctrl_yy = 15;
	var btnCreateShape = winObj.add("button",    [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+ 25], "新規シェイプレイヤー" );
	ctrl_yy += 35;
	var btnAddALL = winObj.add("button",    [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+ 25], "とりあえずExpCtrl全部追加" );
	ctrl_yy += 35;
	var btnBaseShape = winObj.add("button",    [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+ 25], "とりあえず追加" );
	ctrl_yy += 35;
	var btnAddSliderOpen = winObj.add("button",    [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+ 25], "Slider \"open\"を追加" );
	ctrl_yy += 35;
	var btnAddColor = winObj.add("button",    [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+ 25], "\"color\"を追加" );
	ctrl_yy += 35;
	var btnExpressin = winObj.add("button",    [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+ 25], "\"value\"を追加" );
	ctrl_yy += 35;

	// ********************************************************************************


	// ********************************************************************************
	cntrlTbl.push(btnCreateShape);
	cntrlTbl.push(btnAddALL);
	cntrlTbl.push(btnBaseShape);
	cntrlTbl.push(btnAddSliderOpen);
	cntrlTbl.push(btnAddColor);
	cntrlTbl.push(btnExpressin);

	// ********************************************************************************
	btnCreateShape.onClick = createShapeLayer;
	btnAddALL.onClick = addExpCtrolAll;
	btnBaseShape.onClick = addBaseShape;
	btnAddSliderOpen.onClick = addSilderOpen;
	btnAddColor.onClick = addColor;
	btnExpressin.onClick = expressionOn;
	
	// ********************************************************************************
	var resizeWin = function()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		var cnt = cntrlTbl.length;
		for ( var i=0; i<cnt; i++)
		{
			var c = cntrlTbl[i];
			var bs = c.bounds;
			bs[0] = ctrl_xx;
			bs[2] = bs[0] + w - ctrl_xx*2;
			c.bounds = bs;
		}
	}
	resizeWin();
	winObj.onResize = resizeWin;

	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);