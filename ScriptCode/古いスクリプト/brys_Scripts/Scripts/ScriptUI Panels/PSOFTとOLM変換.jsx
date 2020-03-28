(function(me){
//-------------------------------------------------------------------------
	//prototype登録
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	//ファイル名のみ取り出す（拡張子付き）
	String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
		return r;
	}
	//拡張子のみを取り出す。
	String.prototype.getExt = function(){
		var r="";var i=this.lastIndexOf(".");if (i>=0) r=this.substring(i);
		return r;
	}
	//指定した書拡張子に変更（dotを必ず入れること）空文字を入れれば拡張子の消去。
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}
	//-------------------------------------------------------------------------

	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));

	var execMode = 0;  // 0:PSOFT to OLM 1: OLM to PSOFT
	var targetMode = 0; // 0:Project 1:Comp 2:Layer

	//-------------------------------------------------------------------------
	function propertyCopy(s,d)
	{
		if ( s.numKeys <=0){
			d.setValue(s.value);
		}else{
			for ( var i=1; i<=s.numKeys; i++){
				d.setValueAtTime(s.keyTime(i),s.keyValue(i));
			}
		}
		d.expression = s.expression;
		d.expressionEnabled = s.expressionEnabled;
		
	}
	//-------------------------------------------------------------------------
	function PSOFTtoOLM(tLayer)
	{
		if ((tLayer instanceof AVLayer)==false) return;

		
		var eg = tLayer.property("ADBE Effect Parade");
		if (eg.numProperties<=0) return;
		
		for ( var i=1; i<=eg.numProperties; i++){
			if ( (eg.property(i).matchName == "PSOFT ANTI-ALIASING")&&(eg.property(i).enabled == true)){
				var pD = eg.addProperty("OLM Smoother");
				var pS = eg.property(i); //何故かここで獲得しないとエラー
				if ( pD == null) continue;
				propertyCopy(pS.property("PSOFT ANTI-ALIASING-0003"),pD.property("OLM Smoother-0001"));
				propertyCopy(pS.property("PSOFT ANTI-ALIASING-0004"),pD.property("OLM Smoother-0002"));
				pD.name = pS.name + "!";
				pD.moveTo(i);
				eg.property(i+1).remove(); //pSが何故か壊れる
				
			}
		}
	}
	//-------------------------------------------------------------------------
	function OLMtoPSOFT(tLayer)
	{
		if ((tLayer instanceof AVLayer)==false) return;

		
		var eg = tLayer.property("ADBE Effect Parade");
		if (eg.numProperties<=0) return;
		
		for ( var i=1; i<=eg.numProperties; i++){
			if ( (eg.property(i).matchName == "OLM Smoother")&&(eg.property(i).enabled == true)){
				var pD = eg.addProperty("PSOFT ANTI-ALIASING");
				var pS = eg.property(i); //何故かここで獲得しないとエラー
				if ( pD == null) continue;
				propertyCopy(pS.property("OLM Smoother-0001"),pD.property("PSOFT ANTI-ALIASING-0003"));
				propertyCopy(pS.property("OLM Smoother-0002"),pD.property("PSOFT ANTI-ALIASING-0004"));
				pD.name = pS.name + "!";
				pD.moveTo(i);
				eg.property(i+1).remove(); //pSが何故か壊れる
				
			}
		}
	}
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "PO変換", [  88,  116,   88+ 258,  116+ 257] );
	//-------------------------------------------------------------------------
	
	//----------------------------------
	var stInfo = winObj.add("statictext", [   6,    9,    6+ 247,    9+  16], "PSOFT antialiasingとOLM Smootherを入れ替えます");
	stInfo.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stInfo2 = winObj.add("statictext", [  82,   25,   82+ 177,   25+  16], "パラメータは透明色だけ移行します。");
	stInfo2.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlOption = winObj.add("panel", [   9,   44,    9+ 237,   44+  73], "Option" );
	pnlOption.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbOLM = pnlOption.add("radiobutton", [  23,   12,   23+ 151,   12+  17], "OLM Smootherに変更");
	rbOLM.value = true;
	rbOLM.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbPSOFT = pnlOption.add("radiobutton", [  23,   36,   23+ 151,   36+  17], "PSOFT antialiasingに変更");
	rbPSOFT.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var pnlTarget = winObj.add("panel", [   9,  123,    9+ 237,  123+  97], "Target" );
	pnlTarget.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbProject = pnlTarget.add("radiobutton", [  23,   12,   23+ 151,   12+  17], "プロジェクト全体");
	rbProject.value = true;
	rbProject.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbComp = pnlTarget.add("radiobutton", [  23,   36,   23+ 151,   36+  17], "選択コンポ");
	rbComp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbLayer = pnlTarget.add("radiobutton", [  23,   59,   23+ 151,   59+  17], "選択レイヤ");
	rbLayer.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnExec = winObj.add("button", [  52,  226,   52+ 194,  226+  23], "実行" );
	btnExec.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);


	//-------------------------------------------------------------------------
	function getOptions()
	{
		if ( rbOLM.value==true) execMode = 0;
		else if ( rbPSOFT.value==true) execMode = 1;
		
		if ( rbProject.value==true) targetMode = 0;
		else if ( rbComp.value==true) targetMode = 1;
		else if ( rbLayer.value==true) targetMode = 2;
	}
	//-------------------------------------------------------------------------
	function setOptions()
	{
		rbOLM.value = rbPSOFT.value = false;
		if ( execMode == 0) rbOLM.value = true;
		else if ( execMode == 1) rbPSOFT.value = true;
		else{
			execMode = 0;
			rbOLM.value = true;
		}
		
		rbProject.value = rbComp.value = rbLayer.value = false;
		if ( targetMode == 0) rbProject.value = true;
		else if ( targetMode == 1) rbComp.value = true;
		else if ( targetMode == 2) rbLayer.value = true;
		else {
			targetMode = 0;
			rbProject.value = true;
		}
	}
	//-------------------------------------------------------------------------
	function prefSave()
	{
		getOptions();
		var o = new Object;
		o.execMode = execMode;
		o.targetMode = targetMode;
		var str = o.toSource();
		if (prefFile.open("w")){
			try{
				prefFile.write(str);
			}catch(e){
			}finally{
				prefFile.close();
			}
		}
	}
	winObj.onClose = prefSave;
	//-------------------------------------------------------------------------
	function prefLoad()
	{
		if ( (prefFile ==null)||(prefFile.exists ==false)) return;
		var str ="";
		if (prefFile.open("r")){
			try{
				str = prefFile.read();
			}catch(e){
				return;
			}finally{
				prefFile.close();
			}
		}
		if ( str == "") return;
		var o = eval(str);
		if (o!=null){
			if (o.execMode != undefined) { execMode = o.execMode; }
			if (o.targetMode != undefined) { targetMode = o.targetMode; }
		}
		setOptions();
	}
	prefLoad();
	//-------------------------------------------------------------------------
	function execLayer()
	{
		var ac = app.project.activeItem;
		if ( ( ac instanceof CompItem) == false){
			alert("コンポをアクティブにしてください");
			return;
		}
		var sl = ac.selectedLayers;
		if (sl.length<=0){
			alert("レイヤを選択してください。");
			return;
		}
		
		var fnc = null;
		var eee = "";
		if ( execMode ==0) {
			fnc = PSOFTtoOLM;
			eee = "PSOFT to OLM Smoother";
		}else if ( execMode ==1) {
			fnc = OLMtoPSOFT;
			eee = "OLM to PSOFT anti-aliasing";
		}
		
		app.beginUndoGroup(eee+"(Layer)");
		for( var i=0; i<sl.length; i++) fnc(sl[i]);
		app.endUndoGroup();
		
	}
	//-------------------------------------------------------------------------
	function execComp()
	{
		var sl = app.project.selection;
		var targets = [];
		if ( app.project.selection.length>0){
			for ( var i=0; i<app.project.selection.length; i++){
				if ( app.project.selection[i] instanceof CompItem){
					targets.push(app.project.selection[i]);
				}
			}
		}
		if ( targets.length<=0){
			alert("コンポを選択してください");
			return;
		}
		var fnc = null;
		var eee = "";
		if ( execMode ==0) {
			fnc = PSOFTtoOLM;
			eee = "PSOFT to OLM Smoother";
		}else if ( execMode ==1) {
			fnc = OLMtoPSOFT;
			eee = "OLM to PSOFT anti-aliasing";
		}
		
		app.beginUndoGroup(eee+"(Comp)");
				for ( var k=0; k<targets.length; k++){
			var cmp = targets[k];
			if ( cmp.numLayers>0){
				for ( var i=1; i<= cmp.numLayers; i++)fnc(cmp.layer(i));
			}
		}
		app.endUndoGroup();
		
	}
	//-------------------------------------------------------------------------
	function execProj()
	{
		var targets = [];
		if ( app.project.numItems>0){
			for ( var i=1; i<=app.project.numItems; i++){
				if ( app.project.item(i) instanceof CompItem){
					targets.push(app.project.item(i));
				}
			}
		}
		if ( targets.length<=0){
			alert("コンポがありません");
			return;
		}
		var fnc = null;
		var eee = "";
		if ( execMode ==0) {
			fnc = PSOFTtoOLM;
			eee = "PSOFT to OLM Smoother";
		}else if ( execMode ==1) {
			fnc = OLMtoPSOFT;
			eee = "OLM to PSOFT anti-aliasing";
		}
		
		app.beginUndoGroup(eee+"(Proj)");
		for ( var k=0; k<targets.length; k++){
			var cmp = targets[k];
			if ( cmp.numLayers>0){
				for ( var i=1; i<= cmp.numLayers; i++)fnc(cmp.layer(i));
			}
		}
		app.endUndoGroup();
		
	}

	//-------------------------------------------------------------------------
	btnExec.onClick = function()
	{
		getOptions();

		switch(targetMode)
		{
			case 0: execProj();break;
			case 1: execComp();break;
			case 2: execLayer();break;
		}
		
		
	}
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);
