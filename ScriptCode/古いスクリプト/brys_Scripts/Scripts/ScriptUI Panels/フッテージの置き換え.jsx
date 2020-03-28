
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

	FootageItem.prototype.nameTrue = function(){ var b=this.name;this.name=""; var ret=this.name;this.name=b;return ret;}
	
	//----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
	var prefFile = new File($.fileName.changeExt(".pref"));
	var targetFiles = [];

	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "フッテージの置き換え", [ 877,  463,  877+ 158,  463+  94] );
	//-------------------------------------------------------------------------
	var btnReplace = winObj.add("button", [  12,   12,   12+ 127,   12+  23], "フッテージの置き換え" );
	btnReplace.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbStill = winObj.add("radiobutton", [  13,   42,   13+ 123,   42+  16], "静止画/ムービー");
	rbStill.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var rbRenban = winObj.add("radiobutton", [  12,   64,   12+ 123,   64+  16], "連番ファイル");
	rbRenban.value = true;
	rbRenban.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);


	//-------------------------------------------------------------------------
	function isRenban(ftg)
	{
		//静止画は違う
		if (ftg.mainSource.isStill==true) return false;
		//拡張子で判別
		var e = ftg.name.getExt().toLowerCase();
		if ( (e==".mov")||(e==".qt")||(e==".avi")) {
			return false;
		}
		//一応念のため
		var nf = ftg.mainSource.nativeFrameRate;
		if ( (nf == ftg.mainSource.conformFrameRate)&&(nf == ftg.mainSource.displayFrameRate)){
			return true;
		}else{
			return false;
		}
	}
	//-------------------------------------------------------------------------
	function rep()
	{
		var ac = app.project.activeItem;
		if ( (ac == null) || ((ac instanceof FootageItem)==false) || (ac.mainSource.color != undefined)) {
			alert("フッテージを1個だけ選んでください。");
			return;
		}
		var io = new ImportOptions(ac.file);
		var b = true;
		if (ac.nameTrue().indexOf("/")>=0){
			if ( io.canImportAs(ImportAsType.COMP)==true) b = false;
			else if ( io.canImportAs(ImportAsType.COMP_CROPPED_LAYERS)==true) b = false;
		}
		if (b==false ){
			alert("レイヤ付きフッテージの差し替えには注意してください！");
		}
		
		var isRen = rbRenban.value;
		
		var newFtg = File.openDialog("[" + ac.name + "]を置き換え");
		if (newFtg != null){
			
			var io = new ImportOptions(newFtg);
			var b = true;
			if ( io.canImportAs(ImportAsType.COMP)==true) b = false;
			else if ( io.canImportAs(ImportAsType.COMP_CROPPED_LAYERS)==true) b = false;
			
			if ( b == false){
				alert("すみません。レイヤー付きファイルはこのスクリプトでは差し替えできません。");
				return;
			}
			
			var e = newFtg.parent.fullName.getExt().toLowerCase();
			
			if ( isRen == true){
				ac.replaceWithSequence(newFtg,false);
			}else{
				ac.replace(newFtg);
			}
			ac.name = "";
		}else{
			alert("cancel");
		}
	}
	btnReplace.onClick = rep;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);