//---------------------------------------------------------------------------
// 撮影台作成 2013/01/08
//
// beanjamさんの撮影台エクスプレッションを作成するスクリプト
// AE_Remap作成時のスピンアウト
//
// いろいろ修正
//---------------------------------------------------------------------------
//--
(function (me)
{
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	Array.prototype.indexIn = function(i){
		return ((typeof(i)=="number")&&(i>=0)&&(i<this.length));
	}
	Array.prototype.removeAt = function(i) {
		if(this.indexIn(i)==true) return this.splice(i,1);else return null;
	}
	//ファイル名のみ取り出す（拡張子付き）
	String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
		return r;
	}
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
	Application.prototype.getScriptName = function(){
		return File.decode($.fileName.getName());
	}
	
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));
	//-------------------------------------------------------------------------

	//各パラメータの初期値
	//もし、workとcameraのサイズが同じならworkコンポは作成しない
	var cameraWidth			= 1280;	//カメラサイズ。
	var cameraHeight			= 720;
	var workWidth				= 1408;
	var workHeight			= 792;

	//調整レイヤ
	var cameraSolidName		= "camera";

//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 870,  485,  870+ 164,  485+ 163]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var stCameraWidth = winObj.add("statictext", [  10,   10,   10+  70,   10+  17], "cameraWidth");
	stCameraWidth.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edCameraWidth = winObj.add("edittext", [  90,   10,   90+  60,   10+  21], cameraWidth);
	edCameraWidth.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stCameraHeight = winObj.add("statictext", [  10,   40,   10+  70,   40+  17], "cameraHeight");
	stCameraHeight.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edCameraHeight = winObj.add("edittext", [  90,   40,   90+  60,   40+  21], cameraHeight);
	edCameraHeight.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stWorkWidth = winObj.add("statictext", [  10,   70,   10+  70,   70+  17], "workWidth");
	stWorkWidth.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edWorkWidth = winObj.add("edittext", [  90,   70,   90+  60,   70+  21], workWidth);
	edWorkWidth.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stWorkHeight = winObj.add("statictext", [  10,  100,   10+  70,  100+  17], "workHeight");
	stWorkHeight.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var edWorkHeight = winObj.add("edittext", [  90,  100,   90+  60,  100+  21], workHeight);
	edWorkHeight.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnExec = winObj.add("button", [  10,  130,   10+ 150,  130+  30], scriptName );
	btnExec.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	//-------------------------------------------------------------------------
	
	function resizeD()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		var cwb = edCameraWidth.bounds;
		cwb[2] = w -10;
		edCameraWidth.bounds = cwb;
		var chb = edCameraHeight.bounds;
		chb[2] = w -10;
		edCameraHeight.bounds = chb;
		var wwb = edWorkWidth.bounds;
		wwb[2] = w -10;
		edWorkWidth.bounds = wwb;
		var whb = edWorkHeight.bounds;
		whb[2] = w -10;
		edWorkHeight.bounds = whb;
		var beb = btnExec.bounds;
		beb[2] = w -10;
		btnExec.bounds = beb;
	}
	resizeD();
	winObj.onResize = resizeD;
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	
	//----------------------------------------------------
	function strToInt(inS)
	{
		if ( (inS==null)||(inS=="") ) {
			return -1;
		}
		var v = Math.floor(eval(inS));
		if( (v<=0)||(v>=30000) ) {
			return -1;
		}
		return v;
	}
	function addEffect(cLayer, eName)
	{
		var fxg = cLayer.property("ADBE Effect Parade");
		if (fxg.canAddProperty(eName)) {
			return  fxg.addProperty(eName);
		}else{
			return null;
		}
	}
	//----------------------------------------------------
	//Stageを準備する
	//----------------------------------------------------
	function setupStage(cmp)
	{
		cameraWidth	= strToInt(edCameraWidth.text);
		if ( cameraWidth<=0){
			alert("cameraWidthが不正です "+cameraWidth ,scriptName);
			return;
		}
		cameraHeight	= strToInt(edCameraHeight.text);
		if ( cameraHeight<=0){
			alert("cameraHeightが不正です "+ cameraHeight,scriptName);
			return;
		}
		workWidth		= strToInt(edWorkWidth.text);
		if ( workWidth<=0){
			alert("workWidthが不正です "+ workWidth,scriptName);
			return;
		}
		workHeight		= strToInt(edWorkHeight.text);
		if ( workHeight<=0){
			alert("workHeightが不正です "+ workHeight,scriptName);
			return;
		}
		
		var camera = cmp.layers.addSolid(	[1,1,1],
														cameraSolidName,
														workWidth,
														workHeight,
														cmp.pixelAspect,
														cmp.duration);

		camera.guideLayer = true;
		camera.moveToBeginning();

		//フレームプラグイン登録
		var fx=addEffect(camera,"F's Frame");
		if (fx!=null){
			fx.property("width").setValue(cameraWidth);
			fx.property("height").setValue(cameraHeight);
		}
		

		var workFlag	= true;
		if ( (workWidth==cameraWidth)&&(workHeight==cameraHeight) ){
			workFlag	= false;
		}
		var cLayer = null;
		if  (workFlag == true){
			newName = cmp.name + "_0work";
		}else{
			newName = cmp.name + "_work";
		}
		var workComp =  cmp.parentFolder.items.addComp(	
													newName,
													workWidth,
													workHeight,
													cmp.pixelAspect,
													cmp.duration,
													cmp.frameRate
													);
		workComp.duration = cmp.duration;
		cLayer = workComp.layers.add(cmp);
		
		//beamjamさんのエクスプレッションです。
		cLayer.anchorPoint.expression	= "comp(name).layer(\""+cameraSolidName+"\").position;";
		cLayer.position.expression		= "comp(name).layer(\""+cameraSolidName+"\").anchor_point;";
		cLayer.scale.expression				=
			"sx = 10000 / comp(name).layer(\""+cameraSolidName+"\").scale[0];\n"+
			"sy = 10000 / comp(name).layer(\""+cameraSolidName+"\").scale[1];\n"+
			"[sx,sy];\n";
		cLayer.rotation.expression		= "-comp(name).layer(\""+cameraSolidName+"\").rotation;";
	
		if (workFlag){
			var finalComp =  cmp.parentFolder.items.addComp(
															cmp.name + "_1fixed",
															cameraWidth,
															cameraHeight,
															cmp.pixelAspect,
															cmp.duration,
															cmp.frameRate
															);
			finalComp.duration = cmp.duration;
			var cLayer2 = finalComp.layers.add(workComp);
			finalComp = null;
		}
		workComp = null;
		
	}

	//-----------------------------------------------------
	function exec()
	{
		var targetComp = app.project.activeItem;
		if ( ( targetComp == null) || ( (targetComp instanceof CompItem) == false)){
			alert("コンポを選んでください",scriptName);
		}
		app.beginUndoGroup(scriptName);
		setupStage(targetComp);
		targetComp = null;
		app.endUndoGroup();
	}
	btnExec.onClick = exec;
	//-----------------------------------------------------
	/*
	//----------------------------------------------------
	// Main
	//----------------------------------------------------
	this.execute = function()
	{
		if ( (this.targetComp==null)|| !(this.targetComp instanceof CompItem) ) {
			this.errMes = "コンポを選択してください。";
			return false;
		}

		while (true) {
			var r = this.buildAndShowDialog();
			
			if (r==1) {
					if (this.valueGet()==true) {break;}
			}
			if (r!=1) {
				return;
			}
		}
		if (this.setupStage()==false){
			return false;
		}
		return true;
	}
	//----------------------------------------------------
}

function buildCamStage()
{

	//-------------------------------------------------
	//レイヤにエフェクト追加。エフェクトプロパティを返す
	//-------------------------------------------------
	//----------------------------------------------------
	//名前を分解
	//----------------------------------------------------
	this.splitName = function(s)
	{
		var ret = new Object;
		ret.num = -1;
		ret.numLen = 0;
		ret.dot = "";
		ret.name = "";
		
		if (s=="") return ret;
		
		var idx = -1;
		for ( var i= 0; i<s.length; i++){
			var c = s[i];
			if ( (c>="0")&&(c<="9")) {
			}else{
				if ( (c=".")||(c="-")||(c="_") ) {
					ret.dot = c;
				}
				idx = i;
				break;
			}
		}
		if (idx<=0) {
			ret.name = s;
			return ret;
		}
		var s0 = "";
		var s2 = "";
		if (ret.dot==""){
			s0 = s.substr(0,idx);
			s2 = s.substr(idx);
		}else{
			s0 = s.substr(0,idx);
			s2 = s.substr(idx+1);
		}
		ret.num = s0 * 1;
		ret.numLen = s0.length;
		ret.name = s2;
		return ret;
		
	}
	//----------------------------------------------------
	//Stageを準備する
	//----------------------------------------------------
	this.setupStage = function()
	{
		
		var camera = this.targetComp.layers.addSolid(	[1,1,1],
														this.cameraSolidName,
														this.workWidth,
														this.workHeight,
														this.targetComp.pixelAspect,
														this.targetComp.duration);
		camera.guideLayer = true;
		camera.moveToBeginning();

		//フレームプラグイン登録
		var fx=this.addEffect(camera,"F's Frame");
		if (fx!=null){
			fx.property("width").setValue(this.cameraWidth);
			fx.property("height").setValue(this.cameraHeight);
		}
		
		var orgN = this.splitName(this.targetComp.name);

		var newWorkName = "";
		var newFixedName = "";
		if (orgN.num>=0){
			var newNum = orgN.num + 1;
			if (newNum<10) {
				newNum = "0"+newNum;
			}else{
				newNum = ""+newNum;
			}
			 newWorkName = newNum + orgN.dot + orgN.name + "_work";
			newNum = orgN.num + 2;
			if (newNum<10) {
				newNum = "0"+newNum;
			}else{
				newNum = ""+newNum;
			}
			 newFixedName = newNum + orgN.dot + orgN.name + "_fixed";
			
		}else{
			newWorkName = orgN.name +"_0work";
			newFixedName = orgN.name +"_1fixed";
		}
		
		if ( (this.workWidth==this.cameraWidth)&&(this.workHeight==this.cameraHeight) ){
			var workFlag	= false;
			var newW		 	= this.cameraWidth;
			var newH		 	= this.cameraHeight;
		}else{
			var workFlag	= true;
			var newW		 	= this.workWidth;
			var newH		 	= this.workHeight;
		}
	
		this.workComp =  this.targetComp.parentFolder.items.addComp(	
													newWorkName,
													newW,
													newH,
													this.targetComp.pixelAspect,
													this.targetComp.duration,
													this.targetComp.frameRate
													);
		this.workComp.duration = this.targetComp.duration;
		
		var cLayer = this.workComp.layers.add(this.targetComp);
		//beamjamさんのエクスプレッションです。
		cLayer.anchorPoint.expression	= "comp(name).layer(\""+this.cameraSolidName+"\").position;";
		cLayer.position.expression		= "comp(name).layer(\""+this.cameraSolidName+"\").anchor_point;";
		cLayer.scale.expression				=
			"sx = 10000 / comp(name).layer(\""+this.cameraSolidName+"\").scale[0];\n"+
			"sy = 10000 / comp(name).layer(\""+this.cameraSolidName+"\").scale[1];\n"+
			"[sx,sy];\n";
		cLayer.rotation.expression		= "-comp(name).layer(\""+this.cameraSolidName+"\").rotation;";
	
		if (workFlag){
			this.finalComp =  this.targetComp.parentFolder.items.addComp(
															newFixedName,
															this.cameraWidth,
															this.cameraHeight,
															this.targetComp.pixelAspect,
															this.targetComp.duration,
															this.targetComp.frameRate
															);
			this.finalComp.duration = this.targetComp.duration;
			var cLayer2 = this.finalComp.layers.add(this.workComp);
		}
	}
	//----------------------------------------------------
	this.valueGet = function()
	{
		var v = this.strToInt(this.cameraWEdit.text);
		if (v<=0) { return false;}
		this.cameraWidth = v;
		var v = this.strToInt(this.cameraHEdit.text);
		if (v<=0) { return false;}
		this.cameraHeight = v;
		var v = this.strToInt(this.workWEdit.text);
		if (v<=0) { return false;}
		this.workWidth = v;
		var v = this.strToInt(this.workHEdit.text);
		if (v<=0) { return false;}
		this.workHeight = v;
		
		if (this.workNEdit.text=="") { return false;}
		this.workCompName = this.workNEdit.text;
		
		if (this.finalNEdit.text=="") { return false;}
		this.finalCompName = this.finalNEdit.text;
		
		return true;
	}
	*/
	//----------------------------------------------------
	//
	//----------------------------------------------------

})(this);
