(function(me){
	//----------------------------------
	// メニューに表示されるタイトル
	var scriptName = "addShapeMenu";
	//----------------------------------
	//読み込むフォルダ
	var cmdItemsPathBase = "./(addShapeMenu)";
	var targetFolder = new Folder(cmdItemsPathBase);

	var directionFile = new File(targetFolder.fullName +"/_direction.png");
	var twoRowFile = new File(targetFolder.fullName +"/_twoRow.png");


	// アイコンサイズ
	var iconWidth = 25; 
	var iconHeight = 25; 

	var direction = true;
	var twoRow = false;

	//----------------------------------
	//prototype登録
	//文字列の前後の空白を削除
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


   Property.prototype.rootLayer =
	PropertyBase.prototype.rootLayer =
	PropertyGroup.prototype.rootLayer = function(){return this.propertyGroup(this.propertyDepth);}

	Property.prototype.findContent =
	PropertyBase.prototype.findContent =
	PropertyGroup.prototype.findContent = function(){
		var ret = null;
		var pp =this;
		do{
			if ((pp.matchName=="ADBE Root Vectors Group")||(pp.matchName=="ADBE Vector Group")){
				ret = pp;
				break;
			}
			pp = pp.parentProperty;
		}while(pp!=null);
			
		return ret;	
	}
	Property.prototype.findGroup =
	PropertyBase.prototype.findGroup =
	PropertyGroup.prototype.findGroup = function(){
		var ret = null;
		var pp =this;
		do{
			if (pp instanceof PropertyGroup ){
				ret = pp;
				break;
			}
			pp = pp.parentProperty;
		}while(pp!=null);
		return ret;	
	}
	 var getActiveComp = function()
	{
		var ret = null;
        var ac = app.project.activeItem;
        if ( (ac instanceof CompItem)==false){
            alert("not acitved Comp");
            return ret;
        }
		return ac;
	}
    var getActiveLayer = function()
	{
		var ret = null;
        var ac = app.project.activeItem;
        if ( (ac instanceof CompItem)==false){
            alert("not acitved Comp");
            return;
        }
		var lyrs = ac.selectedLayers;
		if(lyrs.length<1){
			alert("レイヤを1個だけ選んでください");
			return ret;
		}
		ret = lyrs[0];
		return ret;
	}
    var getShapeLayerStatus = function(lyr)
	{
		var ret = {};
		ret.comp= null;
		ret.layer= null;
		ret.content = null;
		ret.propertyGroup = null;
		ret.index= 0;
    
    	ret.layer= lyr;

		var props = lyr.selectedProperties;

		if((props==null)||(props.length<=0)){
			ret.content = lyr.property("ADBE Root Vectors Group");
			return ret;
        }else{
			var content = null;
			var pg = null;
			var pp = null;
			//選択されたプロパティの先頭を探す
			for ( var i=0; i<props.length; i++){
				if ( props[i] instanceof Property){
					pp = props[i];
				}
			}
			//プロパティが見つかったら、それが所属しているグループを返す
			if(pp!=null) {
				pg = pp.finfGroup();
				if(pg.matchName == "ADBE Vector Group"){
					content = pg.parentProperty.findContent();
				}else{
					content = pg.findContent();
				}
			}else{
				//
				for ( var i=props.length-1; i>=0; i--){
					if( props[i] instanceof PropertyGroup)
					{
						pg = props[i];
						break;
					}
				}
				if(pg.matchName=="ADBE Vector Group")
				{
					content = pg;
					pg = null;
				} else if(pg.matchName=="ADBE Root Vectors Group")
				{
					content = pg;
					pg = null;
				}else{
					content = pg.parentProperty.findContent();
				}
			}
			if(content==null)
			{
				content = lyr.property("ADBE Root Vectors Group");
				pg = null;
			}
		}
		ret.content = content;
		ret.propertyGroup = pg;
		if(pg!=null)
		{
			ret.index = pg.propertyIndex;
		}
		
		return ret;
	}
    var addShapes = function(lyr,mn)
	{
		var ret = null;
		var stat = getShapeLayerStatus(lyr);
		if(stat.content==null) {
			alert("select error");
			return null;
		}
		var tt =  stat.propertyGroup;
		var idx = 0;
		if(tt!=null) {
			idx = stat.propertyGroup.propertyIndex+1;
		}
		try{
			var pg = stat.content;
			if(pg.matchName =="ADBE Vector Group"){
				pg = pg.property(2);
			}	 
			if (pg.canAddProperty(mn) == true)
			{
				app.beginUndoGroup("add " + mn);
				var pp  = pg.addProperty(mn);
				var ppIdx = pp.propertyIndex;
				if((idx>0)&&(idx<ppIdx)){
					pp.moveTo(idx);
					pp = pg.property(idx);
				}
				pp.selected = true; 
				ret = pp;
				app.endUndoGroup();
			}else{
				alert("er a" + stat.content.name);
			}
		}catch(e){
			alert(e.toString());
		}
		return ret;
	}

	var prefPath = new Folder ( File.decode($.fileName.getParent() + "/" +$.fileName.getName().changeExt(".pref")));

	var prefSave = function()
	{
		var pref = {};
		pref.direction = direction;
		pref.twoRow = twoRow;
		var js = pref.toSource();
		var f = new File(prefPath);
		
		try{
			if (f.open("w")){
				f.write(js);
			}
		}finally{
			f.close();
		}
    }
    // ********************************************************************************
    var prefLoad = function ()
    {
        var ret = false;
        var js = "";
        var f = new File(prefPath);
        if (f.exists == true) {
            try {
                if (f.open("r")) {
                    js = f.read();
                }
            } finally {
                f.close();
            }
            var pref = eval(js);
            if ("direction" in pref) {
                var a = pref.direction;
                if (direction != a) {
                    direction = a;
                    ret = true;
                }
            }
            if ("twoRow" in pref) {
                var a = pref.twoRow;
                if (twoRow != a) {
                    twoRow = a;
                    ret = true;
                }
			}
        }
        return ret;
    }
	if (prefLoad()) {
    }
	var cmdItems = [];
	
	//-------------------------------------------------------------------------
	//cmdItems配列に読み込むjsx/ffxの情報を構築する
	var setupItems = function()
	{
		if( targetFolder.exists===false) return;
		
		var files = targetFolder.getFiles("*");
		var cnt = files.length;
		for (var i=0; i<cnt; i++)
		{
			var obj = {};
			obj.script = null;　//jsx/ffxのFile
			obj.icon = null;	//iconbutton用の画像File
			obj.isFX = false;
			var e = files[i].fullName.getExt().toLowerCase();
			if( e == ".jsx"){
				obj.script  = files[i];
				obj.icon  = new File(files[i].fullName.changeExt(".png"));
				obj.isFX = false;
			}else if ( e == ".ffx"){
				obj.script  = files[i];
				obj.icon  = new File(files[i].fullName.changeExt(".png"));
				obj.isFX = true;
			}else{
				continue;
			}

			if((obj.script.exists==true)&&(obj.icon.exists==true))
			{
				cmdItems.push(obj);
			}
		}
	}
	setupItems();
	//-------------------------------------------------------------------------
	//Windowの作成
	var b = [];
	if(direction==true){
		b = [ 0,  0, iconWidth*(cmdItems.length+2), iconHeight];
	}else{
		b = [ 0,  0, iconWidth, iconHeight*(cmdItems.length+2)];
	}
	var winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, b  ,{resizeable:true});
	//-------------------------------------------------------------------------
	//iconButtonが押された時の処理
	var exec = function()
	{
		// jsx.ffxのファイルがなければエラー
		if(this.script==null){
			alert("error");
			return;
		}
		// カレントをスクリプトのある場所へ移動
		var bak = Folder.current;
		Folder.current = this.work;

		if (this.isFX==true)
		{
			var sl = [];
			var ac = app.project.activeItem;
			if ( ac instanceof CompItem){
				if (ac.selectedLayers.length>0){
					sl = ac.selectedLayers;
				}
			}
			if ( sl.length>0){
				app.beginUndoGroup(File.decode(this.script.name));
				for ( var i=0; i<ac.selectedLayers.length; i++)
				{
					ac.selectedLayers[i].applyPreset(this.script);
				}
				app.endUndoGroup();
			}else{
				alert("レイヤを選択して下さい。");
			}
		}else{
			if (this.script.open("r")){
				try{
					var s = this.script.read();
					eval(s);
				}catch(e){
					alert("なんかスクリプト実行でエラー！\n\n"+e.toString());
				}finally{
					this.script.close();
				}
			}

		}
		//カレントを元に戻す
		Folder.current = bak;

	}	
	//-------------------------------------------------------------------------
	var layoutChange = function()
	{
		direction = ! direction;
		layout();
	}
	//-------------------------------------------------------------------------
	var twoRowChange = function()
	{
		twoRow = ! twoRow;
		layout();
	}
	//-------------------------------------------------------------------------
	var ctrlTbl = [];
	//ボタンを配置
	var setupButtons = function()
	{
		if (cmdItems.length<=0) return;
		var x = 0;
		var y = 0;

		var btn0 = winObj.add("iconbutton",[x,y,x+iconWidth,y+ iconHeight] ,directionFile);
		if(direction==true){
			x += iconWidth;
		}else{
			y += iconHeight;
		}
		btn0.onClick = layoutChange;

		ctrlTbl.push(btn0);

		var btn1 = winObj.add("iconbutton",[x,y,x+iconWidth,y+ iconHeight] ,twoRowFile);
		if(direction==true){
			x += iconWidth;
		}else{
			y += iconHeight;
		}
		btn1.onClick = twoRowChange;
		ctrlTbl.push(btn1);



		for (var i=0; i<cmdItems.length; i++)
		{
			var b = [];
			var btn = winObj.add("iconbutton",[x,y,x+iconWidth,y+ iconHeight] ,cmdItems[i].icon);
			btn.script = cmdItems[i].script;
			btn.work = cmdItems[i].script.parent;
			btn.isFX = cmdItems[i].isFX;
			btn.onClick = exec;

			ctrlTbl.push(btn);
			if(direction==true){
				x += iconWidth;
			}else{
				y += iconHeight;
			}
		}
	}
	setupButtons();
	//-------------------------------------------------------------------------
	var layout = function()
	{
		var x = 0;
		var y = 0;
		var cnt = ctrlTbl.length;
		var cnt2 = Math.floor(cnt/2);
		for(var i=0; i<cnt;i++)
		{
			ctrlTbl[i].bounds = [x,y,x+iconWidth,y+iconHeight];
			if(direction==true){
				x += iconWidth;
				if(twoRow){
					if(i==cnt2){
						x = 0;
						y += iconHeight;
					}
				}
			}else{
				y += iconHeight
				if(twoRow){
					if(i==cnt2){
						y = 0;
						x += iconWidth;
					}
				}
			};
		}

	}
	layout();
	// ********************************************************************************
    winObj.onClose = function () {
        prefSave();
    }
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);