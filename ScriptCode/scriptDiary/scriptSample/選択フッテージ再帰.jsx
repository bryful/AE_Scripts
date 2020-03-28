//---------------------------------------------------------------------------
//選択したフッテージにに何かする
//---------------------------------------------------------------------------
/*
	選択したアイテムを獲得するクラス
	フォルダならば再帰して中身をリストアップする
*/
//---------------------------------------------------------------------------
function getSelectedItems()
{
	this.footageList = new Array;
	this.compList = new Array;
	this.folderList = new Array;
	
	//--------------------------------------------
	this.getFootage = function(target)
	{
		if (target == null) return;
		if (target instanceof FolderItem) {
			this.folderList.push(target);
			if ( target.numItems<=0) return;
			var cnt = target.numItems;
			for (var i=1; i<=cnt; i++){
				this.getFootage(target.item(i));
			}
		}else{
			if (target instanceof CompItem){
				this.compList.push(target);
			}else {
				this.footageList.push(target);
			}
		}
	}
	//--------------------------------------------
	this.selectedListup = function()
	{
		var selectedItems = app.project.selection;
		if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
			for (var i = 0; i < selectedItems.length; i++) {
				this.getFootage(selectedItems[i]);
			}
		}
	}
	//--------------------------------------------
	this.selectedListup();
}
//---------------------------------------------------------------------------
var list = "";
function foo(f)
{
	list += (f.name + " "+ f.typeName +"\n");
}
//---------------------------------------------------------------------------
var si = new getSelectedItems;
if (si.footageList.length>0) {
	
	for (var i=0; i<si.footageList.length;i++)
	{
		foo(si.footageList[i]);
	}
}
if (si.compList.length>0) {
	
	for (var i=0; i<si.compList.length;i++)
	{
		foo(si.compList[i]);
	}
}
if (si.folderList.length>0) {
	
	for (var i=0; i<si.folderList.length;i++)
	{
		foo(si.folderList[i]);
	}
}
if (list != ""){
	alert(list);
}
