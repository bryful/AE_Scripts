//**************************************************************************
function makeRecComp()
{
	this.title = "HDtoSD収録Comp作成";
	var targetList	= new Array;
	
	var outWidth		= 720;
	var outHeight		= 486;
	var outFps			= 29.97;
	var outAspect		= 0.9;

	var inFps			= 23.976;
	var inAspect		= 1.0;
	
	//-----------------------------------------------
	this.settingFps = function (iFps,oFps)
	{
		inFps = iFps;
		outFps = oFps;
	}
	//-----------------------------------------------
	this.settingAspect = function (iAspect,oAspect)
	{
		inAspect = iAspect;
		outAspect = oAspect;
	}
	//-----------------------------------------------
	function isSequece(ftg)
	{
		var ret = false;
		if (ftg == null) return ret;
		if ( ftg instanceof FootageItem) {
			if (ftg.file != null){
				if ( ftg.mainSource.isStill == false) ret = true;
			}
		}
		
		return ret;
	}
	//-----------------------------------------------
	function splitFileName(s)
	{
		var ss = s;
		var o = new Object;
		o.node = "";
		o.frameSepa = "";
		o.frames = "";
		o.ext = "";
		
		if ( ss == "" ) return o;
		var p1 = ss.lastIndexOf(".");
		if ( p1>=0) {
			o.ext = ss.substring(p1);
			ss = ss.substring(0,p1);
		}
		
		if ( ss[ss.length-1] =="]" ){
			p1 = ss.lastIndexOf("[");
			o.frames = ss.substring(p1);
			ss = ss.substring(0,p1);
		}else{
			var pp = -1;
			for ( var i= ss.length-1; i>=0; i--){
				var c = ss[i];
				if ( ( c>="0")&&( c<="9") ){
				}else{
					pp = i;
					break;
				}
			}
			if ( pp>=0) {
				o.frames = ss.substring(pp+1);
				ss = ss.substring(0,pp+1);
			}
		}
		var c = ss[ss.length-1];
		if ( (c =="_")||(c =="-") ){
			o.frameSepa = c;
			ss = ss.substring(0,ss.length-1);
		}
		o.node = ss;
		return o;
	}
	function getFootageFromFolder(path)
	{
		var cnt = path.items.length;
		if ( cnt <=0 ) return;
		for ( var i = 0; i < cnt; i++){
			if ( isSequece(path.items[i]) == true ){
				this.targetList.push(path.items[i]);
			}else if ( path.items[i] instanceof FolderItem ){
				getFootageFromFolder(path.items[i]);
			}
		}
	}
	function getFootage()
	{
		targetList = new Array;
		var cnt = app.project.selection.length;
		if (cnt <=0) return;
		for ( var i = 0; i < cnt; i++){
			if ( isSequece(app.project.selection[i])==true ){
				targetList.push(app.project.selection[i]);
			}else if ( app.project.selection[i] instanceof FolderItem ){
				getFootageFromFolder(app.project.selection[i]);
			}
		}
	}
	
	function makeComp()
	{
		var cnt = targetList.length;
		if ( cnt <=0 ) return;
		
		for ( var i=0; i<cnt; i++){
			targetList[i].mainSource.conformFrameRate = inFps;
			targetList[i].pixelAspect = inAspect;
	
			var pf = targetList[i].parentFolder;
			
			var nm = splitFileName(targetList[i].name);
			
			var du = targetList[i].duration

			//フレームレート変更の場合は、フィールドを切り捨てる
			if ( inFps != outFps){
				var frm = Math.floor(targetList[i].duration * outFps);
				du = frm / outFps;
			}
			
			var dstComp = pf.items.addComp(
				nm.node,
				outWidth,
				outHeight,
				outAspect,
				du,
				outFps);
			dstComp.pixelAspect =  9/10 -0.0092;
			//念のために再設定
			dstComp.duration = du;
			
			var mainLayer = dstComp.layers.add(targetList[i]);
			
			/*
			//スクィーズ
			var sh = 100 * outHeight / targetList[i].height;
			var sw = 100 * outWidth * outAspect / targetList[i].width ;
			*/
			//レターボックス
			var s = 100 * outWidth  / targetList[i].width ;
			var sw = s * outAspect;
			var sh = sw;
			mainLayer.property("Scale").setValue([sw,sh]);
			//mainLayer.stretch;
		}
	}
	this.exec = function()
	{
		getFootage();
		if (targetList.length<=0) {
			alert("ターゲットが選択されていません。");
		}else{
			app.beginUndoGroup(this.title);
			makeComp()
			app.endUndoGroup();
		};
	}
}
var mrc = new makeRecComp();
mrc.settingFps(23.976,29.97);

mrc.exec();

