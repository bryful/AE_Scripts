(function(me){

	var imageWidth = 32;
	var imageHeight = 32;
	
	var imageFiles = []; //アイコンファイルのパス配列
	var imageFuncs = [];//プリセット/jsxファイルのパス配列

	var imageCtrls = []; // imageの配列
	var btnCtrls = [];
	
	#include "bryScriptLib.jsxinc"

	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var targetFolder = new Folder ( $.fileName.getParent() + "/(" +$.fileName.getName().changeExt("")+ ")");
	// ********************************************************************************
	/*
		アクティブなコンポジションを獲得
	*/
	// ********************************************************************************
	var getActiveComp = function()
	{
		var ret = null;
		ret = app.project.activeItem;
		
		if ( (ret instanceof CompItem)===false)
		{
			ret = null;
			alert("コンポをアクティブにしてください！");
		}
		return ret;
	}
	// ********************************************************************************
	/*
		アクティブなレイヤを獲得。1個のみ
	*/
	// ********************************************************************************
	var getActiveLayer = function(cmp)
	{
		var ret = null;
		if ( (cmp instanceof CompItem)==false) return ret;
		var sl = cmp.selectedLayers;
		if (sl.length<=0) {
			alert("	レイヤが選択されていません");
			return ret;
		}
		ret = sl[0];
		return ret;
	}
	// ********************************************************************************
	/*
		選択されたプロパティを獲得。1個のみ
	*/
	// ********************************************************************************
	var getActivePropertyGroup = function(cmp)
	{
		var ret = null;
		if ( (cmp instanceof CompItem)==false) return ret;
		var sp = cmp.selectedProperties;
		if (sp.length<=0) {
			alert("	プロパティが選択されていません");
			return ret;
		}
		ret = sp[0];
		return ret;
	}
	// ********************************************************************************
	/*
		強制的にプロパティグループを１個選択
	*/
	// ********************************************************************************
	var getPropertyGroup = function()
	{
		var ret = null;
		var ac = getActiveComp();
		if (ac==null) {
			alert("not actived CompItem!");
			return ret;
		}
		
		var sel = ac.selectedProperties;
		var selP = null;
		var selPG = null;
		
		if (sel.length>0)
		{
			for ( var i=0; i < sel.length; i++)
			{
				if ( (selP != null) && (selPG != null) ) break;
				if ( selP == null) {
					if (sel[i] instanceof Property) {
						selP = sel[i];
					}
				if ( selPG == null) {
					if ( (sel[i] instanceof Property)==false) {
						selPG = sel[i];
					}
				}
				}
			}
			if (selPG != null) {
				ret = selPG;
			}else if (selP != null){
				ret = selP.parentProperty;
			}
		}
		if (ret=== null)
		{
			alert("not selected PropertyGroup!");
		}else{
			while ( (ret.matchName !== "ADBE Vector Group") && (ret.matchName !== "ADBE Root Vectors Group") )
			{
				ret = ret.parentProperty;
			}
		}
		return ret;
	}	// ********************************************************************************
	/*
		画像アイコンボタンのonClickに登録して使う
		this.funcFileに割り当てたffxFileを適応させる
	*/
	// ********************************************************************************
	var applyFunc = function()
	{
		var ac = getActiveComp();
		var ap = getActivePropertyGroup(ac);
		var lyr = getActiveLayer(ac);
		if ( (lyr instanceof ShapeLayer) == false) {
			alert("シェイプレイヤを選んでください");
			return;
		}
		if ( ap == null) {
			alert("何か選んでください");
			return;
		}
		var f = this.funcFile;
		if ( (ap.matchName =="ADBE Root Vectors Group")||(ap.matchName =="ADBE Vector Group")){
			lyr.applyPreset(f);
			
		}else{
			alert("	シェイプグループが選択されていません");
		}
	}		
	// ********************************************************************************
	/*
		フォルダをスキャンしてpng/ffxのFileを獲得する
	*/
	// ********************************************************************************
	var folderScan = function(f)
	{
		var ret = false;
		if (f.exists == false) {
			alert(f.name + " : フォルダがないです");
			return ret;
		}
		imageFiles = []; //アイコンファイルのパス配列
		imageFuncs = [];

		var pngFiles = f.getFiles("*.png");
			
		for ( var i=0; i<pngFiles.length; i++)
		{
			var ffx = new File( pngFiles[i].fullName.changeExt(".ffx"));
			if (ffx.exists == true) {
				imageFiles.push(pngFiles[i]);
				imageFuncs.push(ffx);
			}	
		}
		ret = (imageFiles.length > 0);
		if ( ret==false )
		{
			alert("ffxファイルがないです");
		}
		return ret;
	}
	folderScan(targetFolder);
	
	// ********************************************************************************
	/*
		Imageアイコンコントロールの配列を初期化する
	*/
	// ********************************************************************************
	var initImageCtrls = function()
	{
		if (imageCtrls.length ==0) return;
		
		for ( var i= imageCtrls.length-1; i>=0; i--)
		{
			imageCtrls[i].visible = false;
			delete imageCtrls[i];
			imageCtrls[i] = null;
		}
		imageCtrls = [];
	}
	// ********************************************************************************
	/*
		ウィンドウの作成
	*/
	// ********************************************************************************
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "ShapeAssist", [ 0,  0, 345,  360]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});

	var btn_xx = 15;
	var btn_yy = 15;
	
	btnCtrls.push(winObj.add("button", [ btn_xx, btn_yy, btn_xx + 320, btn_yy + 25], "create shapeLayer" ));
	btn_yy += 30;
	btnCtrls.push(winObj.add("button", [ btn_xx, btn_yy, btn_xx + 320, btn_yy + 25], "add Effect Slider \"open\""));
	btn_yy += 30;

	// ********************************************************************************
	/*
		画像アイコンボタンの作成
	*/
	// ********************************************************************************
	var createImageCtrls = function()
	{
		initImageCtrls();
		if (imageFiles.length<=0) return;
		var x = btn_xx;
		var y = btn_yy;
		for ( var i=0; i<imageFiles.length; i++)
		{
			imageCtrls.push(winObj.add("iconbutton", [  x,   y,   x +  imageWidth,   y +  imageHeight] , imageFiles[i]));
			imageCtrls[i].funcFile = imageFuncs[i];
			imageCtrls[i].onClick = applyFunc;
			imageCtrls[i].visible = true;
			x += imageWidth;
		}
	}
	createImageCtrls();
	// ********************************************************************************
	/*
		新規シェイプレイヤ
	*/
	// ********************************************************************************
	var createShapeLayer = function()
	{
		var ret = false;
		
		var ac = getActiveComp();
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
	btnCtrls[0].onClick = createShapeLayer;
	// ********************************************************************************
	/*
		スライダーエフェクト[open]を追加
	*/
	// ********************************************************************************
	var addSilderOpen = function()
	{
		var ret = false;
		
		var ac = getActiveComp();
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

	}
	btnCtrls[1].onClick = addSilderOpen;	
	// ********************************************************************************
	/*
		画像アイコンボタンを再配置
	*/
	// ********************************************************************************
	var resizeWin = function()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		
		for ( var i=0; i<btnCtrls.length; i++)
		{
			var bnd = btnCtrls[i].bounds;
			bnd[0] = btn_xx;
			bnd[2] = btn_xx + (w - btn_xx*2);
			btnCtrls[i].bounds = bnd;
		}
		
		if (imageCtrls.length>0) {
			var xmax = w - imageWidth/2;
			
			var xm = btn_xx;
			var ym = btn_yy;
			var xpos = xm;
			var ypos = ym;
			for ( var i = 0; i<imageCtrls.length; i++){
				ib = imageCtrls[i].bounds;
				ib[0] = xpos;
				ib[1] = ypos;
				ib[2] = xpos + imageWidth;
				ib[3] = ypos + imageHeight;
				imageCtrls[i].bounds = ib;
				xpos += imageWidth;
				if (xpos>=xmax){
					xpos = xm;
					ypos += imageHeight;
				}
			}
		}
	}
	resizeWin();
	winObj.onResize = resizeWin;
	// ********************************************************************************
	/*
		実行
	*/
	// ********************************************************************************
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);