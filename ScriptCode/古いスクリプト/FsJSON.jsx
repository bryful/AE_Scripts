/*

	CS4でjson2.jsが使えなかったので作ったライブラリ

	//オブジェクトをJSONにする
	var str = FsJSON.toJSON(obj)
	
	//JSON文字をオブジェクトへ変換
	var obj = FsJSON.parse(sｔｒ)
	

	☆説明
		var a = {
			a:1,
			b:"B"
		}
	例えば上のオブジェクトをtoSource()で文字列にすると

		var s = a.toSource();
		alert(s);
	
	({a:1, b:"B"})

	という文字列になる。
	一見JSONに見えるが厳密に言うと違うので、After Effectsだけで扱うJSONなら
	toSource()/eval()で問題なしだが、他のアプリに読み込ませることが出来ない。

	正解は
	{"a":1, "b":"B"}

	といった文字列だ。
	インターネットブラウザのほとんどはAfter EffectsのtoSource()で出力される文字列
	を解析出来たが、肝心のC#の標準JSON機能では読み込みできなかった。
	
	仕方ないので有名なライブラリのjson2.jsを使いデコードする事になる。
	CS5以降ならば特に問題ない。しかしCS4で検証した結果、CS4ではjson2.jsは動作
	しなかった。
	
	JSON.stringify()は変な文字コードが入り込み。JSON.parse()は自らが作成したJSON
	を解析する事が出来なかった。
	
	仕方なく作ったのがこのライブラリ"FsJSON.jsx"

*/
if ( typeof (FsJSON) !== "object"){//デバッグ時はコメントアウトする
	FsJSON = {};
}//デバッグ時はコメントアウトする

(function(){
	//------------------------
	function toJSON(obj)
	{
		var ret = "";
		if (typeof(obj) === "boolean"){
			ret = obj.toString();
		}else if (typeof(obj)=== "number"){
			ret = obj.toString();
		}else if (typeof(obj)=== "string"){
			ret = "\""+ obj +"\"";
		}else if ( obj instanceof Array){
			var r = "";
			for ( var i=0; i<obj.length;i++){
				if ( r !== "") r +=",";
				r += toJSON(obj[i]);
			}
			ret = "[" + r + "]";
		}else{
			for ( var a in obj)
			{
				if ( ret !=="") ret +=",";
				ret += "\""+a + "\":" + toJSON(obj[a]);
			}
			ret = "{" + ret + "}";
			
		}
		if ( (ret[0] === "(")&&(ret[ret.length-1]===")"))
		{
			ret = ret.substring(1,ret.length-1);
		}
		return ret;
	}
	if ( typeof(FsJSON.toJSON) !== "function"){
		FsJSON.toJSON = toJSON;
	}
	//------------------------
	function parse(s)
	{
		var ret = null;
		if ( typeof(s) !== "string") return ret;
		//前後の空白を削除
		s = s.replace(/[\r\n]+$|^\s+|\s+$/g, "");
		s = s.split("\r").join("").split("\n").join("");
		if ( s.length<=0) return ret;
		
		var ss = "";
		var idx1 =0;
		var len = s.length;
		while(idx1<len)
		{
			var idx2 = -1;
			if ( s[idx1]==="\""){
				var idx2 = s.indexOf("\"",idx1+1);
				if ((idx2>idx1)&&(idx2<s.length)){
					if ( s[idx2+1] !== ":") idx2 = -1;
				}
			}
			if ( idx2 ==-1) {
				ss += s[idx1];
				idx1++;
			}else{
				ss += s.substring(idx1+1,idx2)+":";
				idx1 = idx2+2;
			}
		}
		if ( ss[0]=="{"){
			ss ="("+ss+")";
		}
		try{
			ret = eval(ss);
		}catch(e){
			ret = null;
		}
		return ret;
	}
	if ( typeof(FsJSON.parse) !== "function"){
		FsJSON.parse = parse;
	}
	//------------------------
})();
