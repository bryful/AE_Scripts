
function changeOutputPath()
{
	var title		= "書き出し場所変更";
	//-----------------------------------------------------------
	function getOutputPath()
	{
		var ret = null;
		var cmdName = "AE_SelectFolder.exe";
	
		var cmd = new File(cmdName);
		if ( cmd.exists == true) {
			var p = system.callSystem("AE_SelectFolder.exe");
			if ( p !="" ) ret = new Folder(p);
		}else{
			ret = folderGetDialog("");
		}
		return ret;
	}
	//-----------------------------------------------------------
	function changeParent(src, p)
	{
		var nm = src.name;
		
		return new File( p.fsName + "\\" + nm);
	}
	//-----------------------------------------------------------
	this.execute = function()
	{
		if (app.project.renderQueue.numItems<=0){
			alert("レンダーキューに何も登録されていません。");
			return false;
		}
		app.beginUndoGroup(title);
		var newLocation = getOutputPath();
		for (i = 1; i <= app.project.renderQueue.numItems; i++) {
			var curItem = app.project.renderQueue.item(i);
			if ( (curItem.status == RQItemStatus.QUEUED)||(curItem.status == RQItemStatus.NEEDS_OUTPUT) ) {
				var curOM = curItem.outputModule(1);//出力モジュールは１個と決め付け
				curOM.file = changeParent(curOM.file, newLocation);
			}
		}
		app.endUndoGroup();
	}
	//-----------------------------------------------------------
}

var cop = new changeOutputPath();
cop.execute();
