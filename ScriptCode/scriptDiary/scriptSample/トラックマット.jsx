//トラックマットを設定
//---------------------------------------------------------------------------
/*
TrackMatteType.ALPHA
TrackMatteType.ALPHA_INVERTED
TrackMatteType.LUMA
TrackMatteType.LUMA_INVERTED
TrackMatteType.NO_TRACK_MATTE
*/
function setTrackMat(tLayer)
{
	//何か
	tLayer.trackMatteType = TrackMatteType.ALPHA;
	return true;
}
//---------------------------------------------------------------------------
var activeComp = app.project.activeItem;
if ( (activeComp!=null)&&(activeComp instanceof CompItem) ) {
	
	var selectedLayers = activeComp.selectedLayers;

	if ( (selectedLayers!=null)&&(selectedLayers.length>0) ){
		app.beginUndoGroup("トラックマット設定");
		for (var i = 0; i < selectedLayers.length; i++) {
			setTrackMat(selectedLayers[i]);
		}
	app.endUndoGroup();
	}else{
		//エラー処理
	}
}else{
	//エラー処理
}
//---------------------------------------------------------------------------

