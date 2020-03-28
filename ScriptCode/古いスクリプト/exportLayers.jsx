(function (me){	//獲得したテンプレート
	var rsTmp = [];
	var omTmp = [];
	var pref = {};	pref.showSaveDialog = false;	pref.outputFolder = Folder.myDocuments;	pref.om = "png8bitアルファー付き";	pref.rs = "最良設定";
	//prototype登録
	//指定された時間にキーフレームがあったらtrue
	Property.prototype.isKeyAtTime = function(t){
		return ( this.keyTime(this.nearestKeyIndex(t)) == t);
	}
	String.prototype.trim = function(){
		if (this == "" ) return "";
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
	String.prototype.getParent = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(0,i);
		return r;
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
		if(i>=0){return this.substring(0,i)+s;}else{return this; }
	}
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}

	FootageItem.prototype.nameTrue = function(){ var b=this.name;this.name=""; var ret=this.name;this.name=b;return ret;}
	
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File(Folder.userData.fullName+"/" + scriptName +".pref");
//*************************
//MainWindow
var winObj = ( me instanceof Panel) ? me : new Window("palette", "exportLayers", [0,0,0+385,0+214],{resizeable:true});

//*************************
//controls
var btnSelect = winObj.add("button",[11, 11, 11+75, 11+24],"Select");
var cbSaveDialog = winObj.add("checkbox",[92, 11, 92+282, 11+24],"実行時に保存ダイアログを表示");
var edPath = winObj.add("edittext",[11, 41, 11+363, 41+20],"");
var label = winObj.add("statictext",[11, 67, 11+363, 67+12],"コラップスONのレイヤと調整レイヤは正常に描画されません.手作業で対処！");
var label_2 = winObj.add("statictext",[11, 85, 11+363, 85+12],"必ずPNGアルファー付きに設定する");
var lbOM = winObj.add("statictext",[11, 107, 11+71, 107+12],"出力モジュール");
var cmbOM = winObj.add("dropdownlist",[88, 103, 88+286, 103+20],[]);
var lbRS = winObj.add("statictext",[11, 133, 11+76, 133+12],"レンダリング設定");
var cmbRS = winObj.add("dropdownlist",[93, 129, 93+281, 129+20],[]);
var btnExec = winObj.add("button",[11, 155, 11+100, 155+48],"実行");
//*************************
var selectFolderDialog = function(){	toPref();	if (pref.outputFolder.exists==false) {		pref.outputFolder = Folder.myDocuments;			}	var ret = pref.outputFolder.selectDlg();	return ret;}
//-------------------------------------------------------------------------
var getTemplateSub = function()
{
	var _ps = [];
	var _om = [];
	if ( app.project.renderQueue.numItems<=0){
		var tempComp = app.project.items.addComp("_temp_",100,100,1,1,24);
		var rq = app.project.renderQueue.items.add(tempComp);
		_ps = rq.templates;
		_om = rq.outputModules[1].templates;
		tempComp.remove();
	}else{
		var rq = app.project.renderQueue.item(1);
		_ps = rq.templates;
		_om = rq.outputModules[1].templates;
	}
	rsTmp = [];
	omTmp = [];


	for ( var i=0; i<_ps.length; i++)
		if ( _ps[i].indexOf("_HIDDEN")<0) rsTmp.push(_ps[i]);
	for ( var i=0; i<_om.length; i++)
		if ( _om[i].indexOf("_HIDDEN")<0) omTmp.push(_om[i]);
		}getTemplateSub();
	//-------------------------------------------------------------------------
var setComb = function(cmb, lst)
{
	var n = "";
	if (cmb.selection !== null) {
		n = cmb.items[cmb.selection.index].text;
	}
	if (cmb.items.length>0) cmb.removeAll();
	
	if (lst.length>0) {
		for (var i=0; i<lst.length; i++){
			cmb.add("item",lst[i]);
			if (n!==""){
				if ( lst[i] ===n) cmb.items[i].selected = true;
			}
		}
	}
	
}
//-------------------------------------------------------------------------
var setCombDef = function(cmb,s)
{
	if (cmb.items.length<=0) return;
	for (var i=0; i<cmb.items.length; i++){
		if (cmb.items[i].text == s) {
			cmb.items[i].selected = true;
			break;
		}
	}
}
//-------------------------------------------------------------------------
var getTemplate = function()
{
	setComb( cmbRS, rsTmp);
	
	setComb( cmbOM, omTmp);
	
	//if (cmbRS.selection == null) 
		setCombDef(cmbRS,pref.rs);
	
	//if (cmbOM.selection == null) 
		setCombDef(cmbOM,pref.om);
}
getTemplate();//*************************var zero4 = function(v) {	var ret = "";	if (v<=0) {		ret = "0000";	}else if (v<10){		ret = "000"+v;	}else if (v<100){		ret = "00"+v;	}else if (v<1000){		ret = "0"+v;	}else{		ret = ""+v;	}	return ret;}var zero2 = function(v) {	var ret = "";	if (v<=0) {		ret = "00";	}else if (v<10){		ret = "0"+v;	}else{		ret = ""+v;	}	return ret;}//*************************var  importLayerFile = function(theFile)
{
	try {
		var importOptions = new ImportOptions(theFile);
		return app.project.importFile(importOptions);
	} catch (error) {	alert(error.toString());
		return null;
	}
}//*************************var layerNameChk = function(nm){	if (nm=="") return "";	nm = nm.replace("%","％");
	nm = nm.replace("*","＊");
	nm = nm.replace(":","：");
	nm = nm.replace(";","；");
	nm = nm.replace("\\","￥");
	nm = nm.replace("/","／");	return nm;
}//*************************var execMain = function(){	toPref();	var ac = app.project.activeItem;	if ( !( ac instanceof CompItem)) {		alert("コンポをアクティブにしてください");		return;	}	var cnt = ac.numLayers;	if (cnt<=0 ){		alert("レイヤがありません。");		return;i	}		if (pref.showSaveDialog == true) {		var f = selectFolderDialog();		if (f==null) return;		pref.outputFolder = f;		fromPref();	}	//レイヤの状態を確保	var curTime = ac.time;	if (curTime<0) {		ac.time = 0;		curTime = 0;	}	var tLayers = [];	var tOpa = [];	var tOpaKey = [];	var tBlend = [];	var tEnabled = [];	var tSolo = [];	var tPt = [];	var tLock = [];	var tGuide = [];	var soloUsed = false;		for ( var i=1; i<=cnt; i++){		var lyr = ac.layers[i];		tLayers.push(lyr);		tLock.push(lyr.locked);		tEnabled.push(lyr.enabled);		var p = lyr.opacity;		var isKey = 1;		if (p.numKeys>0) {			if  (p.keyTime(p.nearestKeyIndex(curTime)) == curTime) {				isKey = -1;			}		}		tOpaKey.push(isKey);		tOpa.push(p.value);		tBlend.push(lyr.blendingMode);		tPt.push(lyr.preserveTransparency);		tGuide.push(lyr.guideLayer);	}		app.beginUndoGroup("exprtLayers - Seq1");	for ( var i=0; i<cnt; i++)	 {		tLayers[i].locked = false;		tLayers[i].enabled = false;		tLayers[i].preserveTransparency = false;		var p = tLayers[i].property("ADBE Transform Group").property("ADBE Opacity");		p.setValueAtTime(curTime,100);		tLayers[i].guideLayer = false;		//tLayers[i].solo = false;	}		//レンダーキューをすべて消す	if (app.project.renderQueue.numItems>0){
		for (var i=app.project.renderQueue.numItems; i>=1; i--) {
			app.project.renderQueue.items[i].remove();
		}
	}
			writeLn("00000");
	app.endUndoGroup();	var fno = zero4(Math.round(curTime * ac.frameRate) + app.project.displayStartFrame);	var importFiles = [];	for ( var i=0; i<cnt; i++)		{		tLayers[i].enabled = true;		var rq = app.project.renderQueue.items.add(ac);
		rq.applyTemplate(pref.rs);		rq.timeSpanStart = curTime;		rq.timeSpanDuration =ac.frameDuration;		write("a");
		rq.outputModules[1].applyTemplate(pref.om);
		write("b");		var nm = layerNameChk(File.decode(tLayers[i].name));		rq.outputModules[1].file = new File(pref.outputFolder.fullName +  "/"+ zero2(i+1)+"_" + nm+"_[####].png");		write("c");
		app.project.renderQueue.render();		writeLn("d");
				rq.remove();				tLayers[i].enabled = false;		var inf = new File(pref.outputFolder.fullName + "/"+ zero2(i+1) +"_" + nm +"_"+ fno + ".png");		importFiles.push(inf);				//とりあえず1回		//break;
	}	//状態を元に復帰	for ( var i=0; i<cnt; i++)	 {		tLayers[i].enabled = tEnabled[i];		tLayers[i].preserveTransparency = tPt[i];		tLayers[i].opacity = tOpa[i];		var p = tLayers[i].property("ADBE Transform Group").property("ADBE Opacity");		p.setValueAtTime(curTime,tOpa[i]);		if (tOpaKey[i]>0) {			p.removeKey(tOpaKey[i]);		}		tLayers[i].guideLayer = tGuide[i];		tLayers[i].locked = tLock[i];	}	app.beginUndoGroup("exprtLayers - Seq2");	//インポートして合成	var newFolder = ac.parentFolder.items.addFolder("Remix_"+fno);	var newCmp = newFolder.items.addComp(		ac.name+"_f"+fno,		ac.width,		ac.height,		ac.pixelAspect,		ac.duration,		ac.frameRate);				//後ろからインポート		for ( var i=cnt-1; i>=0; i--){			if (importFiles[i]==null) continue;			var ftg = importLayerFile(importFiles[i]);			if (ftg==null) continue;			ftg.parentFolder = newFolder;			var lyr = newCmp.layers.add(ftg);			lyr.name = lyr.name.replace("_"+ fno + ".png","");			lyr.enabled =  tEnabled[i];			var p = lyr.property("ADBE Transform Group").property("ADBE Opacity");			p.setValue(tOpa[i]);			lyr.blendingMode = tBlend[i];			lyr.preserveTransparency = tPt[i];			lyr.guideLayer = tGuide[i];			lyr.locked = tLock[i];		}	app.endUndoGroup();}
//*************************
var toPref = function(){	pref.showSaveDialog = cbSaveDialog.value;	var f = new Folder(edPath.text);	if (f.exists==true) {		pref.outputFolder = f;	}	if (cmbOM.selection!=null) {		pref.om = cmbOM.selection.text;	}	if (cmbRS.selection!=null) {		pref.rs = cmbRS.selection.text;	}	}//*************************
var fromPref = function(){	cbSaveDialog.value = pref.showSaveDialog ;	if (pref.outputFolder.exists == true) {		edPath.text = File.decode(pref.outputFolder.fullName);	}	setCombDef(cmbOM,pref.om);	setCombDef(cmbRS,pref.rs);		}//*************************
var prefSave = function(){	toPref();	if (prefFile.open("w")){
		prefFile.write(pref.toSource());
		prefFile.close();
	}		}//*************************
var prefLoad = function()
{
	if (!prefFile.exists) return;
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
	if ( str == "") return;	var p = eval(str);
	if (p.showSaveDialog != undefined) pref.showSaveDialog = p.showSaveDialog;
	if (p.outputFolder != undefined) {		if ( p.outputFolder.exists) {			pref.outputFolder = p.outputFolder;		}	}
	if (p.om != undefined) {		if (p.om!="") {			pref.om = p.om;		}	}
	if (p.rs != undefined) {			if (p.rs!="") {			pref.rs = p.rs;		}	}
		fromPref();
}prefLoad();//*************************
var statusChk = function(){	btnSelect.enabled = ! cbSaveDialog.value;	edPath.enabled = ! cbSaveDialog.value;}statusChk();
//*************************
//button click event
btnSelect.onClick = function(){
	var f = selectFolderDialog();	if (f!=null) {		edPath.text = f.fullName;		pref.outputFolder = f;	}}
btnExec.onClick = execMain;

cbSaveDialog.onClick = function(){	statusChk();}
//*************************
//resize event
winObj.onResize= function(){
	var b = winObj.bounds;
	var bw = b[2]-b[0];
	var edPath_b = edPath.bounds;
	edPath_b[2] = bw - edPath_b[0];
	edPath.bounds = edPath_b;
}
winObj.onClose = prefSave;
//*************************
//window show
if ( ( me instanceof Panel) == false){
	winObj.center();
	winObj.show();
}
})(this);
