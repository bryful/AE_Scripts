//---------------------------------------------------------------------------
//選択したレイヤにエフェクトを追加
//---------------------------------------------------------------------------
/*
エフェクトのプロパティーは、キーフレームをコピーしてエディタに貼り付ければわかる。

以下は、ブラー(ガウス)のキーフレームのもの。

---------------------------------------------------------------
Adobe After Effects 6.5 Keyframe Data

	Units Per Second	30
	Source Width	1024
	Source Height	576
	Source Pixel Aspect Ratio	1
	Comp Pixel Aspect Ratio	1

Effects	ブラー(ガウス) #1	ブラー #2
	Frame		
	0	30	

Effects	ブラー(ガウス) #1	ブラーの方向 #3
	Frame		
	0	1	


End of Keyframe Data
---------------------------------------------------------------

エフェクト名が「ブラー(ガウス)」
第１パラメータが「ブラー」第２パラメータは「ブラーの方向」とわかる。

なお標準プラグイン等日本語名のプラグインは、英語版と互換性がない。
つまり、多言語版で使用する場合、別プラグインと考えてプロパティ名を変更しなければいけない。
英語版のプロパティ名は英語モード(AfterEX.exe /L ENG)で立ち上げればわかる。
*/
//---------------------------------------------------------------------------
//レイヤにエフェクトを追加。同じエフェクトがあっても追加。
function addEffect(tLayer,effectName)
{
	var effect_str	= "エフェクト";
	var fxg = tLayer.property(effect_str);
	if (fxg.canAddProperty(effectName)) {
		return  fxg.addProperty(effectName);
	}
	return null;
}
//---------------------------------------------------------------------------
//レイヤにエフェクトをさがす。同じエフェクトがあったら、それを返す。なかったら新たに作る
function findEffect(tLayer,effectName)
{
	var effect_str	= "エフェクト";
	var fxg = tLayer.property(effect_str);
	var fx = fxg.property(effectName);
	if (fx!=null) {
		return fx;
	}else{
		if (fxg.canAddProperty(effectName)) {
			return  fxg.addProperty(effectName);
		}
	
	return null;
}
//---------------------------------------------------------------------------
function layerAddEffect(tLayer)
{
	var fx=addEffect(tLayer,"ブラー(ガウス)")
	if (fx!=null){
		fx.property("ブラー").setValue(30);
		//fx.property.ブラー.setValue(30);	//こんな書き方も一応いい筈
		fx.property("ブラーの方向").setValue(1);
	}

}
//---------------------------------------------------------------------------
var activeComp=app.project.activeItem;
if((activeComp!=null)&&(activeComp instanceof CompItem)){
	
	var selectedLayers=activeComp.selectedLayers;

	if((selectedLayers!=null)&&(selectedLayers.length>0)){
		app.beginUndoGroup("layerAddEffect");
		for(var i=0;i<selectedLayers.length;i++){
			if(layerAddEffect(selectedLayers[i])==false){
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

