//---------------------------------------------------------------------------
//フッテージ名を各要素に分解する
//---------------------------------------------------------------------------
//返り値用の構造体
function animeName()
{
	// AA01_001A-T2_[0001-0012].tga
	this.node			="";	//AA01_001A
	this.infoSepa	="";	//-
	this.info			="";	//T2
	this.nodeSepa	="";	//_
	this.frame		="";	//[0001-0012]
	this.ext			="";	//.tga
}
//---------------------------------------------------------------------------
function splitAnimeName(tName)
{
	var r =new animeName;
	//必要なさそうだけど初期化
	r.node ="";
	r.info	="";
	r.nodeSepa=""
	r.infoSepa="";
	r.frame="";
	r.ext	="";
	//引数がFootageItemなら名前を獲得
	if (tName instanceof FootageItem){
		var inS =tName.name;
	}else{
		var inS=tName;
	}
	if (inS.match(/(.*?)?(_|-)?(\[(.*)?\])(\.(.+)?)/)){
		//aa-[0001-0010].tga
		r.node=RegExp.$1; // aa
		r.nodeSepa=RegExp.$2 //-
		r.frame=RegExp.$3; //[0001-0010]
		r.ext=RegExp.$5; //.tga
	}else if (inS.match(/(.*?)(_|-)?(\d*)(\.(.+)?)/)){
		//aa-0001.tga
		r.node=RegExp.$1; //a
		r.nodeSepa=RegExp.$2 //-
		r.frame=RegExp.$3; //0001
		r.ext=RegExp.$4; //.tga
	}else if (inS.match(/(\d*)(\.(.+)?)/)){
		//0001.tga
		r.frame=RegExp.$1; //0001
		r.ext=RegExp.$2; //.tga
	}else{
		//想定したファイル名じゃない
		r.node =inS;
		return r;
	}
	var s = r.node;
	// aa01_c001A_T2
	if (s.match(/((.*?)(\d*)?(-|_)(c)?(\d*)([A-Z])?)(-|_)?(.*)?/i)){
		//ここを変更すれば、もっと細かな切り分けができる。
		//一応 "作品略語$2"	+	"話数番号$3" + "_" + "c" + "カット番号$6"	+"AB分け$7"	+	"_"	+	"追加文字"
		//ってスタイルを想定してある。
		r.node		=RegExp.$1; //aa01_c001A
		r.infoSepa=RegExp.$8; //_
		r.info		=RegExp.$9; //_T2
	}
	return r;
}
//---------------------------------------------------------------------------
var selectedItems = app.project.selection;
var theS="";
if ( (selectedItems!=null)&&(selectedItems.length>0) ) {
	app.beginUndoGroup("splitAnimeName");
	for (var i = 0; i < selectedItems.length; i++) {
		if (selectedItems[i] instanceof FootageItem) {
			var ret=splitAnimeName(selectedItems[i]);
			theS += selectedItems[i].name+"\n"+
							"\tnode:"+ret.node +"\n"+
							"\tinfo:"+ret.info+"\n"+
							"\tframe:"+ret.frame+"\n"+
							"\text:"+ret.ext+"\n";
		}
	}
	alert(theS);
	app.endUndoGroup();
}else{
	//エラー処理
}
//---------------------------------------------------------------------------
