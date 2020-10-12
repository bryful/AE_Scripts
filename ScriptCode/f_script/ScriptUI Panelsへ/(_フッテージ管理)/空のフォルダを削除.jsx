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
    var scriptName = "空のフォルダを削除";
    var deleteEmptyFolderMain = function()
	{
        //FolderIetmをリストアップ
		var listupFolders = function()
		{
			var ret = [];
			if ( app.project.numItems>0){
				for ( var i=1; i<=app.project.numItems;i++){
					if (app.project.items[i] instanceof FolderItem){
						ret.push(app.project.items[i]);
					}
				}
			}
			return ret;
		}
		var lst = listupFolders();
		if ( lst.length<=0) {
			alert("none Folder!");
			return;
		}
		app.beginUndoGroup(scriptName);
		
		var flg = true;
		var rcc = 0;
		do
		{
			flg = false;
			var cnt = lst.length;
			for ( var i=cnt-1; i>=0; i--){
				if (lst[i] != null){
					if ( lst[i].numItems <=0){
						lst[i].remove();
						lst[i] = null;
						flg = true;
						rcc++;
					}
				}
			}
		}while(flg);
		app.endUndoGroup();
		if ( rcc>0) alert( "remove:" + rcc);
	}
    deleteEmptyFolderMain();
})(this);
 