//選択したレイヤに何かする
//---------------------------------------------------------------------------

function swapLayer(cnt0,cnt1)
{
	if (cnt0==cnt1){
		return true;
	} else if (cnt0>cnt1){
		var tmp = cnt0;
		cnt0 = cnt1;
		cnt1 = tmp;
	}
	activeComp.layers[cnt1].moveAfter(activeComp.layers[cnt0]);
	activeComp.layers[cnt0].moveAfter(activeComp.layers[cnt1]);

}
//---------------------------------------------------------------------------
var activeComp = app.project.activeItem;
if ( (activeComp!=null)&&(activeComp instanceof CompItem) ) {
	
	var layers = activeComp.layers;

	if ( (layers!=null)&&(layers.length>0) ){
		
		var len = layers.length;
		var cnt = Math.floor(len / 2);
		if (cnt>0){
			app.beginUndoGroup("レイヤ順を反転");
			for (var i = 1 ; i <=cnt ; i++) {
				swapLayer(i,len-i+1);
			}
			app.endUndoGroup();
		}
	}else{
		//エラー処理
	}
}else{
	//エラー処理
}
//---------------------------------------------------------------------------

