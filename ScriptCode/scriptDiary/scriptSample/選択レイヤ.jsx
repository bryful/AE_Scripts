//選択したレイヤに何かする
//---------------------------------------------------------------------------
function foo(tLayer)
{
	//何か
	return true;
}
//---------------------------------------------------------------------------
var activeComp = app.project.activeItem;
if ( (activeComp!=null)&&(activeComp instanceof CompItem) ) {
	
	var selectedLayers = activeComp.selectedLayers;

	if ( (selectedLayers!=null)&&(selectedLayers.length>0) ){
		app.beginUndoGroup("選択したレイヤに何かする");
		for (var i = 0; i < selectedLayers.length; i++) {
			if ( foo(selectedLayers[i])==false ){
				//エラー処理
			}else{
			}
		}
	app.endUndoGroup();
	}else{
		//エラー処理
	}
}else{
	//エラー処理
}
//---------------------------------------------------------------------------

