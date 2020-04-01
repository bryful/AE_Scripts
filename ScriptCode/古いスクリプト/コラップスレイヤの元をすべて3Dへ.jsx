
//--
(function (me)
{	var title = "ラップス元をすべて3Dレイヤへ";
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
	var infoFootage = function(ftg)	{		var ret = "0";		if (ftg instanceof FootageItem) {			var ftgms = ftg.mainSource;			if ( ftgms.file != null) {				var head = "";				ret = ftgms.file.fsName;				if (ftgms.isStill == false) {					if (  (ftgms.conformFrameRate == ftgms.displayFrameRate)&& (ftgms.conformFrameRate == ftgms.nativeFrameRate)) {						head = File.decode( ftg.duration * ftgms.nativeFrameRate +"\t個の連番ファイル");					}				}				ret =  ftgms.file.fsName + "\t" +  head;			}		}		return ret;	}	//-------------------------------------------------------------------------	//-------------------------------------------------------------------------
	var set3DLayer= function(lyr,b) {		if (lyr.adjustmentLayer === false) {			lyr.threeDLayer = b;		}	}	//-------------------------------------------------------------------------
	var isSrcComp= function(lyr) {		return ( lyr.source instanceof CompItem);	}	//-------------------------------------------------------------------------
	var execSub = function(cmb)	{		if (! (cmb instanceof CompItem))  return;		if (cmb.numLayers<=0)  return;		//まずコンポ内を終わらせる		var targetComb = [];		for (var i=1; i<= cmb.numLayers; i++) {			var tar = cmb.layers[i];			set3DLayer(tar,true);			if (isSrcComp(tar)===true){				if (tar.collapseTransformation === true) {					targetComb.push(tar.source);				}			}		}		if (targetComb.length<=0) return;		//再帰実行		for (var i=0; i< targetComb.length; i++) {			execSub(targetComb[i]);		}			}	//-------------------------------------------------------------------------
	var exec = function()	{		var ac = app.project.activeItem;		if (! (ac instanceof CompItem)) {			alert("コンポを選んで！");			return;		}		if (ac.numLayers<=0) {			alert("レイヤがない");			return;		}		app.beginUndoGroup(title);		execSub(ac);		app.endUndoGroup();	}	
	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", title, [ 0,  0,  200,  50]  ,{resizeable:false, maximizeButton:false, minimizeButton:false});
	var btnExec = winObj.add("button",[10,10,150,30],"実行");
	btnExec.onClick = exec;	
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}


///-----------------------------------------------------------------------
})(this);
