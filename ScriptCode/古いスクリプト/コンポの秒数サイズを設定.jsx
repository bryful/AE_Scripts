/*
	選択したコンポジションの長さを設定する。
	
*/
(function (me)
{
	function getFileNameWithoutExt(s)
	{
		var ret = s;
		var idx = ret.lastIndexOf(".");
		if ( idx>=0){
			ret = ret.substring(0,idx);
		}
		return ret;
	}
	function getScriptName()
	{
		var ary = $.fileName.split("/");
		return File.decode( getFileNameWithoutExt(ary[ary.length-1]));
	}
	function getScriptPath()
	{
		var s = $.fileName;
		return s.substring(0,s.lastIndexOf("/"));
	}

	var scriptName = getScriptName();
	var targetList = new Array;
	var itemList = new Array;
	var newDuration = 0;
	var newWidth = 0;
	var newHeight = 0;
	////////////////////////////////////////////////////////////////////////
	function selectedIndex()
	{
		var ret = -1;
		if ( listFtg.items.length<=0) {
			return ret;
		}
		for ( var i=0; i<listFtg.items.length; i++){
			if (listFtg.items[i].selected == true){
				ret = i;
				break;
			}
		}
		return ret;
	}
	////////////////////////////////////////////////////////////////////////
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 132,  174,  132+ 283,  174+ 367]);
	
	var btnSetDuration = winObj.add("button", [  20,   12,   20+ 230,   12+  23], "秒数を獲得", {name:'cancel'});
	var btnSetSize = winObj.add("button", [  20,   41,   20+ 230,   41+  23], "サイズを獲得", {name:'cancel'});
	var btnSetAll = winObj.add("button", [  20,   70,   20+ 231,   70+  23], "秒数サイズの両方を獲得", {name:'cancel'});
	var pnl = winObj.add("panel", [   3,   99,    3+ 268,   99+ 200], "動作");
	var cbSec = pnl.add("checkbox", [  13,   18,   13+ 100,   18+  16], "秒数を設定する");
	var rbFrame = pnl.add("radiobutton", [  37,   38,   37+  89,   38+  16], "Frameで指定");
	var edFrame = pnl.add("edittext", [ 132,   35,  132+ 125,   35+  19], "", {readonly:false, multiline:false});
	var rbSecKoma = pnl.add("radiobutton", [  37,   66,   37+  92,   66+  16], "秒+コマで指定");
	var edSec = pnl.add("edittext", [ 132,   63,  132+  52,   63+  19], "", {readonly:false, multiline:false});
	var stPluss = pnl.add("statictext", [ 190,   67,  190+  17,   67+  12], "＋");
	var edKoma = pnl.add("edittext", [ 205,   65,  205+  52,   65+  19], "", {readonly:false, multiline:false});
	var stFrameRate = pnl.add("statictext", [  37,  100,   37+  61,  100+  12], "FrameRate");
	var edFrameRate = pnl.add("edittext", [ 104,   97,  104+  69,   97+  19], "", {readonly:true, multiline:false});
	var cbSize = pnl.add("checkbox", [   13,  131,    8+ 105,  131+  16], "サイズを設定する");
	var stWidth = pnl.add("statictext", [  22,  156,   22+  33,  156+  12], "Width");
	var edWidth = pnl.add("edittext", [  57,  153,   57+  69,  153+  19], "", {readonly:false, multiline:false});
	var stHeight = pnl.add("statictext", [ 134,  156,  134+  38,  156+  12], "Height");
	var edHeight = pnl.add("edittext", [ 178,  153,  178+  69,  153+  19], "", {readonly:false, multiline:false});
	var srWarning = winObj.add("statictext", [   6,  307,    6+ 270,  307+  12], "レイヤのin点/out点には何もしません。確認が必要です。");
	var btnOK = winObj.add("button", [ 192,  331,  192+  75,  331+  23], "OK", {name:'ok'});

	////////////////////////////////////////////////////////////////////////
	//UIの初期化
	edFrameRate.text = "24";
	cbSec.value = false;
	cbSize.value = false;
	rbSecKoma.value = false;
	rbFrame.value = true;
	
	function enabledChk()
	{
		rbSecKoma.enabled = 
		rbFrame.enabled = 
		edFrame.enabled = 
		edSec.enabled =
		edKoma.enabled = cbSec.value;
		if (cbSec.value == true){
			edSec.enabled =
			edKoma.enabled = rbSecKoma.value;
			edFrame.enabled = ! rbSecKoma.value;
		}
		
		stWidth.enabled = 
		edWidth.enabled = 
		stHeight.enabled = 
		edHeight.enabled = cbSize.value;
		
		
		btnOK.enabled = ( cbSec.value || cbSize.value);
	}
	enabledChk();
	//---------------
	rbFrame.onClick = function(){
		rbSecKoma.value = ! rbFrame.value;
		enabledChk();
	}
	//---------------
	rbSecKoma.onClick = function(){
		rbFrame.value = ! rbSecKoma.value;
		enabledChk();
	}
	cbSec.onClick = enabledChk;
	cbSize.onClick = enabledChk;
	////////////////////////////////////////////////////////////////////////
	function getStatusSub()
	{
		var o = new Object;
		o.duration = -1;
		o.width = -1;
		o.height = -1;
		o.frameRate = 24;
		var a = app.project.activeItem;
		if ( (a == null)||( a instanceof FolderItem)) {
			alert("コンポかフッテージを選択してください。");
		}else{
			o.width = a.width;
			o.height = a.height;
			
			if ( (a instanceof FootageItem)&&( (a.mainSource.isStill == true)||(a.file == null))) {
			}else{
				o.duration = a.duration;
				o.frameRate = a.frameRate;
			}
		}
		return o;
	}
	function getStatus(d,s)
	{
		var o = getStatusSub();
		if ( o.duration <0) return;
		if ( s == true){
			edWidth.text = o.width +"";
			edHeight.text = o.height +"";
		}
		if (( d == true)&&( o.duration >0)){
			edFrameRate.text = o.frameRate + "";
			var frm = Math.round(o.duration * o.frameRate);
			edFrame.text = frm +"";
			edSec.text = Math.floor(frm / o.frameRate) + "";
			edKoma.text = Math.floor(frm % o.frameRate) + "";
		}
	}
	btnSetDuration.onClick = function()
	{
		getStatus(true,false);
	}
	btnSetSize.onClick = function()
	{
		getStatus(false,true);
	}
	btnSetAll.onClick = function()
	{
		getStatus(true,true);
	}
	////////////////////////////////////////////////////////////////////////
	function getTargetList()
	{
		targetList = new Array;
		var sel = app.project.selection;
		if ( sel.length>0) {
			for (var i=0; i<sel.length; i++){
				if ( sel[i] instanceof CompItem){
					targetList.push(sel[i]);
				}
			}
		}
	}
	////////////////////////////////////////////////////////////////////////
	function setParams()
	{
		if ( (newDuration<=0)&&((newWidth<=4)||(newHeight<=4)) ) return;
		app.beginUndoGroup(scriptName);
		for (var i=0; i<targetList.length; i++){
			if ( newDuration > 0){
				if (targetList[i].duration != newDuration)
					targetList[i].duration = newDuration;
			}
			if ((newWidth>4)||(newHeight>4)) {
				if ( targetList[i].width != newWidth)
					targetList[i].width = newWidth;
				if ( targetList[i].height != newHeight)
					targetList[i].height = newHeight;
			}
		}
		app.endUndoGroup();
	}
	////////////////////////////////////////////////////////////////////////
	btnOK.onClick = function(){
		getTargetList();
		if (targetList.length<=0) {
			alert("コンポを選択してください。");
			return;
		}
		newDuration =-1;
		newWidth =-1;
		newHeight =-1;
		
		var fr =24;
		if ( cbSec.value == true){
			if ( isNaN(edFrameRate.text)==false) {
				fr = edFrameRate.text * 1;
			}
			if (rbFrame.value == true){
				if ( isNaN(edFrame.text)==false) {
					newDuration = edFrame.text / fr;
				}else{
					alert("Frameの値が異常です。");
					return;
				}
			}else{
				if ( isNaN(edSec.text)==false) {
					newDuration = edSec.text *1;
				}else{
					alert("Secの値が異常です。");
					return;
				}
				if ( isNaN(edKoma.text)==false) {
					newDuration += edKoma.text / fr;
				}else{
					alert("Komaの値が異常です。");
					return;
				}
			}
		
		}
		if ( cbSize.value == true){
			if ( isNaN(edWidth.text)==false) {
				newWidth = edWidth.text *1;
			}else{
				alert("Widthの値が異常です。");
				return;
			}
			if ( isNaN(edHeight.text)==false) {
				newHeight = edHeight.text *1;
			}else{
				alert("Heightの値が異常です。");
				return;
			}
			
			if ( (newWidth<=4)||(newHeight<=4)){
				alert("Width/Heightの値が小さすぎます。");
				return;
			}
		}
		setParams();
	}
	////////////////////////////////////////////////////////////////////
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}

})(this);
