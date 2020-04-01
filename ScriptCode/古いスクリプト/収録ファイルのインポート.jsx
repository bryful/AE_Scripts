var  _fileArrayExec = null;

(function (me)
{
	#includepath "/c/Program Files/Adobe/Adobe After Effects CS5/Support Files/Scripts/Startup;/c/Program Files/Adobe/Adobe After Effects CS5/Support Files/Scripts/ScriptUI Panels;/c/Program Files/Adobe/Adobe After Effects CS5/Support Files/Scripts/"

	#include "FsPictureFile.jsxinc"
	#include "FsImporter.jsxinc"
	#include "FsMakeRecComp.jsxinc"
	#include "json2.js"
	
	String.prototype.trim = function(){
		if (this=="" ) return ""
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
	
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}
	
	FootageItem.prototype.nameTrue = function(){ var b=this.name;this.name=""; var ret=this.name;this.name=b;return ret;}
	//拡張子のみを取り出す。
	String.prototype.getExt = function(){
		var r="";var i=this.lastIndexOf(".");if (i>=0) r=this.substring(i);
		return r;
	}
	//指定した書拡張子に変更（dotを必ず入れること）空文字を入れれば拡張子の消去。
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){
			return this.substring(0,i)+s;
		}else{
			return this;
		}
	}
	//--------------------------------------------------------------------------------
	var boldData =
		{
			"header":"ボールド作成.exe [ Data File ] v1.0",
			"data":[
				"バトルスピリッツ ソードアイズ",
				"etc",
				"R00",
				"",
				"",
				"",
				"",
				"",
				"",
				""],
			"Lock":[false,false,false,false,false,false,false,false,false,false],
			"LockCampany":false,
			"BackStyle":2,
			"BaseColor":[0.74509803921568629,0.74509803921568629,0.74509803921568629],
			"RectColor":[0.90196078431372551,0.90196078431372551,0.90196078431372551],
			"ShadowColor":[0.70588235294117652,0.70588235294117652,0.70588235294117652],
			"LineColor":[0.0392156862745098,0.0392156862745098,0.0392156862745098],
			"LineColor2":[0.86274509803921573,0.86274509803921573,0.86274509803921573],
			"LineWidth":3,
			"CustumPictureName":"",
			"CanpanyName":"",
			"ClipName":"etc",
			"BoldWidthIndex":5,
			"BoldAspect":0,
			"BoldD1":false
		};
	//--------------------------------------------------------------------------------
	var scriptPath = $.fileName.getParent();
	var incPath = scriptPath + "/(" +$.fileName.getName().changeExt("")+ ")";
	var incFolder = new Folder(incPath);
	var ffxPath = incPath + "/preset";
	var ffxFolder = new Folder(ffxPath);

	if ( incPath.exists == false) incPath.create();
	if ( ffxFolder.exists == false) ffxFolder.create();

	var rollBoleName = "BS5_01_000_R01";
	//--------------------------------------------------------------------------------
	ShapeLayer.prototype.setPreset = 
	TextLayer.prototype.setPreset = 
	AVLayer.prototype.setPreset = function(str)
	{
		var ffx = new File (incPath + "/" + str);
		if ( ffx.exists == false){
			alert(str + "がない");
		}
		this.name = str.changeExt("");
		this.applyPreset(ffx);
	}
	//--------------------------------------------------------------------------------
	function selectImportFolder()
	{
		return Folder.selectDialog("インポートファイルがあるフォルダを選択してください。");
	}
	//--------------------------------------------------------------------------------
	function makeRollBold()
	{
		var ret = null;
		//app.project.i temCollection.addComp(name, width, height, pixelAspect , durat ion, f rameRate)
		ret = app.project.items.addComp(
				rollBoleName,
				1920,
				1080,
				1,
				1/23.976,
				23.976);
		var base = ret.layers.addShape();
		base.setPreset("boldBase.ffx");
		var title = ret.layers.addText("title");
		title.setPreset("title.ffx");
		var captionTitle = ret.layers.addText("captionTitle");
		captionTitle.setPreset("captionTitle.ffx");
		var captionSubtitle = ret.layers.addText("captionSubtitle");
		captionSubtitle.setPreset("captionSubtitle.ffx");
		var memo = ret.layers.addText("memo");
		memo.setPreset("memo.ffx");
		var subTitleNo = ret.layers.addText("subTitleNo");
		subTitleNo.setPreset("subTitleNo.ffx");
		
		var recDate = ret.layers.addText("recDate");
		recDate.setPreset("recDate.ffx");
		var td = recDate.property("ADBE Text Properties").property("ADBE Text Document").value;
		var d = new Date();
		td.text = d.getFullYear() + "年" +(d.getMonth()+1) + "月" + d.getDate() +"日";
		recDate.property("ADBE Text Properties").property("ADBE Text Document").setValue(td);
		var rollNo = ret.layers.addText("rollNo");
		rollNo.setPreset("rollNo.ffx");
		
	}
	//--------------------------------------------------------------------------------
	function main(fld)
	{
		var importItems = [];
		var fsImport = new FsImporter;
		var p0 = [];
		var p1 = [];
		p0.push(File.decode( fld.name) );
		p1.push(File.decode( fld.name) );
		p1.push("_importFiles" );
		var compFolders = fsImport.findFolderByPathArray(p0);
		var importFolders = fsImport.findFolderByPathArray(p1);
		var pfs = new FsPictureFiles;
		if ( pfs.listup(fld)==true){
			var cnt = pfs.count();
			for ( var i=0; i<cnt; i++){
				var imp = fsImport.import(pfs.importOptions(i),importFolders[0]);
				if ( imp != null){
					importItems.push(imp);
				}
			}
		}
		if ( importItems.length<=0){
			alert("連番が無い");
		}else{
			var mrc = new FsMakeRecComp("BS5",23.976,23.976);
			mrc.exec(importItems,compFolders[0]);
		}
	}
	//--------------------------------------------------------------------------------
	function callMain(ary)
	{
		if ( ( ary instanceof Array)==false) return;
		if (ary.length <=0) return;
		var fld = null;
		for ( var i=0; i<ary.length; i++){
			if ( ary[i] instanceof Folder){
				fld = ary[i];
				break;
			}
		}
		if ( fld != null) main(fld);
		
	}
	_fileArrayExec = callMain;
	//--------------------------------------------------------------------------------
	function selectFolder()
	{
		var f= Folder.selectDialog("ロールフォルダを選んできださい",incPath);
		if ( f != null)
		{
			main(f);
		}
	}
	//--------------------------------------------------------------------------------
	var winObj = null;
	var btnDialog = null;
	var btnFsDD = null;
	var popBold = null;
	var popOutPath = null;
	var popRQ = null;
	var popOM = null;
	var btnReload = null;
	
	var btnSelectOutFolder = null;
	function buildWindow()
	{
		var w = 280;
		var h = 350;
		//-------------------------------------------------------------------------
		winObj = ( me instanceof Panel) ? me : new Window("palette", "収録データのインポート", [ 0,0,  w,  h]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
		//-------------------------------------------------------------------------
		var left = 10;
		var top = 5;
		var stFolder = winObj.add("statictext", [  left, top,   left+100, top + 15], "フォルダ選択");
		top += 20;
		btnDialog = winObj.add("button", [  left,   top,   left+  60,   top + 30], "Dialog" );
		btnFsDD = winObj.add("button", [  80,   top, 80 + 190, top + 30], "Open FsDD" );
		top += 35;
		var stBold = winObj.add("statictext", [ left,top,left + 100, left + 20], "ロールボールド内容");
		top += 25;
		popBold = winObj.add("dropdownlist", [ left, top, left + 270, top + 25], [ ]);
		top += 30;
		var stOutPath = winObj.add("statictext", [ left,  top, left+ 100, top + 20], "出力先");
		btnSelectOutFolder = winObj.add("button", [ 200,  top, 200 + 70, top + 20], "追加");
		top += 25;
		popOutPath = winObj.add("dropdownlist", [ left, top, left + 270, top + 25], [ ]);
		top += 30;
		var stRQ = winObj.add("statictext", [ left, top, left + 150, top + 20], "レンダリング設定");
		top += 25;
		popRQ = winObj.add("dropdownlist", [ left, top, left + 270, top + 25], [ ]);
		top += 30;
		var stOM = winObj.add("statictext", [ left, top, left + 150, top + 20], "出力モジュール");
		top += 25;
		popOM = winObj.add("dropdownlist", [ left, top, left + 270, top +  25], [ ]);
		top += 40;
		btnReload = winObj.add("button", [ left, top, left + 270, top +  30], "reload" );
	}
	buildWindow();
	
	//-------------------------------------------------------------------------
	function resizeWin()
	{
		var b = winObj.bounds;
		
		var a = btnFsDD.bounds;
		a[2] = b.width -10;
		btnFsDD.bounds = a;

		var a = popBold.bounds;
		a[2] = b.width -10;
		popBold.bounds = a;

		var a = popOutPath.bounds;
		a[2] = b.width -10;
		popOutPath.bounds = a;

		var a = popRQ.bounds;
		a[2] = b.width -10;
		popRQ.bounds = a;

		var a = popOM.bounds;
		a[2] = b.width -10;
		popOM.bounds = a;

		var a = btnReload.bounds;
		a[2] = b.width -10;
		btnReload.bounds = a;
	}
	resizeWin();
	winObj.onResize =resizeWin;
	//-------------------------------------------------------------------------
	var sendScriptCode = 
		"var _fileArray = eval(system.callSystem(\"pbpaste\"));"+
		"_fileArrayExec(_fileArray);";
	//-------------------------------------------------------------------------
	function unescapeUnicode(str)
	{
		return str.replace(
			/\\u([a-fA-F0-9]{4})/g,
			function(m0,m1)
			{
				return String.fromCharCode(parseInt(m1,16));
			}
		);
	}
	//-------------------------------------------------------------------------
	function callFsDDatJson()
	{
		var obj = new Object;
		//実行するAfter Effectsの指定
		obj.AfterFXPath = Folder.appPackage.fsName+"\\AfterFX.exe"
		//After Effectsへ返されるスクリプトコード
		obj.sendScriptCode = sendScriptCode;
		//D&Dするターゲットの指定
		obj.targetType = 2;
		//ウィンドウのキャプション
		obj.Caption = "フォルダを選んで";
		//ウィンドウのタイトル
		obj.Title = "取り込み";

		var jsonstr = unescapeUnicode(JSON.stringify(obj,null," "));

		//一時ファイルを作成
		var fileObj = new File(Folder.temp.fsName+"\\import.fsdj");
		//あったら消す。
		if (fileObj.exists==true) {
			fileObj.remove();
		}
		var b= false;
		try{
			if (fileObj.open("w","json","FsDD") == true){
				fileObj.encoding = "UTF-8";
				b = fileObj.write(jsonstr);
			}
		}catch(e){
			alert("write error!\n"+e.toString());
		}finally{
			fileObj.close();
		}
		if ( b ==true) fileObj.execute();

	}
	btnFsDD.onClick = callFsDDatJson;
	btnDialog.onClick = selectFolder;
	//-------------------------------------------------------------------------
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}

	//--------------------------------------------------------------------------------
})(this);
