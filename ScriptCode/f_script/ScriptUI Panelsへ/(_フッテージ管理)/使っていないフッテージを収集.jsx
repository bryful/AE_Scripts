(function(me){
/*
#includepath "../(lib)"
#include "prototypeArray.jsx"
#include "prototypeFile.jsx"
#include "prototypeItem.jsx"
#include "prototypeParse.jsx"
#include "prototypeProject.jsx"
#include "prototypeProperty.jsx"
#include "prototypeString.jsx"
*/   
    
    //
    var scriptName = "使っていないフッテージを収集";
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
	var reduceFootage = function()
	{
		var cnt = app.project.numItems;
		if (cnt<=0){
			alert("アイテムがありません");
			return;
		}
		//使用していないアイテムをリストアップ
		var list = [];
		for (var i=1; i<=cnt; i++){
			var tar = app.project.item(i);
			if (tar instanceof FootageItem) {
				if (tar.usedIn.length<=0) {
					list.push(tar);
				}
			}else if  (tar instanceof CompItem) {
				if ((tar.usedIn.length<=0)&&(tar.numLayers<=0 )) {
					list.push(tar);
				}
			}
		}
		if (list.length>0) {
			app.beginUndoGroup(scriptName);
			var ff= newSolidFolder(scriptName);
			for (var i=0; i<list.length; i++){
				list[i].parentFolder = ff;
			}
			alert(list.length +"個のフッテージを収集しました。");
			app.endUndoGroup();
		}else{
			alert("未使用のフッテージはありません。");
		}
	}
    reduceFootage();
})(this);
 