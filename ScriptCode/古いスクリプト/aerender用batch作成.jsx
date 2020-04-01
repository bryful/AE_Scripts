
//--
(function (me)
{
	String.prototype.replaceAll=function(s,d){ return this.split(s).join(d);}

	//指定した書拡張子に変更（dotを必ず入れること）空文字を入れれば拡張子の消去。
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
	//拡張子のみを取り出す。
	String.prototype.getExt = function(){
		var r="";var i=this.lastIndexOf(".");if (i>=0) r=this.substring(i);
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
	File.prototype.getExt = function() {return this.name.getExt();}
	//拡張子なしのファイル名を取り出す。
	String.prototype.getNameWithoutExt = function(){
		return this.getName().changeExt('');
	}
	File.prototype.getNameWithoutExt = function() {
		return this.name.changeExt('');
	}
	//-----------------
	String.prototype.splitFrame = function(){
		function indexFrame(s)
		{
			var r = -1;
			if (s == "") return r;
			var zero = "0".charCodeAt();
			for (var i = s.length-1; i>=0; i--){
				var c = s[i].charCodeAt() - zero;
				if ((c<0)||(c>9)){
					r = i;
					break;
				}
			}
			if(i !=s.length-1){
				r += 1;
			}
			return r;
		}
		
		var ret = new Object;
		ret.node = "";
		ret.frame ="";
		ret.ext = "";
		ret.isFrame = false;

		if ( this == "") return ret;
		var idx = this.lastIndexOf(".");
		var nm = "";
		if (idx>=0){
			nm = this.substring(0,idx);
			ret.ext = this.substring(idx);
		}else{
			nm = this;
		}
		idx = indexFrame(nm);
		if ( idx<0) {
			ret.node = nm;
		}else if (idx==0){
			ret.frame = nm;
		}else{
			ret.node = nm.substring(0,idx);
			ret.frame = nm.substring(idx);
		}
		ret.isFrame = (ret.frame != "");
		return ret;
	}	//-------------------------------------------------------------------------
	var infoFootage = function(ftg)	{		var ret = "0";		if (ftg instanceof FootageItem) {			var ftgms = ftg.mainSource;			if ( ftgms.file != null) {				var head = "";				ret = ftgms.file.fsName;				if (ftgms.isStill == false) {					if (  (ftgms.conformFrameRate == ftgms.displayFrameRate)&& (ftgms.conformFrameRate == ftgms.nativeFrameRate)) {						head = File.decode( ftg.duration * ftgms.nativeFrameRate +"\t個の連番ファイル");					}				}				ret =  ftgms.file.fsName + "\t" +  head;			}		}		return ret;	}	//-------------------------------------------------------------------------
	var exec = function()	{		var ret = 0;				if ( app.project.numItems<=0) {			alert("no items!");			return ret;		}		var foorageList = [];		for (var i=1; i<=app.project.numItems; i++ ){			var tar = app.project.items[i];			if ( tar instanceof FootageItem ) {				if ( tar.mainSource.file != null) {					var info = infoFootage(tar);					if (info != "") {						foorageList.push(info);					}				}			}		}		if (foorageList.length <=0) {			alert("no footage!!");			return ret;		}		foorageList.sort();		var str = foorageList.join("\r\n");		var sn = app.project.file.fullName.changeExt("") + "_footageList.txt";				var ff = new File(sn);		ff.encoding = "shift-jis";		if (ff.open("w")){
			try{
				ff.write(str);
				ff.close();				if (ff.exists==true) ff.execute();	 
			}catch(e){
				alert("error");			}
		}
		return -1;	}	//-------------------------------------------------------------------------
	var batchMake = function()	{		if (app.project.file == null) {			alert("Please Save Project!!");			return;		}else{		}		var sn = app.project.file.fullName.changeExt("") + ".bat";		var sf  = new Folder(Folder.startup);				var tx = "echo off\r\n" 			+ "\""  + sf.fsName  +     "\\aerender.exe\"  -project "			+ "\""+ app.project.file.fsName + "\"\r\n";		alert(sn);		var ff = new File(sn);		ff.encoding = "shift-jis";		if (ff.open("w")){
			try{
				ff.write(tx);
				ff.close();
				alert("ok:");			}catch(e){
				alert("error");			}
		}
	}		
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "aerender用batch作成", [ 0,  0,  200,  50]  ,{resizeable:false, maximizeButton:false, minimizeButton:false});
	var btnExec = winObj.add("button",[10,10,150,30],"Batch作成");
	//btnExec.onClick = batchMake;	btnExec.onClick = exec;	
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}


///-----------------------------------------------------------------------
})(this);
