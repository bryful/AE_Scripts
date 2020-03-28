﻿
function showPropertyInfoPath()
{
	//---------------
	function getPT(p)
	{
		var ret = "";
		if ( (p instanceof PropertyGroup)||(p instanceof PropertyBase)||(p instanceof MaskPropertyGroup)){
			switch( p.propertyType)
			{
				case PropertyType.INDEXED_GROUP : ret = "PropertyType.INDEXED_GROUP";break;
				case PropertyType.NAMED_GROUP : ret = "PropertyType.NAMED_GROUP";break;
				case PropertyType.PROPERTY : ret = "PropertyType.PROPERTY";break;
				default: ret = "PropertyType UNKNOWN";break;
			}
		}else if ( p instanceof Property){
			switch( p.propertyValueType)
			{
				case PropertyValueType.NO_VALUE :		ret = "PropertyValueType.NO_VALUE";break;
				case PropertyValueType.ThreeD_SPATIAL :	ret = "PropertyValueType.ThreeD_SPATIAL";break;
				case PropertyValueType.ThreeD :			ret = "PropertyValueType.ThreeD";break;
				case PropertyValueType.TwoD_SPATIAL :	ret = "PropertyValueType.TwoD_SPATIAL";break;
				case PropertyValueType.TwoD :			ret = "PropertyValueType.TwoD";break;
				case PropertyValueType.OneD :			ret = "PropertyValueType.OneD";break;
				case PropertyValueType.COLOR :			ret = "PropertyValueType.COLOR";break;
				case PropertyValueType.CUSTOM_VALUE :	ret = "PropertyValueType.CUSTOM_VALUE";break;
				case PropertyValueType.MARKER :			ret = "PropertyValueType.MARKER";break;
				case PropertyValueType.LAYER_INDEX :	ret = "PropertyValueType.LAYER_INDEX";break;
				case PropertyValueType.MASK_INDEX :		ret = "PropertyValueType.MASK_INDEX";break;
				case PropertyValueType.SHAPE :			ret = "PropertyValueType.SHAPE";break;
				case PropertyValueType.TEXT_DOCUMENT :	ret = "PropertyValueType.TEXT_DOCUMENT";break;
				default: ret = "PropertyValueType UNKNOWN";break;
			}
		}
		if ( ret != "") ret += "\r\n";
		return ret;
	}
	//---------------
	function proInfo(p)
	{
		if ( (p== null)||(p ==undefined)) return "";
		var ret = "----------\r\n";
		if ( p instanceof AVLayer){
			ret += "AVLayer\r\n";
		}else if (p instanceof PropertyGroup){
			ret += "PropertyGroup\r\n";
		}else if (p instanceof PropertyBase){
			ret += "PropertyBase\r\n";
		}else if (p instanceof MaskPropertyGroup){
			ret += "MaskPropertyGroup\r\n";
		}else if (p instanceof Property){
			ret += "Property\r\n";
		}
		ret += "name = \"" + p.name +"\"\r\n";
		ret += "matchName = \"" + p.matchName +"\"\r\n";
		ret += getPT(p);
		ret += "\r\n";
		return ret;
	}
	//---------------
	//プロパティのアクセス配列を得る
	function proPath(p)
	{
		var ret = [];
		if ( ( p== null)||(p==undefined)) return ret;
		if ( (  p instanceof Property )||(  p instanceof PropertyGroup)||(  p instanceof MaskPropertyGroup) ) {
			var pp = p;
			while ( pp != null){
				ret.push(pp);
				pp = pp.parentProperty;	//このメソッドがキモ
			}
			//配列をひっくり返す
			if ( ret.length>1) ret = ret.reverse();
		}
		//返されるObjectは、Layerからになる
		return ret;
	} 
	//---------------
	//Javascriptのコードに変換
	function proPathToString(ary,idx)
	{
		if ( !(ary instanceof Array) ) return "";
		if ( ary.length <=2) return "";
		
		var ret = "var p = ";
		ret += "app.project.item("+ idx + ")";		//CompItem

		for ( var i=0; i<ary.length; i++){
			if ( ( ary[i] instanceof AVLayer)||( ary[i] instanceof ShapeLayer)||(ary[i] instanceof TextLayer)){
				ret += ".layer(\"" + ary[i].name +"\")";
			}else if (( ary[i] instanceof PropertyGroup)||( ary[i] instanceof MaskPropertyGroup)){
				
				//無理やり名前が変更できるか確認
				
				var canNameChange = ( (ary[i].propertyType == PropertyType.NAMED_GROUP)&&(ary[i].matchName !="ADBE Transform Group" ));
				
				if (canNameChange ==true){
					ret += ".property(\"" + ary[i].name +"\")";
				}else{
					ret += ".property(\"" + ary[i].matchName +"\")";
				}
				
				//ret += ".property(\"" + ary[i].matchName +"<"+ary[i].name +">" +"\")";
				
			}else if ( ary[i] instanceof Property){
				ret += ".property(\"" + ary[i].matchName +"\")";
			}
		}
		ret +=";\n";
		return ret;

	}
	//---------------
	//作成したコードを収納する
	var codeList = "";

	//ターゲットのコンポのインデックス
	var compIndex = -1;
	var layerIndex = -1;
	//アクティブなアイテムを得る
	var ac = app.project.activeItem;
	if ( ac instanceof CompItem)
	{
		//姑息なやり方でインデックスを獲得
		var idBk = ac.id;
		for ( var i=1; i<=app.project.numItems; i++)
		{
			if (app.project.item(i).id == idBk) {
				compIndex = i;
				break;
			}
		}
		var prA = ac.selectedProperties;
		var cnt = ac.selectedProperties.length
		if ( cnt>0){
			
			for ( var i=0; i<cnt; i++){
				var ary = proPath(prA[i]);
				codeList += "**********************************************\r\n";
				codeList += proPathToString(ary,compIndex) +"\r\n";
				if ( ary.length>0){
				
					for ( var j=0; j<ary.length; j++){
						codeList += j +"番目\r\n";
						codeList += proInfo(ary[j]);
					}
				}
			}
		}
	}
	if ( codeList == ""){
		codeList = "レイヤーのプロパティを何か選択してくださいまし。";
	}
	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	this.winObj = new Window("dialog", "Propertyへのアクセス", [150, 200, 150+1000, 200+640]);
	this.gb1 = this.winObj.add("panel", [15, 15, 15+970, 15+570], "After Effects Properties" );
	this.tbProp = this.gb1.add("edittext", [15, 15, 15+940, 15+540], codeList,{multiline: true,readonly:true } );
	this.btnOK = this.winObj.add("button", [850, 590, 850+98, 590+23], "OK", {name:'ok'});
	this.winObj.center();

	//フォントを大きく
	var fnt = this.tbProp.graphics.font;
	this.tbProp.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.BOLD, fnt.size * 1.5);

	//---------------
	this.show = function()
	{
		return this.winObj.show();
	}
	//---------------
}
var dlg = new showPropertyInfoPath;
dlg.show();


