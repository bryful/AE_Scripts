
(function(me){
	//UIの配列
	var cntrlTbl = [];

	#includepath "./;../"
	#include "json2.jsxinc"
	#include "bryScriptLib.jsxinc"
	#include "bryShapeLib.jsxinc"

	var isModifiedMode = false;

	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var aeclipPath = File.decode($.fileName.getParent()+"/aeclip.exe");
	//-------------------------------------------------------------------------

	// ********************************************************************************
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 0,  0,  200,  160]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	// ********************************************************************************
	var ctrl_xx = 15;
	var ctrl_yy = 15;
	var cap		= winObj.add("statictext",    [ctrl_xx,ctrl_yy,ctrl_xx+ 170,ctrl_yy+ 25], "Shapeデータのファイル保存と読み込み" );
	ctrl_yy += 35;
	var btnExport = winObj.add("button",    [ctrl_xx,ctrl_yy,ctrl_xx+ 170,ctrl_yy+ 25], "Shape 書き出し" );
	ctrl_yy += 35;
	var btnImport = winObj.add("button",    [ctrl_xx,ctrl_yy,ctrl_xx+ 170,ctrl_yy+ 25], "Shape 読み込み" );
	ctrl_yy += 35;
	
	// ********************************************************************************


	// ********************************************************************************
	cntrlTbl.push(btnExport);
	cntrlTbl.push(btnImport);
	
	// ********************************************************************************
	btnExport.onClick = FsShapeLib.export;
	btnImport.onClick = FsShapeLib.import;

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