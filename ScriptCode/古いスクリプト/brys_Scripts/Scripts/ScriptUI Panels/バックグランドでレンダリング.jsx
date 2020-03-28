(function(me){
	var listPro_items = ["Lo(推奨)","Normal" ];

	//-------------------------------------------------------------------------
	var winObj = ( me instanceof Panel) ? me : new Window("palette", "バックグラウンドでレンダリング", [ 866,  465,  866+ 179,  465+  89]  ,{maximizeButton:true, minimizeButton:true});
	//-------------------------------------------------------------------------
	var btnExec = winObj.add("button", [   7,   12,    7+ 164,   12+  23], "バックグランドでレンダー開始" );
	btnExec.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var stPro = winObj.add("statictext", [   4,   46,    4+  82,   46+  14], "プロセス優先度");
	stPro.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var listPro = winObj.add("dropdownlist", [  92,   42,   92+  79,   42+  21], listPro_items);
	listPro.items[0].selected = true;
	listPro.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);
	var cbExecGo = winObj.add("checkbox", [   7,   68,    7+  79,   68+  18], "強制実行");
	cbExecGo.graphics.font = ScriptUI.newFont("Tahoma",ScriptUI.FontStyle.REGULAR, 11);

	//-------------------------------------------------------------------------
	function exec()
	{
		function wq(s){ return "\""+ s + "\"";}

		if (system.osName.toLowerCase().indexOf("windows") <0){
			alert("すみません。Windows専用です。");
			return;
		}

		if ( app.project.file == null){
			alert("プロジェクトを保存してください。");
			return;
		}
		//レンダーキューの確認
		var rq = app.project.renderQueue;
		var rqOK = false;
		if ( rq.numItems>0){
			for (var i=1; i<=rq.numItems; i++){
				if ( rq.item(i).status == RQItemStatus.QUEUED) {
					if ( rq.item(i).numOutputModules>0){
						for (var j=1; j<=rq.item(i).numOutputModules; j++){
							if (rq.item(i).outputModule(j).file != null)
								if (rq.item(i).outputModule(j).file.parent.exists == true){
									rqOK = true;
									break;
								}
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
		var proOp = "";
		switch (listPro.selection.index)
		{
			case 1: proOp = "/normal";break;
			case 0: 
			default:
				proOp = "/low";
				break;
		}
		var execGo = cbExecGo.value;
		
		//一時的に別ファイルにaepを保存して、Batchファイルを作成。
		var af = app.project.file;
		var tmpAep = new File(Folder.temp.fullName + "/" + "aerender_temp_.aep");
		if (tmpAep.exists) 
		{
			if ( execGo == true) {
				cbExecGo.value = false;
				tmpAep.remove();
			}else{
				alert("現在バックグラウンドでレンダリング中です。\nしていない時は強制実行をONにしてください。");
				return;
			}
		};
		app.project.save(tmpAep);
		app.project.save(af);
		
		var aer = new File(Folder.appPackage.fullName + "/aerender.exe");
		
		var cmd = "@echo off\r\n";
		cmd += "start \"\" /b " + proOp +" /wait ";
		cmd += wq(aer.fsName)+ " -project " + wq(tmpAep.fsName) +  " -sound ON\r\n";
		cmd += "del " + wq(tmpAep.fsName) + "\r\n";
		var bF = new File( Folder.temp.fullName + "/aerender.bat");
		if ( bF.exists==true) bF.remove();
		if (bF.open("w")){
			try{
				bF.write(cmd);
			}catch(e){
				alert(e.toString());
			}finally{
				bF.close();
			}
		}
		//実行
		if ( bF.exists==true) bF.execute();
		
	}
	btnExec.onClick = exec;
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false){
		winObj.center(); 
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);