#includepath "./;../"
#include "bryScriptLib.jsxinc"
#include "bryShapeLib.jsxinc"
(function(me){

	
	var imageWidth = 32;
	var imageHeight = 32;
	
	var imageFiles = []; //アイコンファイルのパス配列
	var imageFuncs = [];//プリセット/jsxファイルのパス配列

	var imageCtrls = []; // imageの配列
	

	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var targetFolder = new Folder ( $.fileName.getParent() + "/(" +$.fileName.getName().changeExt("")+ ")");
    // ********************************************************************************
	/*
		画像アイコンボタンのonClickに登録して使う
		this.funcFileに割り当てたffxFileを適応させる
	*/
	// ********************************************************************************
	var applyFunc = function()
	{
        var ac = BRY.getActiveComp();
        if (ac == null) return;
        var lyr = BRY.getActiveLayer(ac);
        if (lyr == null) return;
        var pg = BRY.getPropertyGroup(lyr);
        if (pg == null) return;
        FsShapeLib.applyJson(this.funcFile, pg);
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
			var ff = new File( pngFiles[i].fullName.changeExt(".json"));
			if (ff.exists == true) {
				imageFiles.push(pngFiles[i]);
				imageFuncs.push(ff);
			}	
		}
		ret = (imageFiles.length > 0);
		if ( ret==false )
		{
			alert("jsonファイルがないです");
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
	var btnExport = winObj.add("button", [  5,   5,   5 +  40,   5 + 20 ] , "Export");
	btnExport.onClick = FsShapeLib.export;
	
	var yP = 40;
	// ********************************************************************************
	/*
		画像アイコンボタンの作成
	*/
	// ********************************************************************************
	var createImageCtrls = function()
	{
		initImageCtrls();
		if (imageFiles.length<=0) return;
		var x = 5;
		var y = yP;
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
		画像アイコンボタンを再配置
	*/
	// ********************************************************************************
	var resizeWin = function()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		
		var bb = btnExport.bounds;
		bb[0] = 5;
		bb[1] = 5;
		bb[2] = bb[0] + 40;
		bb[3] = bb[1] + 20;
		btnExport.bounds = bb;



		if (imageCtrls.length>0) {
			var xmax = w - imageWidth/2;
			
			var xm = 5;
			var ym = yP;
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