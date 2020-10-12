(function (){

    File.prototype.objectSave = function(obj)
    {
        var ret = false;
        if( (obj instanceof Object)==false) return ret;
        ret = this.saveText(s);
        return ret;
    }
    File.prototype.objectLoad = function()
    {
        var ret = {};
        if (this.exists==false) return ret;
        var s = this.loadText();
        if(s=="") return ret;
        ret = eval(s); 
        return ret;
    }

    File.prototype.loadText = function() {
		var s = "";
		if ((this.exists)&&(this.open("r"))){
			try{
				s = this.read();
			}catch(e){
			}finally{
				this.close();
            }
		}
		return s;
	}
	//文字列を書き込む
	File.prototype.saveText = function(s) {
		var ret =false;
		if (this.open("w")){
			try{
				this.write(s);
				ret = true;
			}catch(e){
				ret = false;
            }finally{
				this.close();
			}
		}
		return ret;
	}
	//文字列を書き込む
	String.prototype.save = function(f){
		var ret =false;
		var fl = null;
		if ( f instanceof File) fl = f;
		if ( typeof(f)=="string") fl = new File(f);
		
		if (fl.open("w")){
			try{
				fl.write(this);
				ret = true;
			}catch(e){
                ret = false;
            }finally{
				fl.close();
			}
		}
		return ret;
	}
    //カレントティレクトリのフルパス(デコード済み)
	Application.prototype.getCurrentPath = function(){
		return File.decode(Folder.current.fullName);
	}
	//カレントティレクトリのフルパス(デコード前)
	Application.prototype.getCurrentPathD = function(){
		return Folder.current.fullName;
		}
	//現在実行中のスクリプトファイル自身の File objectを獲得
	Application.prototype.getScriptFile = function(){
		return new File($.fileName);
	}
	//現在実行中のスクリプトファイル名を獲得(デコード済み)
	Application.prototype.getScriptName = function(){
		return File.decode($.fileName.getName());
	}
	//現在実行中のスクリプトファイル名を獲得(デコード前)
	Application.prototype.getScriptNameD = function(){
		return $.fileName.getName();
	}
	//現在実行中のスクリプトファイル名（拡張子なし）を獲得
	Application.prototype.getScriptTitle = function(){
		return File.decode($.fileName.getNameWithoutExt());
	}
	//現在実行中のスクリプトファイルの親フォルダのパスを獲得(デコード済み)
	Application.prototype.getScriptPath = function(){
		return File.decode($.fileName.getParent());
	}
	//現在実行中のスクリプトファイルの親フォルダのパスを獲得(デコード前)
	Application.prototype.getScriptPathD = function(){
		return $.fileName.getParent();
	}
})();
