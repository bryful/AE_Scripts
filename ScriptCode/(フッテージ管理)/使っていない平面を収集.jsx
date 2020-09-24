(function(me){
//#include "public.jsxinc"
    
    //
    var scriptName = "使っていない平面を収集";
    //-----------------------------
	var newSolidFolder = function(str)
	{
		var targetName = str;
		var fld = app.project.rootFolder;
		var cnt = fld.numItems;
		if (cnt >0) {
			for (var i=1; i<=cnt; i++)
			{
                if(fld.item(i) instanceof FolderItem) {
				    if (fld.item(i).name == targetName ) return fld.item(i);
                }
			}
		}
		return fld.items.addFolder(targetName);
	}
	var reduceSolid = function()
	{
		var cnt = app.project.numItems;
		if (cnt<=0){
			alert("アイテムがありません");
			return;
		}
		var list = [];
		try{
            for (var i=1; i<=cnt; i++){
                var tar = app.project.item(i);
                if (tar instanceof FootageItem) {
                    if ( tar.file == null) {
                        if (tar.usedIn.length<=0) {
                            list.push(tar);
                        }
                    }
                }
            }
        }catch(e){
            alert(scriptName+":1\r\n"+e.toString());
        }

        try{
            if (list.length>0) {
                app.beginUndoGroup(scriptName);
                var ff= newSolidFolder("使用していない平面");
                for (var i=0; i<list.length; i++){
                    list[i].parentFolder = ff;
                }
                app.endUndoGroup();
                alert(list.length +"個の平面を収集しました。");
            }else{
                alert("未使用の平面はありません。");
            }
        }catch(e){
            alert(scriptName+":2\r\n"+e.toString());
        }
	}
    reduceSolid();
})(this);
 