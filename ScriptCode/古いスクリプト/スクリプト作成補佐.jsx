(function(me){
	//----------------------------------
	//prototype登録
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
	var prefFile = new File($.fileName.changeExt(".pref"));

	var targetFolder = new Folder ( $.fileName.getParent() + "/(" +$.fileName.getName().changeExt("")+ ")");
	//----------------------------------
	var preset_items = [  ];

	//-------------------------------------------------------------------------
	function listupSub(f)
	{
		var files = f.getFiles();
		if (files.length<=0) return;
		var fl =[];
		var dl =[];
		for ( var i=0; i<files.length; i++)
		{
			if( files[i] instanceof Folder)
			{
				dl.push(files[i]);
			}else{
				var n = files[i].name.getExt().toLowerCase();
				if ( n == ".ffx") {
					files[i].isFFX = true;
					files[i].isJSX = false;
					fl.push(files[i]);
					
				}else if ( n == ".jsx") {
					files[i].isFFX = false;
					files[i].isJSX = true;
					fl.push(files[i]);
				}
			}
		}
		if ( dl.length>0) {
			for ( var i=0; i<dl.length; i++) listupSub(dl[i]);
		}
		if ( fl.length>0){
			for ( var i=0; i<fl.length; i++) preset_items.push(fl[i]);
		}
	}
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, [ 843,  422,  843+ 226,  422+ 266]  ,{resizeable:true});
	//-------------------------------------------------------------------------
	var btnHelp = winObj.add("button", [   1,    2,    1+  25,    2+  23], "?" );
	btnHelp.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.BOLD, 13);
	var btnReload = winObj.add("button", [  32,    2,   32+  60,    2+  23], "Reload" );
	btnReload.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var btnExec = winObj.add("button", [  98,    2,   98+  60,    2+  23], "Exec" );
	btnExec.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var presetList = winObj.add("listbox", [   1,   28,    1+ 224,   28+ 238], preset_items );
	
	var g = presetList.graphics;
	g.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 13);
	btnExec.enabled = false;
	//-------------------------------------------------------------------------
	File.prototype.getCap = Folder.prototype.getCap = function()
	{
		var n = File.decode(this.name.changeExt(""));
		var e = File.decode(this.name.getExt());
		var idx =-1;
		idx = n.indexOf("_");
		if ( idx<0) idx = n.indexOf("-");
		if ( idx<0) idx = n.indexOf(".");
		if ( idx>=0){
			var n2 = n.substr(0,idx);
			if ( isNaN(n2)==false){
				n = n.substr(idx+1);
			}
		}
		return n + e;
	}
	//-------------------------------------------------------------------------
	function captionStr(f)
	{
		var pd1 = File.decode(targetFolder.fullName).split("/");
		var pd2 = File.decode(f.fullName).split("/");
		
		str = f.getCap();
		str = f.getCap();
		var cnt = pd2.length - pd1.length -1;
		if (cnt>0){
			var p = f;
			for ( var i = 0; i<cnt; i++)
			{
				p = p.parent;
				str = p.getCap() + "/" + str;
			}
		}
		return str;
	}
	//-------------------------------------------------------------------------
	function listup()
	{
		preset_items = [];
		if ( (targetFolder != null)&&(targetFolder.exists == true)){
			listupSub(targetFolder);
		}
		presetList.removeAll();
		if ( preset_items.length>0){
			for ( var i=0; i<preset_items.length;i++)
				presetList.add("item",captionStr(preset_items[i]));
		}
		btnExec.enabled = false;
	}
	listup();
	btnReload.onClick = listup;
	//-------------------------------------------------------------------------
	presetList.onChange = function()
	{
		btnExec.enabled = (presetList.selection.index>=0);
	}
	//-------------------------------------------------------------------------
	function exec()
	{
		var idx =-1;
		if ( presetList.selection !=null)
			idx = presetList.selection.index;
		if ( idx>=0){
			if (preset_items[idx].exists == false){
				alert(preset_items[idx].fullName +"がない");
				return;
			}
			if (preset_items[idx].isJSX==true)
			{
				if (preset_items[idx].open("r")){
					try{
						var s = preset_items[idx].read();
						preset_items[idx].close();
						eval(s);
					}catch(e){
						alert("なんかスクリプト実行でエラー！\n\n"+e.toString());
					}
				}
			}else{
				var sl = [];
				var ac = app.project.activeItem;
				if ( ac instanceof CompItem){
					if (ac.selectedLayers.length>0){
						sl = ac.selectedLayers;
					}
				}
				if ( sl.length>0){
					app.beginUndoGroup(File.decode(preset_items[idx].name));
					for ( var i=0; i<ac.selectedLayers.length; i++)
					{
						ac.selectedLayers[i].applyPreset(preset_items[idx]);
					}
					app.endUndoGroup();
				}else{
					alert("レイヤを選択して下さい。");
				}
			}
		}
	}
	btnExec.onClick = exec;
	presetList.onDoubleClick = exec;
	//-------------------------------------------------------------------------
	function help()
	{
		var str =
		"-----------------------------------------------------------\n"+
		
		"用途：jsxやらffxを適当にリストアップして簡単に適応できるメニュー\n"+
		"\n"+
		"このスクリプトの名称を半角括弧で囲んだ名前のフォルダを作成して、\n"+
		"その中へ適当にjsx/ffxファイルを置くと起動時に勝手にリストアップする。\n"+
		"\n"+
		"サブフォルダも再帰して読み込む。\n"+
		"スクリプト名を変えてコピーすれば、複数のメニューを同時に表示可能。\n"+
		"\n"+
		"reloadボタンで再リストアップ\n"+
		"execボタンか項目をダブルクリックで実行\n"+
		"\n"+
		"jsx/ffxファイル名の先頭が\"01_\"の様に数字ならばそれは表示しない\n"+
		"数字を変えれば順番をソートできる\n"+
		"-----------------------------------------------------------\n";
		alert(str,"[ "+ scriptName + " ] の使い方");
	}
	btnHelp.onClick = help;
	//-------------------------------------------------------------------------
	function resize()
	{
		var b = winObj.bounds;
		var w = b[2] - b[0];
		var h = b[3] - b[1];
		var b = presetList.bounds;
		b[0] = 0;
		b[2] = w;
		b[3] = h;
		presetList.bounds = b;
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
