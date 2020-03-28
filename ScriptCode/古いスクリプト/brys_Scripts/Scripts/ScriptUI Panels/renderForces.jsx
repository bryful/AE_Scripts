(function(me){
	//----------------------------------
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
	var prefFile = new File($.fileName.changeExt(".pref"));
	
	var stratupFolder = Folder.current;
	var renderCmdFile = new File(stratupFolder.fullName + "/renderCmd.exe");
	var renderCmdPath = "\"" + renderCmdFile.fsName + "\"";
	var renderSoldierFile = new File(stratupFolder.fullName + "/renderSoldier.exe");
	var renderWorldFile = new File(stratupFolder.fullName + "/renderWorld.dll");

	

	function wq(s){ return "\""+ s + "\"";}
	function isWindows() { return (system.osName.toLowerCase().indexOf("windows") >= 0);}
	function chkQR()
	{
		var rq = app.project.renderQueue;
		var rqOK = false;
		if ( rq.numItems>0){
			for (var i=1; i<=rq.numItems; i++){
				if ( rq.item(i).status == RQItemStatus.QUEUED) {
					if ( rq.item(i).numOutputModules>0){
						for (var j=1; j<=rq.item(i).numOutputModules; j++){
							if (rq.item(i).outputModule(j).file != null)
								if (rq.item(i).outputModule(j).file.parent.exists == true){
									rqOK = true;
									break;
								}
						}
					}
				}
				if (rqOK == true) break;
			}
		}
		return rqOK;
	}
	//-----------------------------------------------------
	function nowStr()
	{
		function z2(v)
		{
			if (v<=0) return "00";
			else if (v<10) return "0"+v;
			else return "" + v;
		}
		var d = new Date();
		var ret = "";
		ret += (d.getYear()+1900) +"";
		ret += z2(d.getMonth()+1) +"";
		ret += z2(d.getDate()) +"_";
		ret += z2(d.getHours()) +"";
		ret += z2(d.getMinutes()) +"";
		ret += z2(d.getSeconds());

		return ret;
	}
	//-----------------------------------------------------
	function chkRenderCmd()
	{
		if ( renderCmdFile.exists==false){
			alert("renderCmd.exeがありません");
			return false;
		}

		if ( renderSoldierFile.exists==false){
			alert("renderSoldier.exeがありません");
			return false;
		}
		if ( renderWorldFile.exists==false){
			alert("renderWorld.dllがありません");
			return false;
		}
		return true;
	}
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "renderForses", [ 889,  449,  889+ 134,  449+ 211]  ,{resizeable:true});
	//-------------------------------------------------------------------------
	var btnAdd = winObj.add("button", [   4,    3,    4+ 127,    3+  32], "追加してレンダリング" );
	btnAdd.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnAddOnly = winObj.add("button", [   4,   38,    4+ 127,   38+  23], "追加のみ" );
	btnAddOnly.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnStop = winObj.add("button", [   4,   74,    4+ 127,   74+  23], "停止要求" );
	btnStop.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnStart = winObj.add("button", [   4,   99,    4+ 127,   99+  23], "レンダリング再開" );
	btnStart.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnWinNormal = winObj.add("button", [   4,  133,    4+ 127,  133+  23], "ウィンドウを表示" );
	btnWinNormal.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnWinMini = winObj.add("button", [   4,  158,    4+ 127,  158+  23], "ウィンドウを最小化" );
	btnWinMini.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnQuit = winObj.add("button", [   4,  183,    4+ 127,  183+  23], "Soldierを終了" );
	btnQuit.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);


	btnStop.onClick = function(){ system.callSystem(renderCmdPath + " -stop");}
	btnStart.onClick = function(){system.callSystem(renderCmdPath + " -start");}
	btnWinNormal.onClick = function(){ system.callSystem(renderCmdPath + " -windowState normal");}
	btnWinMini.onClick = function(){system.callSystem(renderCmdPath + " -windowState Min");}
	btnQuit.onClick = function(){system.callSystem(renderCmdPath + " -quit");}


	//-------------------------------------------------------------------------
	function execChk()
	{
		if ( chkRenderCmd()==false) return false;

		if ( isWindows() ==false){
			alert("すみません。Windows専用です。");
			return false;
		}
		if ( app.project.file == null){
			alert("プロジェクトを保存してください。");
			return false;
		}

		if ( chkQR()==false){
			alert("有効なレンダーキューがありません");
			return false;
		}
		return true;
	}
	//-------------------------------------------------------------------------
	function addAndStart()
	{
		if ( execChk()==false) return;
		
		var af = app.project.file;
		var tmpAep = new File(Folder.temp.fullName + "/" + "ae_"+nowStr()+".aep");
		
		app.project.save(tmpAep);
		app.project.save(af);
		
		var s = system.callSystem(renderCmdPath + " -project \"" + tmpAep.fsName +"\"");
		if ( s != ""){alert(s);}

	}
	btnAdd.onClick = addAndStart;
	//-------------------------------------------------------------------------
	function addOnly()
	{
		if ( execChk()==false) return;
		
		var af = app.project.file;
		var tmpAep = new File(Folder.temp.fullName + "/" + "ae_"+nowStr()+".aep");
		
		app.project.save(tmpAep);
		app.project.save(af);
		
		var s = system.callSystem(renderCmdPath + " -addOnly -project \"" + tmpAep.fsName +"\"");
		if ( s != ""){alert(s);}
	}
	btnAddOnly.onClick = addOnly;

	//-------------------------------------------------------------------------
	function resize()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		if ( w>200) w = 200;
		else if ( w<80) w = 80;

		var b = btnAdd.bounds;
		b[0] = 8;
		b[2] = w - 8;
		btnAdd.bounds = b;

		var b = btnAddOnly.bounds;
		b[0] = 8;
		b[2] = w - 8;
		btnAddOnly.bounds = b;

		var b = btnStop.bounds;
		b[0] = 8;
		b[2] = w - 8;
		btnStop.bounds = b;

		var b = btnStart.bounds;
		b[0] = 8;
		b[2] = w - 8;
		btnStart.bounds = b;

		var b = btnWinNormal.bounds;
		b[0] = 8;
		b[2] = w - 8;
		btnWinNormal.bounds = b;

		var b = btnWinMini.bounds;
		b[0] = 8;
		b[2] = w - 8;
		btnWinMini.bounds = b;

		var b = btnQuit.bounds;
		b[0] = 8;
		b[2] = w - 8;
		btnQuit.bounds = b;

	}
	resize();
	winObj.addEventListener("resize",resize);
	winObj.onResize = resize;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);