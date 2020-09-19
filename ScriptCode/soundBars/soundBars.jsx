/*

*/

(function(me){

	#includepath "./;../"
	#include "json2.jsxinc"
	#include "bryScriptLib.jsxinc"

	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var aeclipPath = File.decode($.fileName.getParent()+"/aeclip.exe");

	var cntrlTbl = [];
	// ********************************************************************************
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 0,  0,  490,  100]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	// ********************************************************************************
	var ctrl_xx = 10;
	var ctrl_yy = 10;
	var stCaption = winObj.add("statictext",     [ctrl_xx, ctrl_yy, ctrl_xx + 470,   ctrl_yy +  25], "jsonファイルを読み込んでスライダーキーを設定します。");
	ctrl_yy += 30;
	var stCaption2 = winObj.add("statictext",     [ctrl_xx, ctrl_yy, ctrl_xx + 470,   ctrl_yy +  25], "適応させたいレイヤを選んだあと実行してください。かなり時間かかります。");
	ctrl_yy += 30;
	var btnExec = winObj.add("button", [ctrl_xx,ctrl_yy,ctrl_xx+ 470,ctrl_yy+25], "実行" );
	ctrl_yy += 30;

	cntrlTbl.push(stCaption);
	cntrlTbl.push(stCaption2);
	cntrlTbl.push(btnExec);

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
	var makeSlider = function(lyr,cnt)
	{
		var ret = [];
		//var p = app.project.item(1).layer("ヌル 1").property("ADBE Effect Parade").property("スライダー制御").property("ADBE Slider Control-0001");
		var eg = lyr.property("ADBE Effect Parade");
		var soundName = "snd";
		for ( var i=0; i<cnt;i++)
		{
			var prop = eg.addProperty("ADBE Slider Control");
			prop.name = soundName + i;
			ret.push(prop);
		}
		return ret;
	}
	//-------------------------------------------------------------------------
	var execSub = function(obj,lyr)
	{
		var levelCount = obj.LevelCount;
		var frameCount = obj.FrameCount;
		var data = obj.data;
		var sliders =  makeSlider(lyr,levelCount);
	}
	//-------------------------------------------------------------------------
	var exec = function()
	{
		var lyr = BRY.getActiveLayer();
		if(lyr==null){
			return;
		}
		var fn = File.openDialog("Select","*.json");
		if (fn) {
			var f = new File(fn);
			f.open("r");
			try{
				var js  = f.read();
				var obj = JSON.parse(js);
				execSub(obj,lyr);
			}catch(e){
				alert(e.toString());
			}finally{
				f.close();
			}
		}


	}
	btnExec.onClick = function(){
		exec();
	};
	
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);