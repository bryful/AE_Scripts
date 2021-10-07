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
	var winObj = (me instanceof Panel)? me : new Window('palette{text:"バックグラウンドでレンダリングAE202x",orientation : "column", properties : {resizeable : true} }');
	var res1 =
	'Group{alignment: ["fill", "fill" ],orientation:"column",\
	st0:StaticText{alignment:["left","top"],text:"aerenderをバックグラウンドで起動させます。"},\
	btnExec:Button{alignment:["fill","top"],preferredSize:[150,30],text:"レンダリング実行"}\
	}';
	winObj.gr = winObj.add(res1 );
	winObj.layout.layout();
	winObj.onResize = function()
	{
		winObj.layout.resize();
	}

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
		var aer = null;
		try{
			var now = nd.getFullYear() +"_"+ nd.getMonth() +"_"+ nd.getDate() +"_"+ nd.getHours() +"_"+ nd.getMinutes();
			tmpAep = new File(Folder.temp.fullName + "/" + prjName + "_" +now + ".aep");
			tmpBat = new File(Folder.temp.fullName + "/" + prjName + "_" +now + ".bat");
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
		try{
			if ( tmpBat.exists==true) tmpBat.execute();
		}catch(e){
				alert(e.toString());
		}
	}
	winObj.gr.btnExec.onClick = exec;

	if(winObj instanceof Window ) winObj.show();
})(this);
