(function(me){
	//----------------------------------
	var targetList = [];	targetList.push("HeiseiKaku");	targetList.push("HGSeikaishotai");		//----------------------------------
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
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "フォントエラーに対処", [  0,   0,   220,   150] );
	//-------------------------------------------------------------------------
	
	//----------------------------------
	var pnlFont = winObj.add("panel", [  10,   10,   10+ 200,   10+ 130], "フォントエラーに対処" );
	var st1 = pnlFont.add("statictext", [ 10,   10,   10+ 180,   10+  13], "ターゲット");
	var edTargetFont = pnlFont.add("edittext", [   10,   23,    10+ 180,   23+  20], "");
	var st2 = pnlFont.add("statictext", [   10,   50,    10+ 180,   50+  13], "変更フォント");
	var edNewFont = pnlFont.add("edittext", [   10,   65,    10+ 180,   65+  21], "MS-Gothic");
	var btnExec = pnlFont.add("button", [  100,  90,   100+  80,  90+  22], "実行" );
	//-------------------------------------------------------------------------
	var fromTargetListToEdit = function()	{		var ret = "";		if (targetList.length>0){			for ( var i=0; i<targetList.length;i++){				if ( ret !== "") ret +="; ";				ret += targetList[i];			}		}		edTargetFont.text = ret;	}	fromTargetListToEdit();
	//-------------------------------------------------------------------------
	var fromEditToTargetList = function()	{		targetList = [];		var s = edTargetFont.text.trim();		if (s !== ""){			var sa = s.split(";");			if (sa.length>0){				for (var i=0; i<sa.length;i++){					var ss = sa[i].trim();					if (ss !==""){						targetList.push(ss);					}				}			}		}	}	//-------------------------------------------------------------------------	var findTexLayer = function()	{		var ret = [];		if (app.project.numItems>0){			for (var i = 1; i <= app.project.numItems; i++){				var targetItem = app.project.item(i);				if ( targetItem instanceof CompItem){					if (targetItem.numLayers>0){						for (var j = 1; j <= targetItem.numLayers; j++){							var targetLayer = targetItem.layer(j);							if (targetLayer.matchName === "ADBE Text Layer"){								ret.push(targetLayer);							}						}					}				}			}		}		return ret;	}
	//-------------------------------------------------------------------------	var changeFont = function()	{		fromEditToTargetList();		var ary = findTexLayer()		if ( targetList.length<=0){			alert("targetList error!");			return false;		}		if ( ary.length<=0){			alert("テキストレイヤはありません！");			return false;		}		eFont = edNewFont.text;		if (eFont === "" ) eFont ="MS-Gothic";		var cnt = 0;		for (var i=0; i<ary.length;i++){
			var td = ary[i].property("ADBE Text Properties").property("ADBE Text Document");
			var tdv = td.value
			var n = tdv.font;			for ( k=0; k<targetList.length;k++){				var nt = targetList[k];				if ( n.indexOf(nt)>=0){					tdv.font = eFont;
					td.setValue(tdv);					cnt++;
				}
			}
		}
		app.endUndoGroup();		if (cnt === 0){			alert("変更するフォントはありません");		}else if (cnt>0){			alert( cnt +"個のテキストレイヤを変更しました");		}		return true;
	}	btnExec.onClick = changeFont;	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
})(this);