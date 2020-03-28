﻿(function (me){
	var rsTmp = [];
	var omTmp = [];

	//prototype登録
	//指定された時間にキーフレームがあったらtrue
	Property.prototype.isKeyAtTime = function(t){
		return ( this.keyTime(this.nearestKeyIndex(t)) == t);
	}

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

var selectFolderDialog = function()
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
getTemplate();
{
	try {
		var importOptions = new ImportOptions(theFile);
		return app.project.importFile(importOptions);
	} catch (error) {
		return null;
	}
}
	nm = nm.replace("*","＊");
	nm = nm.replace(":","：");
	nm = nm.replace(";","；");
	nm = nm.replace("\\","￥");
	nm = nm.replace("/","／");
}
		for (var i=app.project.renderQueue.numItems; i>=1; i--) {
			app.project.renderQueue.items[i].remove();
		}
	}
	
	app.endUndoGroup();
		rq.applyTemplate(pref.rs);
		rq.outputModules[1].applyTemplate(pref.om);
		write("b");
		app.project.renderQueue.render();
		

//*************************
var toPref = function()
var fromPref = function()
var prefSave = function()
		prefFile.write(pref.toSource());
		prefFile.close();
	}	
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
	if ( str == "") return;
	if (p.showSaveDialog != undefined) pref.showSaveDialog = p.showSaveDialog;
	if (p.outputFolder != undefined) {
	if (p.om != undefined) {
	if (p.rs != undefined) {
	
}
var statusChk = function()
//*************************
//button click event
btnSelect.onClick = function()
	var f = selectFolderDialog();
btnExec.onClick = execMain;

cbSaveDialog.onClick = function()

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
