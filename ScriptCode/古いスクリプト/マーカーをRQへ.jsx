(function(me){	//----------------------------------
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
	
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	//Windows8だとプログラムフォルダに保存失敗する
	var prefFile = new File(Folder.userData.fullName + "/" +scriptName +".pref");

	//環境設定関係
	var pref = {};
	pref.startFrame	= 1;
	pref.interFrame	= 12;
	pref.rq 		= "";
	pref.om 		= "";
	pref.exportPath = "";
	pref.filename	= "書き出し先";

	
	var rqList = [];
	var omList = [];
	//-------------------------------------------------------------------------
	var prefSave = function ()
	{
		var str = pref.toSource();
		var b = prefFile.open("w");
		if (b){
			try{
				prefFile.write(str);
			}catch(e){
				alert(e.toString());
			}finally{
				prefFile.close();
			}
		}
	}
	//-------------------------------------------------------------------------
	var prefLoad = function()
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
		if ( o.startFrame != undefined) pref.startFrame = o.startFrame;
		if ( o.interFrame != undefined) pref.interFrame = o.interFrame;
		if ( o.rq != undefined) pref.rq = o.rq;
		if ( o.om != undefined) pref.om = o.om;
		if ( o.exportPath != undefined) pref.exportPath = o.exportPath;
		if ( o.filename != undefined) pref.filename = o.filename;
	}
	prefLoad();
	//-------------------------------------------------------------------------
	//テンプレートを獲得
	var getTemplate = function ()
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
		rqList = [];
		omList = [];
		
		for ( var i=0; i<_ps.length; i++)
			if ( _ps[i].indexOf("_HIDDEN")<0) rqList.push(_ps[i]);
		for ( var i=0; i<_om.length; i++)
			if ( _om[i].indexOf("_HIDDEN")<0) omList.push(_om[i]);
	}
	getTemplate();
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "Marker to RQ", [ 0,  0,  240,  390]  ,{resizeable:true, maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	
	var pnlAddM = winObj.add("panel", [  10,    5,   10+ 220,    5+ 100], "マーカーを作成" );
	var eddAddMStart = pnlAddM.add("edittext", [   5,   10,    5+  40,   10+  20], pref.startFrame+"");
	var st1 = pnlAddM.add("statictext", [  50,   10,   50+ 60,   10+  20], "コマ目から");
	var eddAddMInter = pnlAddM.add("edittext", [ 115,   10,  115+  40,   10+  20], pref.interFrame+"");
	var st2 = pnlAddM.add("statictext", [ 160,   10,  160+  60,   10+  20], "コマ間隔で");
	var btnAddM = pnlAddM.add("button", [   5,   40,    5+ 210,   40+  30], "マーカーを作成" );

	var pnlToRQ = winObj.add("panel", [  10,  110,   10+ 220,  110 + 275], "レンダーキューへ登録" );
	var st3 = pnlToRQ.add("statictext", [   5,   10,    5+ 210,   10+  20], "レンダリング設定");
	var dlRQ = pnlToRQ.add("dropdownlist", [   5,   40,    5+ 210,   40+  20], rqList);
	var st4 = pnlToRQ.add("statictext", [   5,   70,    5+ 210,   70+  20], "出力モジュール");
	var dlOM = pnlToRQ.add("dropdownlist", [   5,   90,    5+ 210,   90+  20], omList);
	var btnPath = pnlToRQ.add("button", [  10,  120,   10+  80,  120+  20], "書き出し先" );
	var stPath = pnlToRQ.add("statictext", [   5,  150,    5+ 210,  150+  20], pref.exportPath);
	var st5 = pnlToRQ.add("statictext", [   5,  175,    5+ 210,  175+  20], "書き出しファイル名");
	var edFilename = pnlToRQ.add("edittext", [   5,  200,    5+ 210,  200+  20], pref.filename);
	var btnToRQ = pnlToRQ.add("button", [   5,  225,    5+ 210,  225+  30], "キューへ登録" );

	//-------------------------------------------------------------------------
	var dlSet = function()
	{
		if (rqList.length>0) {
			for (var i=0; i<rqList.length; i++) {
				if (rqList[i] == pref.rq) {
					dlRQ.items[i].selected = true;
				}
			}
		}
		if (omList.length>0) {
			for (var i=0; i<omList.length; i++) {
				if (omList[i] == pref.om) {
					dlOM.items[i].selected = true;
				}
			}
		}
	}
	dlSet();
	//-------------------------------------------------------------------------
	var pushPref = function()
	{
		if (dlRQ.selection != null) {
			pref.rq = dlRQ.selection.text;
		}
		if (dlOM.selection != null) {
			pref.om = dlOM.selection.text;
		}
		pref.startFrame = Math.round(eddAddMStart.text *1);
		pref.interFrame = Math.round(eddAddMInter.text *1);
		pref.exportPath = stPath.text;
		pref.filename	= edFilename.text;
	}
	//-------------------------------------------------------------------------
	var selectFolder = function()
	{
		var f = new Folder(pref.exportPath);
		if ((f == null)||(!f.exists)){
			f = Folder.myDocuments;
		}
		var r = f.selectDlg();
		if (f!=null) {
			pref.exportPath = r.fullName;
			stPath.text = pref.exportPath;
		}
	}
	btnPath.onClick = selectFolder;
	//-------------------------------------------------------------------------
	dlOM.onChange = function()
	{
		pref.om = this.selection.text;
	}	dlRQ.onChange = function()
	{
		pref.rq = this.selection.text;
	}	winObj.onClose = function()
	{
		pushPref();
		prefSave();
	}
	//-------------------------------------------------------------------------
	var addMarker = function()	{
		pushPref();
		//長ったらしいエラーチェック		var ac = app.project.activeItem;		if ( !(ac instanceof CompItem)) {			alert("コンポをアクティブにして！");			return;		}		var layer = null;		if (ac.selectedLayers.length>0) {			layer = ac.selectedLayers[0];		}		if (layer==null) {			alert("レイヤを選択して！");			return;		}		var frm = Math.round(ac.duration * ac.frameRate);		var st =  pref.startFrame;		if ((st == undefined)||(st == null)||(st<=0)||(st>=frm)) {			alert("開始フレームが変");			return;		}		var lp =  pref.interFrame;		if ((lp == undefined)||(lp == null)||(lp<=0)||(lp>=frm)) {			alert("フレーム間隔が変");			return;		}		var cnt = Math.round((frm-st)/lp) +1;		if (cnt<=1) {			alert("なんだか変");			return;		}
		//やっと本番		var marker = layer.marker;		app.beginUndoGroup("マーカー追加");				if (marker.numKeys>0){			for ( var i=marker.numKeys; i>=1; i--) {				marker.removeKey(i);			}		}				for ( var i=0; i<cnt; i++){			var k = st + lp * i;			var tm = (k-1)/ac.frameRate;			if (tm < ac.duration) {				var m = new MarkerValue( k +"コマ目");				marker.setValueAtTime(tm,m);			}		}		app.endUndoGroup();	}	btnAddM.onClick = addMarker;		//-------------------------------------------------------------------------	var frameZero = function(v)	{		var ret = "";		if(v<0) v =0;		if (v<10) {			ret = "0" +v;		}else{			ret = "" +v;		}		return ret;	}
	//-------------------------------------------------------------------------	var toRQ = function()	{		pushPref();
		var ac = app.project.activeItem;		if ( !(ac instanceof CompItem)) {			alert("コンポをアクティブにして！");			return;		}		var layer = null;		if (ac.selectedLayers.length==1) {			layer = ac.selectedLayers[0];		}		if (layer==null) {			alert("レイヤを1個だけ選択して！");			return;		}		var marker = layer.marker;		if (marker.numKeys<=0) {			alert("マーカーがない！");			return;		}
		if (pref.exportPath =="") {
			alert("書き出し先が登録されていない！");			return;		}
		if (pref.filename =="") {
			alert("書き出し名が登録されていない！");			return;		}
		if (pref.rq =="") {
			alert("レンダーキュー設定が指定されていない");			return;		}
		if (pref.om =="") {
			alert("出力モジュールが指定されていない");			return;		}
				for (var i=1; i<=marker.numKeys; i++){			var rq = app.project.renderQueue.items.add(ac);
			rq.applyTemplate(pref.rq);			rq.timeSpanStart = marker.keyTime(i);			rq.timeSpanDuration = 1/ac.frameRate;			var om = rq.outputModule(1);
			om.applyTemplate(pref.om);
			om.file = new File (pref.exportPath +"/" + pref.filename +"_" +frameZero(i) + "_[#####].[fileExtension]");		}	}	btnToRQ.onClick = toRQ;	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);