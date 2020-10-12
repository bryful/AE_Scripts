(function (){

    //-------------------------------------------------------------------------
	//Stringの拡張
	//-------------------------------------------------------------------------
	//文字の置換。（全ての一致した部分を置換）
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}
	//文字列の前後の空白・改行コードを取り除く
	String.prototype.trim = function(){
		if (this=="" ) return ""
		else return this.replace(/[\r\n]+$|^\s+|\s+$/g, "");
	}
 
	//-------------------------------------------------------------------------
	//ファイル名の処理
	//-------------------------------------------------------------------------
	//親フォルダのパスを取り出す。
	String.prototype.getParent = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(0,i);
		return r;
	}
	//指定した書拡張子に変更（dotを必ず入れること）空文字を入れれば拡張子の消去。
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
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
	//拡張子なしのファイル名を取り出す。
	String.prototype.getNameWithoutExt = function(){
		return this.getName().changeExt('');
	}
    //おまけ
	File.prototype.getExt = function() {return this.name.getExt();}
	File.prototype.getNameWithoutExt = function() {return this.name.changeExt('');}


})();