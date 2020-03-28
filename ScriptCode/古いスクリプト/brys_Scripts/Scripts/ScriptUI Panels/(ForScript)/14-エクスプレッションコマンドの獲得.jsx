/*
	レイヤのプロパティを選択して実行。
	そのプロパティにアクセスするコードを作成する。
*/

(function (me)
{
	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	//プロパティのアクセス配列を得る
	function proPath(p)
	{
		var ret = [];
		if ( ( p== null)||(p==undefined)) return ret;
		if (  (p instanceof Property )||(p instanceof PropertyGroup )||(p instanceof MaskPropertyGroup )) {
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
	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	//Javascriptのコードに変換
	function proPathToString(ary)
	{
		if ( !(ary instanceof Array) ) return "";
		var ret = "";

		for ( var i=0; i<ary.length; i++){
			if ( ret != "") ret += ".";
			ret += "(\"" + ary[i].matchName +"\"/*"  + ary[i].name + "*/)";
		}
		return ret;

	}
	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	function getExp(lyr)
	{
		var list = "";
		function pexp(p)
		{
			if ( p instanceof Property) {
				try{
					if ( p.canSetExpression == true){
						var s = p.expression;
						p.expression = "";
						p.selected = true;
						app.executeCommand(2702);
						var ss = proPathToString(proPath(p));
						ss += " : " + p.expression;
						list += ss +"\n";
						p.selected = true;
						app.executeCommand(2702);
						p.selected = false;
						p.expression = s;
					}
				}catch(e){
				}
			}else if ( (p instanceof PropertyGroup)||(p instanceof MaskPropertyGroupp) ) {
				if ( p.numProperties>0) {
					for ( var i=1; i<=p.numProperties; i++) {
						pexp(p.property(i));
					}
				}
			}
		}
		if (lyr == null) return;
		if ( lyr.numProperties >0) {
			for ( var i=1; i<=lyr.numProperties; i++) {
				pexp(lyr.property(i));
			}
		}
		return list;
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////////////
	//---------------
	//作成したコードを収納する
	var codeList = "";

	var ac = null;
	var al = null;
	if ( app.project.activeItem instanceof CompItem) {
		ac = app.project.activeItem;
		if ( ac.selectedLayers.length>0) {
			al = ac.selectedLayers[0];
		}
	}
		codeList = getExp(al);
	if ( codeList == ""){
		codeList = "レイヤーのプロパティを何か選択してくださいまし。";
	}
	//---------------
	//ダイアログを作成して表示。
	//カット＆ペーストしやすいようにedittextに表示
	var winObj = new Window("dialog", "Propertyへのアクセス", [154, 203, 154+1024, 203+400]);
	var gb1 = winObj.add("panel", [10, 10, 10+1004, 10+350], "After Effects Properties" );
	var tbProp = gb1.add("edittext", [10, 20, 10+984, 20+320], codeList,{multiline: true,readonly:true } );
	var btnOK = winObj.add("button", [850, 365, 850+98, 365+23], "OK", {name:'ok'});
//	var fnt = this.tbProp.graphics.font;
//	this.tbProp.graphics.font = ScriptUI.newFont (fnt.name, ScriptUI.FontStyle.BOLD, fnt.size * 1.5);

	winObj.center();
	winObj.show();
	//フォントを大きく
	//---------------
})(this);

