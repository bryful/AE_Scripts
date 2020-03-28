//---------------------------------------------------------------------------
//フォルダを作成する AE6/AE7両用
//同名ファイルがあればそのFolderItemを返す
//フォルダ名の比較は大文字小文字を無視
//---------------------------------------------------------------------------
function makeFolder(name)
{
	//nameがないならrootを返す
	if ( (name=="")||(name==null) ){
		return app.project.rootFolder;
	}
	//同じ名前のフォルダがあったらそれを返す。
	if (app.project.numItems>0){
		var targetName =name.toLowerCase();
		for (var i=1;i<=app.project.numItems;i++){
			if (app.project.item(i) instanceof FolderItem){
				//大文字小文字は無視
				if (app.project.item(i).name.toLowerCase()==targetName){
					return app.project.item(i);
				}
			}
		}
	}
	//バージョン確認
	var aeVer=60;
	if (app.version.match(/(\d).(\d)(.(\d))?x(.*)/)) {
		aeVer = parseInt(RegExp.$1)*10+parseInt(RegExp.$2);
	}
	if (aeVer>=70){
		//AE7は簡単
		return app.project.items.addFolder(name);
	}else{
		//新規平面でフォルダが作られるのを利用
		var dmyComp =  app.project.items.addComp(	"__temp__",10,10,1,1,24);
		var dmyLayer = dmyComp.layers.addSolid([1,1,1],"temp", 10, 10, 1,1);
		var dmyFtg = dmyLayer.source;
		var myFolder = dmyFtg.parentFolder;
		myFolder.name =name;
		dmyComp.remove();
		dmyFtg.remove();
		return myFolder;
	}
}
//---------------------------------------------------------------------------
//指定したフォルダを作成し、その中にコンポを作成。
//フォルダ名を空にすれば、通常のaddCompと同じもの
//---------------------------------------------------------------------------
function makeComp(name,folderName,width,height,pixelAspect,duration,frameRate)
{
	return makeFolder(folderName).items.addComp(name,width,height,pixelAspect,duration,frameRate);
}
//---------------------------------------------------------------------------
app.beginUndoGroup("フォルダ内にコンポ作成");
//実行サンプル
//AE7ならcomp.parentFolderにFolderItemを入れて移動が出来る。
//AE6は、移動できない。作成時のみフォルダを指定できる（出来る方法あったら知りたい）
makeComp("aaa","",10,10,1,1,24);		//ルートにコンポaaaを作成
makeComp("aaa","AAA",10,10,1,1,24);	//フォルダAAAにコンポaaaを作成
makeComp("bbb","AAA",10,10,1,1,24);	//フォルダAAAにコンポbbbを作成
makeComp("aaa","BBB",10,10,1,1,24);	//フォルダBBBにコンポaaaを作成
makeComp("bbb","BBB",10,10,1,1,24);	//フォルダBBBにコンポaaaを作成

app.endUndoGroup();
//---------------------------------------------------------------------------
