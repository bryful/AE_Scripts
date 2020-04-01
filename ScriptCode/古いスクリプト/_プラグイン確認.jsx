(function (me)
{
	function chkPlugin()
	{
		/*
			この関数でプラグインの識別を行う。
		*/
		function isTarget(pro)
		{
			// スペースも含めてチェック
			var targetTbl = [
					"ADBE ",	//adobe標準
					"APC ",		//adobe標準
					"CC ",		//Cycore Effects
					"F's ",		//F's Plugins
					"OLM ",		//OLM
					];
/*
					"KNSW ",	//KNOLL LIGHT FACTORY
					"tc Shine",				//trapcode Shine
					"tc Particular",		//trapcode Particular
					"tc Starglow",			//trapcode Starglow
					"VIDEOCOPILOT OpticalFlares"		//OpticalFlares 末尾スペースなし
*/
			var pm = pro.matchName;
			for ( var i= 0; i<targetTbl.length; i++)
				if ( pm.indexOf(targetTbl[i]) ==0) return true;	
			return false;
		}
		//--------------------------
		var fxCount = 0;
		var noneSupportFxCount = 0;
		var errNameCount = 0;
		var isNameChk = false;
		this.isNameCheck = function(b) { isNameChk = b;}
		//--------------------------
		var prog = null;
		var console = null;
		this.setDisp = function(p,c){
			prog = p;
			console = c;
		}
		//--------------------------
		function cClear() {if (console != null)  console.text = "";}
		function cWriteLn(s) {if (console != null)  console.text = console.text  + s + "\r\n";}
		function cWrite(s) {if (console != null)  console.text = console.text + s;}
		function progSet(min,max) { 
			if ( prog != null) { 
				prog.minvalue = min;
				prog.maxvalue = max;
			}
		}
		function progValue(v) { if ( prog != null) prog.value = v; }
		function progVisible(b) { if ( prog != null) prog.visible = b; }
		function visibled(b){
			if ( console != null) console.visible = b; 
		}
		//--------------------------
		//--------------------------
		function compPath(cmp)
		{
			var ret = "";
			var p = [];
			p.push(cmp.name);
			var pf =  cmp.parentFolder;
			do{
				if ( (pf.id == app.project.rootFolder.id)||(pf == null)) break;
				p.push(pf.name);
				pf = pf.parentFolder;
			}while(true);
			p = p.reverse();
			var cnt = p.length;
			for ( var i=0; i<cnt; i++){
				ret += p[i];
				if ( i<cnt-1) ret += ":";
			}
			return ret;
		}
		//--------------------------
		function chkLayer(cmp,lyr,lyrIndex)
		{
			var fxg = lyr.property("ADBE Effect Parade");
			if ( (fxg == null)||(fxg == undefined)) return;
			if ( fxg.numProperties<=0) return;
			var cmpP = "Comp:[" + compPath(cmp) + "]" ;
			for ( var i=1; i<=fxg.numProperties; i++){
				var p = fxg.property(i);
				if (isTarget(p)==false){
					cWriteLn(cmpP  +   "layer(" + lyrIndex + ") [" + lyr.name +"] :" + p.name);
					noneSupportFxCount++;
				}
				fxCount++;
			}
		}
		//--------------------------
		function chkComp(cmp)
		{
			if (( cmp instanceof CompItem) == false) return;
			if ( cmp.numLayers <=0) return;
			for ( var i=1; i<=cmp.numLayers; i++){
				chkLayer(cmp,cmp.layers[i],i);
			}
		}
		//--------------------------
		function getExt(s)
		{
			if ( s == "") return "";
			var idx = s.lastIndexOf(".");
			if ( idx<0){
				return "";
			}else{
				return s.substr(idx).toLowerCase();
			}
		}
		//--------------------------
		function nameChk(s)
		{
			var tbl=[
				"0","1","2","3","4","5","6","7","8","9",
				"a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
				"_","-",".",","," ","+","(",")","[","]","{","}","/"," "];
			var ret = true;
			var cnt = s.length;
			if ( cnt>0) {
				var ss = s.toLowerCase();
				for ( var i=0; i<cnt; i++){
					var c = ss.charAt(i);
					
					var b = false;
					for (var j=0; j<tbl.length; j++){
						if ( c == tbl[j]){
							b = true;
							break;
						}
					}
					if ( b ==false) {
						ret  = false;
						break;
					}
				}
			}
			return ret;
		}
		//--------------------------
		function clear()
		{
			fxCount = 0;
			noneSupportFxCount = 0;
			errNameCount = 0;
			cClear();
		}
		this.clear = clear;
		//--------------------------
		this.exec = function()
		{
			clear();
			if ( app.project.numItems<=0) {
				cWriteLn("none items!");
				return;
			}
			progSet(0,app.project.numItems);
			progVisible(true);
			visibled(false);
			for ( var i=1; i<=app.project.numItems; i++) {
				var p = app.project.items[i];
				progValue(i);
				chkComp(p);
				if ( isNameChk == true){
					if ( (p instanceof FolderItem)||(p instanceof FootageItem)){
						if ( nameChk(p.name) == false){
							var cmpP = "Name Error! [" + compPath(p) + "]" ;
							cWriteLn(cmpP);
							errNameCount++;
						}
					}
				}
			}
			progValue(0);
			progVisible(false);
			if ( fxCount <=0){
				cWriteLn("none Plugins");
			}else{
				cWriteLn("------------------");
				cWriteLn("used plugins :" + fxCount );
				cWriteLn("none support plugins:"+noneSupportFxCount);
				if ( isNameChk == true){
					cWriteLn("error Name Footage/Folder:"+ errNameCount);
				}
			}
			visibled(true);
		}
	}
	//-------------------------------------------------------------------------
	var stInfo_str = "決められたプラグインが使われていないか確認します。";
	var cbChkName_str = "Footage/FolderItemの日本語チェックもする。CompItemはチェックしません。";
	var btnExec_str = "Exec";
	
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "プラグイン確認", [ 0,  0,  600,  300]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var stInfo = winObj.add("statictext", [  10,   10,   10+ 260,   10+  20], stInfo_str);
	stInfo.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edConsole = winObj.add("edittext", [  10,   36,   10+ 562,   36+ 193], "", { readonly:true, multiline:true, scrollable:true });
	edConsole.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cbChkName = winObj.add("checkbox", [  15,  235,   15+ 239,  235+  24], cbChkName_str);
	cbChkName.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var prog = winObj.add("progressbar", [  15,  265,   15+ 431,  265+  23],    0 ,   0,  100 );
	var btnExec = winObj.add("button", [ 464,  235,  464+ 110,  235+  60], btnExec_str );
	btnExec.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	prog.visible = false;
	cbChkName.value = true;
	//-------------------------------------------------------------------------
	var chkP = new chkPlugin;
	chkP.setDisp(prog, edConsole);
	winObj.onActivate = function() { writeLn("a");}
	//-------------------------------------------------------------------------
	function resiseWin()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		
		edConsole.visible = false;
		var cw = edConsole.bounds;
		cw[0] = 10;
		cw[1] = 30;
		cw[2] = w - 10;
		cw[3] = h - 80;
		edConsole.bounds = cw;

		var eb = btnExec.bounds;
		eb[0] = w - (110 + 10);
		eb[1] = h - (60+10);
		eb[2] = w - 10;
		eb[3] = h - 10;
		btnExec.bounds = eb;
		
		var pb = prog.bounds;
		pb[0] = 10;
		pb[1] = h - (20 +10);
		pb[2] = w - (110+20);
		pb[3] = h - 10;
		prog.bounds = pb;

		var cb = cbChkName.bounds;
		cb[0] = 10;
		cb[1] = h - (40 +20);
		cb[2] = w - (110+20);
		cb[3] = h - 40;
		cbChkName.bounds = cb;
		
		edConsole.visible = true;
	}
	
	btnExec.onClick = function(){
		chkP.isNameCheck(cbChkName.value);
		chkP.exec();
	}
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	resiseWin();
	winObj.onResize = resiseWin;
	//-------------------------------------------------------------------------


})(this);
