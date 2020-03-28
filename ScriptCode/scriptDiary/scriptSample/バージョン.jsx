//バージョン番号を整数で返す
function ae_version()
{
	app.version.match(/(\d).(\d)(.(\d))?x(.*)/);
	if (RegExp.$4==""){
		var n=0;
	}else{
		var n=parseInt(RegExp.$4);
	}
	return parseInt(RegExp.$1)*100+parseInt(RegExp.$2)*10+n;
}

alert(ae_version());
