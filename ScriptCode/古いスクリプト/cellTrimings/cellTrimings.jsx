function cellTrimings(me)
{
	/////////////////////////////////////////////////////////////////////
	//各種定数
	/////////////////////////////////////////////////////////////////////
	var scriptName = "cellTrimings";	//undo文字等に使われる
	
	var paintSizeDef	= 960;			// ペイント基本!00%サイズの初期値
	var shooteSizeDef	= 640;			// 撮影基本!00%サイズの初期値

	var fitScale		= shooteSizeDef / paintSizeDef;
										//　縮小スケール。
	var smoothMode		= 1;			// 0:None 1: OLM Smoother 2: PSOFT anti-aliasing
	var isNotResize		= false;		//　縮小しない。
	var isSelectedOnly	= false;		//　選択レイヤのみ
	var isToInt			= true;			// 位置アンカーポイントを整数化
	var isBG			= true;			// BG/BOOKの場合スムージング処理を行わない。

	//コンポジション名に使う定数
	var trimCompFooter1	= "_01";		//トリミングコンポ１個目のフッター
	var trimCompFooter2	= "_02";		//トリミングコンポ２個目のフッター
	var dupFooter		= "+";			// 重複時にnameに付加する文字

	//各関数で使うグローバルな変数
	var targetComp		= null;			// 対象コンポ
	var partsFolder		= null;			// パーツComp収納用
	var mixedComp		= null;			// 合成コンポ
	

	//F's GuideFrame用
	var lineColorIndex = 0;
	var lineColors = new Array; // F's GuideFrameの色テーブル
	lineColors.push([1,0,0]);
	lineColors.push([0,1,0]);
	lineColors.push([0,0,1]);
	lineColors.push([1,1,0]);
	lineColors.push([1,0,1]);
	lineColors.push([0,1,1]);

	var linePosIndex	= 0;
	var adjLayerIndex	= 0;

	//settings用のkeyword
	var paintSizeKey		= "paintSize";
	var shooteSizeKey		= "shooteSize";
	var isNotResizeKey		= "isNotResize";
	var isToIntKey			= "isToInt";
	var isBGKey				= "isBG";
	var smoothModeKey		= "smoothMode";
	var partsFolderFooterKey= "partsFolderFooter";
	var mixedCompFooterKey	= "mixedCompFooter";
	var isSelectedOnlyKey	= "isSelectedOnly";
	
	/////////////////////////////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////
	//アクティブなコンポを得る
	function getTargetComp()
	{
		targetComp = null;
		if ( app.project.activeItem instanceof CompItem) {
			targetComp = app.project.activeItem;
			return true;
		}else{
			return false;
		}
	}
	//----------------------------------------------------------
	//ターゲットのレイヤを得る
	//引数が trueならレイヤを全部
	function getTargetLayers(all)
	{
		var ret = new Array;
		if ( getTargetComp() == false) {
			return ret;
		}
		if ( targetComp.numLayers<=0) {
			return ret;
		}
		if ( all== true)
		{
			for ( var i=1; i<=targetComp.numLayers; i++){
				var p = targetComp.layer(i);
				if ( ( p.source instanceof FootageItem)||( p.source instanceof CompItem) ) {
					ret.push(p);
				}
			}
		}else{
			var sl = targetComp.selectedLayers;
			if ( sl.length>0){
				for ( var i=0; i<sl.length; i++){
					var p = sl[i];
					if ( ( p.source instanceof FootageItem)||( p.source instanceof CompItem) ) {
						ret.push(p);
					}
				}
			}
		}
		return ret;
	}
	//----------------------------------------------------------
	//指定されたFolderItem内にあるnameと同じ名前のFolderItemを探す。
	//無かったら作成する
	function findFolder(fld,name)
	{
		var f = fld;
		if ( (f == null)||(f == undefined)) {
			f = app.project.rootFolder;
		}
		var ret = null;
		if ( f.numItems>0){
			for ( var i=1; i<=f.numItems; i++){
				if ( f.item(i) instanceof FolderItem){
					if ( f.item(i).name == name) {
						ret = f.item(i);
						break;
					}
				}
			}
		}
		if ( ret == null) ret = f.items.addFolder(name);
		return ret;
	}
	/////////////////////////////////////////////////////////////////////
	//UI作成部分
	/////////////////////////////////////////////////////////////////////
	//自作AE_Dialogsからカット＆ペースト
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "切り取り", [ 132,  174,  132+ 178,  174+ 435]);
	
	
	var btnSetGuideFrame = winObj.add("button", [  12,    5,   12+ 156,    5+  30], "set F's GuideFrame", {name:'ok'});
	var pnlResize = winObj.add("panel", [  12,   40,   12+ 156,   40+  91], "リサイズ設定");
	var stShoote = pnlResize.add("statictext", [   5,   19,    5+  41,   19+  12], "縮小率");
	var tbShooteSize = pnlResize.add("edittext", [  46,   16,   46+  40,   16+  19], "640", {readonly:false, multiline:false});
	var stDiv = pnlResize.add("statictext", [  88,   19,   88+  11,   19+  12], "/");
	var tbPaintSize = pnlResize.add("edittext", [ 100,   16,  100+  37,   16+  19], "1024", {readonly:false, multiline:false});
	var cbIsNoResize = pnlResize.add("checkbox", [   8,   41,    8+  89,   41+  16], "リサイズしない");
	var cbIsToInt = pnlResize.add("checkbox", [   8,   61,    8+ 130,   61+  16], "Pos/Anchorを整数化");
	var pnlSmooth = winObj.add("panel", [  12,  137,   12+ 156,  137+  99], "スムージング");
	var rbNone = pnlSmooth.add("radiobutton", [  12,   18,   12+ 128,   18+  16], "処理無し");
	var rbOLM = pnlSmooth.add("radiobutton", [  12,   34,   12+ 128,   34+  16], "OLM Smoother");
	var rbPSOFT = pnlSmooth.add("radiobutton", [  12,   50,   12+ 128,   50+  16], "PSOFT anti-aliasing");
	var cbIsBG = pnlSmooth.add("checkbox", [  12,   72,   12+ 101,   72+  16], "BG/BOOK/BR対策");
	var pnlNames = winObj.add("panel", [  12,  242,   12+ 156,  242+ 101], "作成名称");
	var stPartsFolderFooter = pnlNames.add("statictext", [  15,   15,   15+ 108,   15+  12], "パーツフォルダ・フッター");
	var tbPartsFolderFooter = pnlNames.add("edittext", [  17,   30,   17+ 100,   30+  19], "_01Parts", {readonly:false, multiline:false});
	var stMixedCompFooter = pnlNames.add("statictext", [  15,   54,   15+  97,   54+  12], "合成Comp・フッター");
	var tbMixedCompFooter = pnlNames.add("edittext", [  17,   69,   17+ 100,   69+  19], "_02Mixed", {readonly:false, multiline:false});
	var btnOK = winObj.add("button", [  12,  349,   12+ 153,  349+  32], "実行", {name:'ok'});
	var cbIsSelectedOnly = winObj.add("checkbox", [  19,  387,   19+ 140,  387+  16], "選択レイヤのみ実行する");

	//-------------------
	//コントロールの初期値を設定
	//２度目以降はsettingLoad()で設定されるので、結構無意味
	cbIsSelectedOnly.value = false;
	rbNone.value = true;
	/////////////////////////////////////////////////////////////////////
	//イベント
	/////////////////////////////////////////////////////////////////////
	
	//縮小率のedittextのenabledとシンクロ
	cbIsNoResize.onClick = function()
	{
		isNotResize = 
		tbShooteSize.enabled = 
		tbPaintSize.enabled = (cbIsNoResize.value != true);
	}
	//-------------------------------------------------------------
	cbIsSelectedOnly.onClick = function() {isSelectedOnly = cbIsSelectedOnly.value}
	cbIsToInt.onClick = function() {isToInt = cbIsToInt.value}
	cbIsBG.onClick = function() {isBG = cbIsBG.value}
	rbNone.onClick = function() { smoothMode =0;}
	rbOLM.onClick = function() { smoothMode =1;}
	rbPSOFT.onClick = function() { smoothMode =2;}
	/////////////////////////////////////////////////////////////////////
	//-------------------------------------------------------------
	//パラメータの読み込み・UIへ反映
	function settingLoad()
	{
		if (app.settings.haveSetting(scriptName, paintSizeKey) == true){
			tbPaintSize.text = app.settings.getSetting(scriptName, paintSizeKey);
		}else{
			tbPaintSize.text = paintSizeDef + "";
		}
		if (app.settings.haveSetting(scriptName, shooteSizeKey) == true){
			tbShooteSize.text = app.settings.getSetting(scriptName, shooteSizeKey);
		}else{
			tbShooteSize.text = shooteSizeDef + "";
		}
		if (app.settings.haveSetting(scriptName, isNotResizeKey) == true){
			isNotResize = (app.settings.getSetting(scriptName, isNotResizeKey).toLowerCase() == "true");
		}else{
			isNotResize = false;
		}
		cbIsNoResize.value = isNotResize
		tbShooteSize.enabled = 
		tbPaintSize.enabled = ! isNotResize;

		if (app.settings.haveSetting(scriptName, isToIntKey) == true){
			isToInt = (app.settings.getSetting(scriptName, isToIntKey).toLowerCase() == "true");
		}
		cbIsToInt.value = isToInt;
		if (app.settings.haveSetting(scriptName, isBGKey) == true){
			isBG = (app.settings.getSetting(scriptName, isBGKey).toLowerCase() == "true");
		}
		cbIsBG.value = isToInt;

		if (app.settings.haveSetting(scriptName, smoothModeKey) == true){
			smoothMode = app.settings.getSetting(scriptName, smoothModeKey) * 1;
		}
		switch (smoothMode){
			case 0 : rbNone.value = true; break;
			case 2 : rbPSOFT.value = true; break;
			case 1 : 
			default :
				rbOLM.value = true; break;
		}
		if (app.settings.haveSetting(scriptName, partsFolderFooterKey) == true){
			tbPartsFolderFooter.text = app.settings.getSetting(scriptName, partsFolderFooterKey);
		}
		if (app.settings.haveSetting(scriptName, mixedCompFooterKey) == true){
			tbMixedCompFooter.text = app.settings.getSetting(scriptName, mixedCompFooterKey);
		}
		if (app.settings.haveSetting(scriptName, isSelectedOnlyKey) == true){
			isSelectedOnly = (app.settings.getSetting(scriptName, isSelectedOnlyKey).toLowerCase() == "true");
		}
		cbIsSelectedOnly.value = isSelectedOnly;
	}
	/////////////////////////////////////////////////////////////////////
	//起動時の処理
	/////////////////////////////////////////////////////////////////////
	settingLoad();
	if ( ( me instanceof Panel) == false){
		winObj.center();
		winObj.show();
	}
	/////////////////////////////////////////////////////////////////////
	
	//-------------------------------------------------------------
	//smoothModeを獲得
	function getSmoothMode()
	{
		if ( rbNone.value == true) smoothMode = 0;
		else if ( rbOLM.value == true) smoothMode = 1;
		else if ( rbPSOFT.value == true) smoothMode = 2;
		
	}
	//-------------------------------------------------------------
	//パラメータを保存
	function settingSave()
	{
		app.settings.saveSetting(scriptName, paintSizeKey, tbPaintSize.text);
		app.settings.saveSetting(scriptName, shooteSizeKey, tbShooteSize.text);
		app.settings.saveSetting(scriptName, isNotResizeKey, cbIsNoResize.value.toString());
		app.settings.saveSetting(scriptName, isToIntKey, cbIsToInt.value.toString());
		app.settings.saveSetting(scriptName, isBGKey, cbIsBG.value.toString());
		getSmoothMode();//多分大丈夫だけど念のため再度獲得
		app.settings.saveSetting(scriptName, smoothModeKey, smoothMode.toString());
		app.settings.saveSetting(scriptName, partsFolderFooterKey, tbPartsFolderFooter.text);
		app.settings.saveSetting(scriptName, mixedCompFooterKey, tbMixedCompFooter.text);
		app.settings.saveSetting(scriptName, isSelectedOnlyKey, cbIsSelectedOnly.value.toString());
	}
	//-------------------------------------------------------------
	winObj.onClose = settingSave;
	//-------------------------------------------------------------
	//レイヤにF's GuideFrame.aexを適応
	function setGuideFrame(lyr)
	{
		var eg = lyr.property("ADBE Effect Parade");
		//---------
		if ( eg.property("F's GuideFrame") != null) return true; //二重登録はしない
		if ( eg.canAddProperty("F's GuideFrame") == false){
			alert("F's GuideFrame.aexがインストールされていません！");
			return false;
		}
		var fx = eg.addProperty("F's GuideFrame");
		if (fx == null){
			alert("F's GuideFrame.aexがインストールされていません！");
			return false;
		}
		fx.enabled = true;
		
		fx.property("F's GuideFrame-0001").setValue(lineColors[lineColorIndex]);//color
		lineColorIndex++;
		if (lineColorIndex >= lineColors.length) lineColorIndex = 0;
		
		var pIdx = ( (linePosIndex % 8) + 1) * 0.03;
		var x0 = Math.floor( lyr.width * pIdx);
		var y0 = Math.floor( lyr.height * pIdx);
		var x1 = x0 + Math.floor( lyr.width /2);
		var y1 = y0 + Math.floor( lyr.height /2);
		fx.property("F's GuideFrame-0002").setValue([x0,y0]);//TopLeft
		fx.property("F's GuideFrame-0003").setValue([x1,y1]);//BottomRight
		linePosIndex++;

		fx.property("F's GuideFrame-0004").setValue(1);//Check
		
		return true;
	}
	//-------------------------------------------------------------
	//set F's GuideFrame.aex
	btnSetGuideFrame.onClick = function()
	{
		var sl = getTargetLayers(false);
		if ( sl.length<=0){
			if ( targetComp==null){
				alert("Compがアクティブになっていません！");
			}else{
				alert("Layerが選択されていません！");
			}
			return;
		}
		app.beginUndoGroup("set F's GuideFrame.aex")
		for ( var i=0; i<sl.length; i++){
			if ( setGuideFrame(sl[i]) == false) ;
		}
		app.endUndoGroup();
	}
	//-------------------------------------------------------------
	function getFitScale()
	{
		fitScale = 1;
		if (cbIsNoResize.value == true){
			return true;
		}
		if ( isNaN(tbShooteSize.text)==true) {
			alert("縮小率（左) 撮影基本サイズが無効です。");
			return false;
		}
		if ( isNaN(tbPaintSize.text)==true) {
			alert("縮小率（右) ペイント基本サイズが無効です。");
			return false;
		}
		var sSize = eval(tbShooteSize.text);
		var pSize = eval(tbPaintSize.text);
		var fs = sSize / pSize;
		if ( fs<=0 ){
			alert("縮小率が０以下です。");
			return false;
		}else if (fs >1){
			alert("縮小率が100%より大きいです。");
			return false;
		}else{
			fitScale = fs;
			return true;
		}
	}
	//-------------------------------------------------------------
	function layerChk(lyr)
	{
		var ret = "";
		var idx = lyr.index + "";

		if ( lyr.threeDLayer == true){
			ret += idx + " [" + lyr.name + "]は、3Dレイヤには対応していません。\n";
		}
		if ( lyr.collapseTransformation == true){
			ret += idx + " [" + lyr.name + "]の、コラップストランスフォームがONになっています。\n";
		}
		var oAnc = lyr.property("ADBE Transform Group").property("ADBE Anchor Point");
		if ( oAnc.numKeys>1){
			ret += idx + " [" + lyr.name +"] のアンカーポイントにキーが２以上あります\n";
		}
		var oPos = lyr.property("ADBE Transform Group").property("ADBE Position");
		if ( oPos.numKeys>1){
			ret += idx + " [" + lyr.name +"] の位置にキーが２以上あります\n";
		}
		var oScl = lyr.property("ADBE Transform Group").property("ADBE Scale");
		if ( oScl.numKeys>1){
			ret += idx + " [" + lyr.name +"] のスケールにキーが２以上あります\n";
		}
		var oRot = lyr.property("ADBE Transform Group").property("ADBE Rotate Z");
		if ( oRot.numKeys>1){
			ret += idx + " [" + lyr.name +"] の回転にキーが２以上あります\n";
		}
		if ( oRot.value != 0) {
			ret += idx + " [" + lyr.name +"] の回転が０ではないです。\n";
		}
		if ( lyr.timeRemapEnabled == true){
			var remap = lyr.property("ADBE Time Remapping");
			if ( remap.numKeys>1){
				ret += idx + " [" + lyr.name +"] のタイムリマップにキーが２以上あります\n";
			}
		}
		return ret;
	}
	//-------------------------------------------------------------
	//合成コンポの名前を作成
	function findCompName(fld,name)
	{
		function isComp(fld,name)
		{
			var ret = false;
			if ( fld.numItems<=0) return ret;
			for ( var i=1; i<=fld.numItems; i++){
				if ( fld.item(i) instanceof CompItem){
					if ( fld.item(i).name == name){
						ret = true;
						break;
					}
				}
			}
			return ret;
		}
		var ret = name;
		while ( isComp(fld,ret) ==true) {
			ret += dupFooter;
		}
		return ret;
	}
	//-------------------------------------------------------------
	//対象レイヤのソースの長さを求める
	function getLayerDuration(lyr)
	{
		var ret = new Object;
		ret.duration = targetComp.frameDuration;	//長さ
		ret.startTime = 0;							//スタート

		//タイムリマップが有効なら、静止画扱い。
		if ( lyr.timeRemapEnabled == true){
			ret.startTime = lyr.property("ADBE Time Remapping").value;
			return ret;
		}
		
		var s = lyr.source;
		if ( s instanceof FootageItem){
			if ( (s.mainSource.isStill == true)||( s.file == null) ){
				return ret;
			}
		}
		ret.duration = s.duration;
		return ret;
	}
	//-------------------------------------------------------------
	function addAdjLayer(cmp)
	{
		//調整レイヤを作成
		var adjLayer = cmp.layers.addShape();
		adjLayer.name = "調整レイヤ " + adjLayerIndex; adjLayerIndex++;

		var rct = adjLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Shape - Rect");
		rct.name = "rect";
		//サイズをあわせるエクスプレッション
		rct.property("ADBE Vector Rect Size").expression = "[thisComp.width * thisComp.pixelAspect,thisComp.height];";
		rct.property("ADBE Vector Rect Position").expression = "[0,0];";
		rct.property("ADBE Vector Rect Roundness").expression = "0;";
		adjLayer.property("ADBE Transform Group").property("ADBE Anchor Point").expression = "[0,0];";
		adjLayer.property("ADBE Transform Group").property("ADBE Position").expression = "[thisComp.width/2, thisComp.height/2];";
		var fil = adjLayer.property("ADBE Root Vectors Group").addProperty("ADBE Vector Graphic - Fill");
		fil.name = "fill";
		fil.property("ADBE Vector Fill Color").setValue( [1,1,1] );
		adjLayer.adjustmentLayer = true;
		
		return adjLayer;
	}
	//-------------------------------------------------------------
	function addOLMSmoother(cmp)
	{
		var lyr = addAdjLayer(cmp);
		
		var eg = lyr.property("ADBE Effect Parade");
		//---------
		if (eg.canAddProperty("OLM Smoother") == true) {
			var fx = eg.addProperty("OLM Smoother");
			fx.enabled = true;
			fx.property("OLM Smoother-0001").setValue(1);//Use Color Key
			//fx.property("OLM Smoother-0002").setValue([255/255,255/255,255/255,255/255]);//Color Key
			//fx.property("OLM Smoother-0003").setValue(6);//Do Smooth Range
		}
	}
	//-------------------------------------------------------------
	function addPSOFT(cmp)
	{
		var lyr = addAdjLayer(cmp);
		var eg = lyr.property("ADBE Effect Parade");
		//---------
		if (eg.canAddProperty("PSOFT ANTI-ALIASING") == true) {
			var fx = eg.addProperty("PSOFT ANTI-ALIASING");
			fx.name = "anti-aliasing"
			fx.enabled = true;
			//fx.property("PSOFT ANTI-ALIASING-0001").setValue(10);//color threshold
			//fx.property("PSOFT ANTI-ALIASING-0002").setValue(70);//softness
			//fx.property("PSOFT ANTI-ALIASING-0007").setValue(0);//bias
			fx.property("PSOFT ANTI-ALIASING-0003").setValue(1);//color key enable
			//fx.property("PSOFT ANTI-ALIASING-0004").setValue([255/255,255/255,255/255,255/255]);//key color
			//fx.property("PSOFT ANTI-ALIASING-0005").setValue(0);//key color threshold
			//fx.property("PSOFT ANTI-ALIASING-0006").setValue(0);//invert
		}
	}
	//-------------------------------------------------------------
	function getTrimingPrm(lyr)
	{
		var ret = new Object;

		ret.lyrScale = lyr.property("ADBE Transform Group").property("ADBE Scale").value;
		ret.lyrAnc = lyr.property("ADBE Transform Group").property("ADBE Anchor Point").value;
		ret.lyrPos = lyr.property("ADBE Transform Group").property("ADBE Position").value;

		//オリジナルレイヤの大きさ
		ret.lyrW = lyr.width;
		ret.lyrH = lyr.height;
		
		
		//トリミングサイズを求める
		var x0 = 0;
		var y0 = 0;
		var x1 = lyr.width;
		var y1 = lyr.height;
		
		var fx = lyr.property("ADBE Effect Parade").property("F's GuideFrame");
		if ( fx != null) {
			var tl = fx.property("F's GuideFrame-0002").value;//TopLeft
			x0 = tl[0]; y0 = tl[1]; 
			var br = fx.property("F's GuideFrame-0003").value;//BottomRight
			x1 = br[0]; y1 = br[1]; 
			if (x0>x1) { var tmp = x0; x0 = x1; x1 = tmp; }
			if (y0>y1) { var tmp = y0; y0 = y1; y1 = tmp; }
		}

		x0 = Math.floor(x0/4 - 1) * 4;	//４の倍数に切りそろえる
		x1 = Math.floor(x1/4 + 1) * 4;
		if (x0<0) x0 = 0; if(x1>lyr.width) x1 = lyr.width;
		y0 = Math.floor(y0/4 - 1) * 4;
		y1 = Math.floor(y1/4 + 1) * 4;
		if (y0<0) y0 = 0; if(y1>lyr.height) y1 = lyr.height;

		
		//トリミングサイズ
		ret.trimL = x0;
		ret.trimT = y0;
		ret.trimW = x1 - x0;
		ret.trimH = y1 - y0;
		
		//レイヤのスケール
		ret.trimPos = new Array(0,0);
		ret.trimPos[0] = ret.lyrPos[0] *fitScale;
		ret.trimPos[1] = ret.lyrPos[1] *fitScale;
		
		//位置補正
		var x = (ret.lyrAnc[0] - ret.trimL) * ret.lyrScale[0] * fitScale / 100;
		var y = (ret.lyrAnc[1] - ret.trimT) * ret.lyrScale[1] * fitScale / 100;
		ret.trimAnc = new Array(x,y);

		//トリミング後のスケール
		ret.trimScale = new Array(0,0);
		ret.trimScale[0] = fitScale * ret.lyrScale[0];
		ret.trimScale[1] = fitScale * ret.lyrScale[1];

		//縮小後のトリミングサイズ
		ret.trimW2 = Math.ceil(ret.trimW * ret.trimScale[0]/100);
		var d = ret.trimW2 % 4;
		if ( d != 0){
			ret.trimW2 += (4-d);
		}
		ret.trimH2 = Math.ceil(ret.trimH * ret.trimScale[1]/100);
		var d = ret.trimH2 % 4;
		if ( d != 0){
			ret.trimH2 += (4-d);
		}
		var ld = getLayerDuration(lyr);
		ret.duration = ld.duration;
		ret.startTime = ld.startTime;

		//位置とアンカーを整数化
		ret.offsetPos = [0,0];
		ret.offsetAnc = [0,0];
		if ( isToInt == true){
			var jx = Math.floor(ret.trimPos[0]);
			var jy = Math.floor(ret.trimPos[1]);
			ret.offsetPos = [ ret.trimPos[0] - jx, ret.trimPos[1] - jy];
			ret.trimPos[0] = jx;
			ret.trimPos[1] = jy;
	
			jx = Math.floor(ret.trimAnc[0]);
			jy = Math.floor(ret.trimAnc[1]);
			ret.offsetAnc = [ jx - ret.trimAnc[0], jy - ret.trimAnc[1]];
			ret.trimAnc[0] = jx;
			ret.trimAnc[1] = jy;
		}
		
		var nm = lyr.name.toLowerCase();
		//レイヤ名にBG/Book/BR　があったらtrueに設定
		ret.BG = ( (nm.indexOf("bg")>=0)||(nm.indexOf("book")>=0)||(nm.indexOf("br")>=0));
		
		return ret;
	}
	//-------------------------------------------------------------
	function layerResize(lyr)
	{
		
		var prm = getTrimingPrm(lyr);

		//当倍と縮小用ののコンポを作成
		var pName1 = findCompName(partsFolder, lyr.name + trimCompFooter1);
		var pName2 = findCompName(partsFolder, lyr.name + trimCompFooter2);

		var pCmp = partsFolder.items.addComp(
			pName1,
			prm.trimW,
			prm.trimH,
			targetComp.pixelAspect,
			prm.duration,
			targetComp.frameRate);
		pCmp.duration = prm.duration;
		var pLayer = pCmp.layers.add(lyr.source);
		pLayer.startTime = -prm.startTime;
		pLayer.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0,0]);
		pLayer.property("ADBE Transform Group").property("ADBE Position").setValue([-prm.trimL,-prm.trimT]);
		
		
		if ( (isBG==true)&&(prm.BG==true)){
			//BG/Book対策がONで、名前にBG/BOOKがあれば処理しない
		}else{
			switch(smoothMode){
				case 1: addOLMSmoother(pCmp);break;
				case 2: addPSOFT(pCmp);break;
				default:
					break;
			}
		}
		
		//縮小用のコンポを作成
		var p2Cmp = partsFolder.items.addComp(
			pName2,
			prm.trimW2,
			prm.trimH2,
			targetComp.pixelAspect,
			prm.duration,
			targetComp.frameRate);
		p2Cmp.duration = prm.duration;
		var p2Layer = p2Cmp.layers.add(pCmp);
		p2Layer.property("ADBE Transform Group").property("ADBE Anchor Point").setValue([0,0]);
		p2Layer.property("ADBE Transform Group").property("ADBE Position").setValue(prm.offsetPos);//alert(prm.offsetPos.toString());
		p2Layer.property("ADBE Transform Group").property("ADBE Scale").setValue(prm.trimScale);

		var p3Layer = mixedComp.layers.add(p2Cmp);
		p3Layer.moveToEnd();
		p3Layer.property("ADBE Transform Group").property("ADBE Anchor Point").setValue(prm.trimAnc);
		p3Layer.property("ADBE Transform Group").property("ADBE Position").setValue(prm.trimPos);

		
	}
	/////////////////////////////////////////////////////////////////////
	//実行
	/////////////////////////////////////////////////////////////////////
	btnOK.onClick = function()
	{
		//ターゲットを得る
		var sl = getTargetLayers( ! cbIsSelectedOnly.value);
		if ( sl.length<=0){
			if ( targetComp==null){
				alert("Compがアクティブになっていません！");
			}else{
				alert("Layerが選択されいない、あるいは存在していません！");
			}
			return;
		}
		//ターゲットの確認
		var errMes = "";
		for ( var i=0; i<sl.length; i++){
			errMes += layerChk(sl[i]);
		}
		if ( errMes != ""){
			alert(errMes);
			return;
		}
		if ( getFitScale() == false){ return; }
		
		var mixedWidth = Math.round(targetComp.width * fitScale);
		var mixedHeight = Math.round(targetComp.height * fitScale);
		
		getSmoothMode();

		app.beginUndoGroup(scriptName);

		//パーツフォルダを作成
		var pName = targetComp.name + tbPartsFolderFooter.text;
		partsFolder = findFolder(targetComp.parentFolder,pName);
		//合成Compを作成
		var mName = findCompName(targetComp.parentFolder, targetComp.name + tbMixedCompFooter.text);
		mixedComp = targetComp.parentFolder.items.addComp(
			mName,
			mixedWidth,
			mixedHeight,
			targetComp.pixelAspect,
			targetComp.duration,
			targetComp.frameRate);
		mixedComp.duration = targetComp.duration;
		
		for ( var i=0; i<sl.length; i++){
			layerResize(sl[i]);
		}
		app.endUndoGroup();
		//CS3だとonCloseイベントが発生しなかったのでここで環境の保存を行う。
		settingSave();
	}
	/////////////////////////////////////////////////////////////////////
}

//objectを作成して実行
var cellTrimingsDlg = new cellTrimings(this);
