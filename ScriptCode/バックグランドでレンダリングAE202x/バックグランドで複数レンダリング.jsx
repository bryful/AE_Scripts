(function (me){

	String.prototype.getParent = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(0,i);
		return r;
	}	//ファイル名のみ取り出す（拡張子付き）
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
	//拡張子なしのファイル名を取り出す。
	String.prototype.getNameWithoutExt = function(){
		return this.getName().changeExt('');
	}
	// *************************************************************************
	// 実行回数
	var execCount = 1;
	// *************************************************************************
    var savePref = function()
    {
        var f = new File(Folder.userData.fullName + "/bg.pref");
        var obj = {};
        obj.execCount = execCount;

        if (f.open("w")==true)
        {
            try{
                f.write(obj.toSource());
            }catch(e){
            }finally{
                f.close();
            }
        }
    }
    var loadPref = function()
    {
        var f = new File(Folder.userData.fullName + "/bg.pref");
        if (f.open("r")==true)
        {
            try{
                var s = f.read();
                var obj = eval(s);
                var b = obj.execCount;
                if ( typeof(b)=="number")
                {
                    execCount = b;
                }
            }catch(e){
            }finally{
                f.close();
            }
        }
    }
    loadPref();
	// *************************************************************************
	var winObj = (me instanceof Panel)? me : new Window('palette{text:"バックグラウンドで複数レンダリング",orientation : "column", properties : {resizeable : true} }');
	var res1 =
'Group{alignment: ["fill", "fill" ],orientation:"column",\
st0:StaticText{alignment:["left","top"],text:"バックグラウンドで複数aerenderを起動させます"},\
cap:Group{alignment:["left","top"],orientation:"row",\
st1:StaticText{text:"起動個数"},\
btnMinus:Button{preferredSize:[30,20],text:"-"},\
stCount:StaticText{preferredSize:[20,30],text:"1"},\
btnPlus:Button{preferredSize:[30,20],text:"+"}},\
btnExec:Button{alignment:["fill","fill"],text:"Exec"}\
}';

	winObj.gr = winObj.add(res1 );
	winObj.layout.layout();
	winObj.onResize = function()
	{
		winObj.layout.resize();
	}
	// *************************************************************************
	winObj.gr.cap.stCount.text =  execCount*1;
	// *************************************************************************
	winObj.gr.cap.btnMinus.onClick = function()
	{
		if (execCount>1)
		{
			execCount--;
			winObj.gr.cap.stCount.text =  execCount*1;
		}
	}
	winObj.gr.cap.btnPlus.onClick = function()
	{
		if (execCount<9)
		{
			execCount++;
			winObj.gr.cap.stCount.text =  execCount*1;
		}
	}

	// *************************************************************************
	var exec = function()
	{
		function wq(s){ return "\""+ s + "\"";}

		if ( app.project.file == null){
			alert("プロジェクトを保存してください。");
			return;
		}
		//一時的に別ファイルにaepを保存して、Batchファイルを作成。
		var af = app.project.file;

		var prjName = af.fullName.getNameWithoutExt();


		var rq = app.project.renderQueue;
		var rqOK = false;
		if ( rq.numItems>0){
			for (var i=1; i<=rq.numItems; i++){
				if ( rq.item(i).status == RQItemStatus.QUEUED) {
					if ( rq.item(i).numOutputModules>0){
						for (var j=1; j<=rq.item(i).numOutputModules; j++){
							if (rq.item(i).outputModule(j).file != null)
								rqOK = true;
							break;
						}
					}
				}
				if (rqOK == true) break;
			}
		}
		if (rqOK==false){
			alert("有効なレンダーキューがありません。");
			return;
		}



		var nd = new Date();
		var tmpAep = null;
		var tmpBat = null;
		var tmpBat2 = null;
		var aer = null;
		var fld = null;
		try{
			var now = nd.getFullYear() +"_"+ nd.getMonth() +"_"+ nd.getDate() +"_"+ nd.getHours() +"_"+ nd.getMinutes();
			fld = new Folder(Folder.temp.fullName+"/"+now);
			fld.create();

			tmpAep = new File(fld.fullName + "/" + "render.aep");
			tmpBat = new File(fld.fullName + "/" + "child.bat");
			tmpBat2 = new File(fld.fullName + "/" + "start.bat");
			aer = new File(Folder.appPackage.fullName + "/aerender.exe");
		}catch(e){
			alert(e.toString());
			return;
		}
		app.project.save(tmpAep);
		app.project.save(af);

		var cmd = "";
		cmd = "@echo off\r\n";
		cmd += wq(aer.fsName)+ " -project " + wq(tmpAep.fsName) +  " -sound ON\r\n";
		cmd += "exit\r\n";
		if (tmpBat.open("w")){
			try{
				tmpBat.encoding = "SHIFT-JIS";
				tmpBat.lineFeed = "windows";
				tmpBat.write(cmd);
			}catch(e){
				alert(e.toString());
			}finally{
				tmpBat.close();
			}
		}
		var cmd2 = "";
		cmd2 = "@echo off\r\n";
		cmd2 += "cd " + wq(fld.fsName)+"\r\n";
		for ( var i=0; i<execCount;i++)
		{
			cmd2 += "start " + tmpBat.name+"\r\n";
		}
		if (tmpBat2.open("w")){
			try{
				tmpBat2.encoding = "SHIFT-JIS";
				tmpBat2.lineFeed = "windows";
				tmpBat2.write(cmd2);
			}catch(e){
				alert(e.toString());
			}finally{
				tmpBat2.close();
			}
		}
		//alert(tmpBat2.fsName);
		try{
			if ((tmpBat.exists==true)&&(tmpBat2.exists==true)) tmpBat2.execute();
		}catch(e){
				alert(e.toString());
		}
		savePref();
	}
	winObj.gr.btnExec.onClick = exec;

	if(winObj instanceof Window ) winObj.show();
})(this);
