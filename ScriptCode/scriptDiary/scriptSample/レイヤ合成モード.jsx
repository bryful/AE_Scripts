//---------------------------------------------------------------------------
//選択したレイヤの合成モードを変更
//---------------------------------------------------------------------------
/*
//合成モード定数
BlendingMode.NORMAL				//通常
BlendingMode.DISSOLVE			//ディザ合成
BlendingMode.DANCING_DISSOLVE	//ダイナミックディザ合成

BlendingMode.DARKEN				//比較(暗)
BlendingMode.MULTIPLY			//乗算
BlendingMode.LINEAR_BURN	//焼き込みリニア
BlendingMode.COLOR_BURN		//焼き込みカラー
BlendingMode.CLASSIC_COLOR_BURN//焼き込みカラー（クラッシック）

BlendingMode.ADD					//加算
BlendingMode.LIGHTEN			//比較（明）
BlendingMode.SCREEN				//スクリーン
BlendingMode.LINEAR_DODGE
BlendingMode.COLOR_DODGE
BlendingMode.CLASSIC_COLOR_DODGE

BlendingMode.OVERLAY
BlendingMode.SOFT_LIGHT
BlendingMode.HARD_LIGHT
BlendingMode.LINEAR_LIGHT
BlendingMode.VIVID_LIGHT
BlendingMode.PIN_LIGHT
BlendingMode.HARD_MIX

BlendingMode.DIFFERENCE
BlendingMode.CLASSIC_DIFFERENCE
BlendingMode.EXCLUSION

BlendingMode.HUE
BlendingMode.SATURATION
BlendingMode.COLOR
BlendingMode.LUMINOSITY

BlendingMode.STENCIL_ALPHA
BlendingMode.STENCIL_LUMA
BlendingMode.SILHOUETE_ALPHA
BlendingMode.SILHOUETTE_LUMA

BlendingMode.ALPHA_ADD
BlendingMode.LUMINESCENT_PREMUL

*/
//---------------------------------------------------------------------------
functionlayerMode(tLayer)
{
	tLayer.blendingMode = BlendingMode.NORMAL;
	return true;
}
//---------------------------------------------------------------------------
varactiveComp=app.project.activeItem;
if((activeComp!=null)&&(activeCompinstanceofCompItem)){
	
	varselectedLayers=activeComp.selectedLayers;

	if((selectedLayers!=null)&&(selectedLayers.length>0)){
		app.beginUndoGroup("選択したレイヤに何かする");
		for(vari=0;i<selectedLayers.length;i++){
			if(layerMode(selectedLayers[i])==false){
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

