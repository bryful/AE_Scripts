/*	CS4以降のXMPメタデータのxmpMM:Historyを消去するスクリプト。	スクリプトガイドにあったものをすこしだけ改造。		undoはつけていない。		おかしくなったaepファイルをもしかしたら修復できるかもしれない（気休め)*/(function (me)
{
	var proj = app.project;
	// load the XMP librar y as an ExtendScript ExternalObject
	if (ExternalObject.AdobeXMPScript == undefined) {
		ExternalObject.AdobeXMPScript = new
		ExternalObject('lib:AdobeXMPScript');
	}
	var mdata = new XMPMeta(app.project.xmpPacket); // get the project’s XMP metadata
	// update the Label project metadata’s value
	var schemaNS = XMPMeta.getNamespaceURI("xmpMM");
	var propName = "xmpMM:History";
	try {		var cnt = mdata.countArrayItems(schemaNS, propName);		if (cnt>0){
			mdata.deleteProperty(schemaNS, propName);
			var cnt2 = mdata.countArrayItems(schemaNS, propName);			if (cnt2==0){				alert(cnt+"個のHistoryを削除しました。");			}else{				alert(cnt+"個中" +cnt2+"個ののHistoryが削除できましたが、全部消せませんでした。");							}		}else{			alert("削除すべきxmpMM:History はありません！");		}
	}
	catch(e) {
		alert(e.toString());
	}
	app.project.xmpPacket = mdata.serialize();})(this);