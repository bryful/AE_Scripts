(function (me)
{
	/////////////////////////////////////////////////////////////////////////////////
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
	/////////////////////////////////////////////////////////////////////////////////
	var scriptName = File.decode(getScriptName());

	/////////////////////////////////////////////////////////////////////////////////
	var alphaModeStrs = new Array("無視","ストレート - マットなし","合成チャンネル - カラーマット");
	var fieldSepaStrs = new Array("オフ","奇数フィールドから","偶数フィールドから");
	var pulldownStrs =  new Array("オフ","WSSWW","SSWWW","SWWWS","WWWSS","WWSSW","WWWSW-2pアドバンス","WWSWW-2pアドバンス","WSWWW-2pアドバンス","SWWWW-2pアドバンス","WWWWS-2pアドバンス");
	/////////////////////////////////////////////////////////////////////////////////
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [  22,   29,   22+ 192,   29+ 277]);
	
	
	var stAspect = winObj.add("statictext", [   7,   26,    7+ 170,   26+  12], "ピクセルアスペクト");
	var getAspect = winObj.add("button", [   9,   41,    9+  37,   41+  23], "Get");
	var edAspect = winObj.add("edittext", [  51,   41,   51+  88,   41+  19], "", {readonly:false, multiline:false});
	var setAspect = winObj.add("button", [ 146,   41,  146+  37,   41+  23], "Set");
	var stFrameRate = winObj.add("statictext", [   9,   67,    9+ 170,   67+  12], "フレームレート");
	var getFrameRate = winObj.add("button", [   9,   82,    9+  37,   82+  23], "Get");
	var edFrameRate = winObj.add("edittext", [  51,   84,   51+  88,   84+  19], "", {readonly:false, multiline:false});
	var setFrameRate = winObj.add("button", [ 146,   82,  146+  37,   82+  23], "Set");
	var stLoop = winObj.add("statictext", [   9,  108,    9+ 170,  108+  12], "フッテージ：ループ回数");
	var getLoop = winObj.add("button", [   9,  122,    9+  37,  122+  23], "Get");
	var edLoop = winObj.add("edittext", [  51,  123,   51+  88,  123+  19], "", {readonly:false, multiline:false});
	var setLoop = winObj.add("button", [ 146,  122,  146+  37,  122+  23], "Set");
	var stAlphaMode = winObj.add("statictext", [   9,  148,    9+ 170,  148+  12], "フッテージ：αモード");
	var getAlphaMode = winObj.add("button", [   9,  163,    9+  37,  163+  23], "Get");
	var lstAlphaMode = winObj.add("dropdownlist", [  51,  163,   51+  88,  163+  20], [ ]);
	var setAlphaMode = winObj.add("button", [ 146,  163,  146+  37,  163+  23], "Set");
	var stFieldSepa = winObj.add("statictext", [   9,  189,    9+ 170,  189+  12], "フッテージ：フィールドを分割");
	var getFieldSepa = winObj.add("button", [   9,  203,    9+  37,  203+  23], "Get");
	var lstFieldSape = winObj.add("dropdownlist", [  51,  204,   51+  88,  204+  20], [ ]);
	var setFieldSepa = winObj.add("button", [ 146,  202,  146+  37,  202+  23], "Set");
	var stPulldown = winObj.add("statictext", [   7,  228,    7+ 170,  228+  12], "フッテージ：プルダウンを削除");
	var getPulldown = winObj.add("button", [   9,  241,    9+  37,  241+  23], "Get");
	var lstPulldown = winObj.add("dropdownlist", [  51,  243,   51+  88,  243+  20], [ ]);
	var setPulldown = winObj.add("button", [ 146,  241,  146+  37,  241+  23], "Set");
	var stMes = winObj.add("statictext", [  11,    5,   11+ 164,    5+  17], "Message");



	//UIの初期化
	stMes.text = "";
	for ( var i=0; i<alphaModeStrs.length; i++) lstAlphaMode.add("item",alphaModeStrs[i]);
	for ( var i=0; i<fieldSepaStrs.length; i++) lstFieldSape.add("item",fieldSepaStrs[i]);
	for ( var i=0; i<pulldownStrs.length; i++) lstPulldown.add("item",pulldownStrs[i]);
	
	function fontSet(ctrl,sz){
		if ( sz == null) sz = 1;
		var fnt = ctrl.graphics.font;
		ctrl.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.BOLD, fnt.size * sz);
	}
	fontSet(lstAlphaMode,0.9);
	fontSet(lstFieldSape,0.9);
	fontSet(lstPulldown,0.9);
	fontSet(edAspect,1);
	fontSet(edFrameRate,1);
	fontSet(edLoop,1);
	fontSet(stAspect,1);
	fontSet(stFrameRate,1);
	fontSet(stLoop,1);
	fontSet(stAlphaMode,1);
	fontSet(stFieldSepa,1);
	fontSet(stPulldown,1);
	fontSet(stMes,1.1);
	
	/////////////////////////////////////////////////////////////////////////////////
	function selectedIndex(lst)
	{
		var ret = -1;
		if ( (lst==null)||(lst.items.length<=0)) return ret;
		for ( var i=0; i<lst.items.length; i++){
			if (lst.items[i].selected == true){
				ret = i;
				break;
			}
		}
		return ret;
	}
	/////////////////////////////////////////////////////////////////////////////////
	function getTargetList(isFtgOnly)
	{
		var ret = new Array;
		if ( app.project.selection.length>0){
			for ( var i=0; i<app.project.selection.length; i++){
				var itm = app.project.selection[i];
				if (isFtgOnly == true){
					if (  itm instanceof FootageItem) ret.push(itm);
				}else{
					if ( (itm instanceof CompItem)||(itm instanceof FootageItem)) ret.push(itm);
				}
			}
		}
		return ret;
	}
	/////////////////////////////////////////////////////////////////////////////////
	function getTarget(isFtgOnly)
	{
		function isT(f)
		{
			if ( isFtgOnly == true) {
				return (( f instanceof FootageItem)&&(f.file != null)); 
			}else {
				 return (( f instanceof CompItem)||(( f instanceof FootageItem)&&(f.file != null)));
			}
		}
		
		var ai = app.project.activeItem;
		if ( ai == null) {
			if ( app.project.selection.length>0) {
				for ( var i=0; i<app.project.selection.length; i++){
					if ( isT(app.project.selection[i]) == true) {
						ai = app.project.selection[i];
						break;
					}
				}
			}
		}
		if ( isT(ai)==false) ai = null;
		return ai;
	}
	/////////////////////////////////////////////////////////////////////////////////
	
	getAspect.onClick = function()
	{
		stMes.text = "";
		var t = getTarget(false);
		stMes.text = "";
		if ( t != null){
			edAspect.text = t.pixelAspect + "";
			stMes.text = "ピクセルアスペクト獲得";
		}
	}
	
	/////////////////////////////////////////////////////////////////////////////////
	setAspect.onClick = function()
	{
		function setPixelAspect(tFtg,ap)
		{
			var ret = false;
			if ( (tFtg instanceof FootageItem)||(tFtg instanceof CompItem ) ){
	 			if ( tFtg.pixelAspect != ap) {
		 			ret = true;
		 			//tFtg.pixelAspect = ap;
		 			//CS3では以下を対処を中止しないといけない
		 			if (ap==0.9) {
		 				tFtg.pixelAspect = 9/10 -0.0092;
		 			}else{
		 				tFtg.pixelAspect = ap;
				 	}
			 	}
			}
			return ret;
		}
		stMes.text = "";
		if ( isNaN(edAspect.text)==true) {
			stMes.text = "不正な文字列です";
			return;
		}
		var ap = edAspect.text * 1;
		if ( (ap<=0)||(ap>100) ) {
			stMes.text = "不正な値です";
			return;
		}
		var t = getTargetList(false);
		if ( t.length>0) {
			app.beginUndoGroup(scriptName + ":アスペクト変更");
			var cnt = 0;
			for ( var i=0; i<t.length; i++){
				if ( setPixelAspect(t[i],ap)== true) cnt++;
			}
			app.endUndoGroup();
			if ( cnt>0) {
				stMes.text = cnt +"個のアスペクトを変更";
			}else{
				stMes.text = "処理なし";
			}
		}
	}
	/////////////////////////////////////////////////////////////////////////////////
	getFrameRate.onClick = function()
	{
		stMes.text = "";

		var t = getTarget(false);
		if ( t != null){
		
			if ((( t.file != null)&&(t.mainSource.isStill == false))||(t instanceof CompItem)){
				var p = Math.round(t.frameRate * 1000);
				edFrameRate.text = (p/1000) + "";
			}else{
				edFrameRate.text = "";
			}
			stMes.text = "フレームレート獲得";
		}
	}
	/////////////////////////////////////////////////////////////////////////////////
	setFrameRate.onClick = function()
	{
		function setFr(tFtg,fr)
		{
			var ret = false;
			if (tFtg instanceof FootageItem){
				if (( tFtg.file != null)&&(tFtg.mainSource.isStill == false)){
					if (tFtg.mainSource.conformFrameRate != fr){
				 		tFtg.mainSource.conformFrameRate = fr;
						ret = true;
					}
				}
			}else if (tFtg instanceof CompItem) {
				if ( tFtg.frameRate != fr){
					tFtg.frameRate = fr;
					ret = true;
				}
			}else {
				//何もしない
			}
			return ret;
		}
		stMes.text = "";
		if ( isNaN(edFrameRate.text)==true) {
			stMes.text = "不正な文字列です";
			return;
		}
		var fr = edFrameRate.text * 1;
		if ( (fr<=0)||(fr>100) ) {
			stMes.text = "不正な値です";
			return;
		}
		var t = getTargetList(false);
		if ( t.length>0) {
			app.beginUndoGroup(scriptName + ":フレームレート変更");
			var cnt = 0;
			for ( var i=0; i<t.length; i++){
				if ( setFr(t[i],fr)== true) cnt++;
			}
			app.endUndoGroup();
			if ( cnt>0) {
				stMes.text = cnt +"個のフレームレートを変更";
			}else{
				stMes.text = "処理なし";
			}
		}
	}
	
	/////////////////////////////////////////////////////////////////////////////////
	getLoop.onClick = function()
	{
		stMes.text = "";
		var t = getTarget(true);
		if ( t != null){
			if (( t.file != null)&&(t.mainSource.isStill == false)){
				edLoop.text = t.mainSource.loop + "";
			}else{
				edLoop.text = "";
			}
			stMes.text = "ループ回数獲得";
		}
	}
	/////////////////////////////////////////////////////////////////////////////////
	setLoop.onClick = function()
	{
		function setLoop(tFtg,l)
		{
			var ret = false;
			if (tFtg instanceof FootageItem){
				if (( tFtg.file != null)&&(tFtg.mainSource.isStill == false)){
					if (tFtg.mainSource.loop != l){
				 		tFtg.mainSource.loop = l;
						ret = true;
					}
				}
			}
			return ret;
		}
		stMes.text = "";
		if ( isNaN(edLoop.text)==true) {
			stMes.text = "不正な文字列です";
			return;
		}
		var lp = edLoop.text * 1;
		if (lp<=0) {
			stMes.text = "不正な値です";
			return;
		}
		var t = getTargetList(true);
		if ( t.length>0) {
			app.beginUndoGroup(scriptName + ":ループ回数変更");
			var cnt = 0;
			for ( var i=0; i<t.length; i++){
				if ( setLoop(t[i],lp)== true) cnt++;
			}
			app.endUndoGroup();
			if ( cnt>0) {
				stMes.text = cnt +"個のループ回数を変更";
			}
		}
	}
	/////////////////////////////////////////////////////////////////////////////////
	getAlphaMode.onClick = function()
	{
		stMes.text = "";
		var t = getTarget(true);
		for ( var i=0; i<lstAlphaMode.items.length; i++)
			lstAlphaMode.items[i].selected = false;
		if ( (t != null)&&(t.file != null)){
			switch ( t.mainSource.alphaMode)
			{
				case AlphaMode.IGNORE : lstAlphaMode.items[0].selected = true; break;
				case AlphaMode.STRAIGHT :lstAlphaMode.items[1].selected = true; break;
				case AlphaMode.PREMULTIPLIED :lstAlphaMode.items[2].selected = true; break;
			}
			stMes.text = "アルファーモード獲得";
		}
	}
	/////////////////////////////////////////////////////////////////////////////////
	setAlphaMode.onClick = function()
	{
		function setAM(tFtg,p)
		{
			var ret = false;
			if (tFtg instanceof FootageItem){
				if ( tFtg.file != null){
					ret = true;
					switch(p)
					{
						case 0: tFtg.mainSource.alphaMode = AlphaMode.IGNORE; break;
						case 1: tFtg.mainSource.alphaMode = AlphaMode.STRAIGHT; break;
						case 2: tFtg.mainSource.alphaMode = AlphaMode.PREMULTIPLIED; break;
						default : ret = false; break;
					}
				}
			}
			return ret;
		}
		stMes.text = "";
		var idx = selectedIndex(lstAlphaMode);
		if ( idx<0) {
			stMes.text = "AlphaModeを選択してください";
			return;
		}
		var t = getTargetList(true);
		if ( t.length>0) {
			app.beginUndoGroup(scriptName + ":AlphaMode変更");
			var cnt = 0;
			for ( var i=0; i<t.length; i++){
				if ( setAM(t[i],idx)== true) cnt++;
			}
			app.endUndoGroup();
			if ( cnt>0) {
				stMes.text = cnt +"個のAlphaModeを変更";
			}else{
				stMes.text = "処理なし";
			}
		}
	}
	/////////////////////////////////////////////////////////////////////////////////
	getFieldSepa.onClick = function()
	{
		stMes.text = "";
		var t = getTarget(true);
		for ( var i=0; i<lstFieldSape.items.length; i++)
			lstFieldSape.items[i].selected = false;
		if ( (t != null)&&(t.file != null)&&(t.mainSource.isStill == false)){
			switch ( t.mainSource.fieldSeparationType)
			{
				case FieldSeparationType.OFF : lstFieldSape.items[0].selected = true; break;//4413
				case FieldSeparationType.UPPER_FIELD_FIRST : lstFieldSape.items[1].selected = true; break; //4412
				case FieldSeparationType.LOWER_FIELD_FIRST : lstFieldSape.items[2].selected = true; break;	//4414
			}
			stMes.text = "フィールドの分割を獲得";
		}
	}
	/////////////////////////////////////////////////////////////////////////////////
	setFieldSepa.onClick = function()
	{
		function setFS(tFtg,p)
		{
			var ret = false;
			if (tFtg instanceof FootageItem){
				if (( tFtg.file != null)&&(tFtg.mainSource.isStill == false)){
					ret = true;
					switch(p)
					{
						case 0: {
							tFtg.mainSource.removePulldown = PulldownPhase.OFF;
							tFtg.mainSource.fieldSeparationType = FieldSeparationType.OFF;
							break;
						}
						case 1: tFtg.mainSource.fieldSeparationType = FieldSeparationType.UPPER_FIELD_FIRST; break;
						case 2: tFtg.mainSource.fieldSeparationType = FieldSeparationType.LOWER_FIELD_FIRST; break;
						default : ret = false; break;
					}
				}
			}
			return ret;
		}
			stMes.text = "";
		var idx = selectedIndex(lstFieldSape);
		if ( idx<0) {
			stMes.text = "フィールドを選択してください";
			return;
		}
		if ( idx==0){
			lstPulldown.items[0].selected = true;
		}
		var t = getTargetList(true);
		if ( t.length>0) {
			app.beginUndoGroup(scriptName + ":フィールド分割変更");
			var cnt = 0;
			for ( var i=0; i<t.length; i++){
				if ( setFS(t[i],idx)== true) cnt++;
			}
			app.endUndoGroup();
			if ( cnt>0) {
				stMes.text = cnt +"個のフィールド分割を変更";
			}else{
				stMes.text = "処理なし";
			}
		}
	}
	/////////////////////////////////////////////////////////////////////////////////
	getPulldown.onClick = function()
	{
		stMes.text = "";
		var t = getTarget(true);
		for ( var i=0; i<lstPulldown.items.length; i++)
			lstPulldown.items[i].selected = false;
		if ( (t != null)&&(t.file != null)&&(t.mainSource.isStill == false)){
			if ( t.mainSource.fieldSeparationType != FieldSeparationType.OFF){
				var pp = t.mainSource.removePulldown;
				switch (pp)
				{
					case PulldownPhase.OFF :		lstPulldown.items[0].selected = true; break;
					case PulldownPhase.WSSWW :	lstPulldown.items[1].selected = true; break;
					case PulldownPhase.SSWWW :	lstPulldown.items[2].selected = true; break;
					case PulldownPhase.SWWWS :	lstPulldown.items[3].selected = true; break;
					case PulldownPhase.WWWSS :	lstPulldown.items[4].selected = true; break;
					case PulldownPhase.WWSSW :	lstPulldown.items[5].selected = true; break;
					case 4618 :	lstPulldown.items[6].selected = true; break;
					case 4619 :	lstPulldown.items[7].selected = true; break;
					case 4620 :	lstPulldown.items[8].selected = true; break;
					case 4621 :	lstPulldown.items[9].selected = true; break;
					case 4622 :	lstPulldown.items[10].selected = true; break;
				}
			stMes.text = "プルダウン削除を獲得";
			}
		}
	}
	/////////////////////////////////////////////////////////////////////////////////
	setPulldown.onClick = function()
	{
		function setPD(tFtg,p)
		{
			var ret = false;
			if (tFtg instanceof FootageItem){
				if (( tFtg.file != null)&&(tFtg.mainSource.isStill == false)){
					if ( tFtg.mainSource.fieldSeparationType != FieldSeparationType.OFF){
						ret = true;
						try{
						switch(p)
						{
							case  0: {
								tFtg.mainSource.removePulldown = PulldownPhase.OFF; break;
							}
							case  1: tFtg.mainSource.removePulldown = PulldownPhase.WSSWW; break;
							case  2: tFtg.mainSource.removePulldown = PulldownPhase.SSWWW; break;
							case  3: tFtg.mainSource.removePulldown = PulldownPhase.SWWWS; break;
							case  4: tFtg.mainSource.removePulldown = PulldownPhase.WWWSS; break;
							case  5: tFtg.mainSource.removePulldown = PulldownPhase.WWSSW; break;
							case  6: tFtg.mainSource.removePulldown = 4618; break;
							case  7: tFtg.mainSource.removePulldown = 4619; break;
							case  8: tFtg.mainSource.removePulldown = 4620; break;
							case  9: tFtg.mainSource.removePulldown = 4621; break;
							case 10: tFtg.mainSource.removePulldown = 4622; break;
							default : ret = false; break;
						}
						}catch(e){
						}
					}
				}
			}
			return ret;
		}
			stMes.text = "";
		var idx = selectedIndex(lstPulldown);
		if ( idx<0) {
			stMes.text = "プルダウンを選択してください";
			return;
		}
		var t = getTargetList(true);
		if ( t.length>0) {
			app.beginUndoGroup(scriptName + ":プルダウン削除変更");
			var cnt = 0;
			for ( var i=0; i<t.length; i++){
				if ( setPD(t[i],idx)== true) cnt++;
			}
			app.endUndoGroup();
			if ( cnt>0) {
				stMes.text = cnt +"個のプルダウン削除を変更";
			}else{
				stMes.text = "処理なし";
			}
		}
	}
	/////////////////////////////////////////////////////////////////////////////////
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	/////////////////////////////////////////////////////////////////////////////////
})(this);
