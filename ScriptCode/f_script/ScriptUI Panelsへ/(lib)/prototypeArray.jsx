(function (){
	//-------------------------------------------------------------------------
	//改行付きの文字列操作
	//-------------------------------------------------------------------------
	//文字列を改行ごとに配列に変換
	String.prototype.lineToArray =function(){
		var r=this.replaceAll("\r\n","\n"); return r.split("\n");
	}
	//配列を改行区切りの文字列に変換
	Array.prototype.toLineStr = function() {
		var r=this.toString(); return r.replaceAll(",","\r\n");
	}
	//-------------------------------------------------------------------------
	//Arrayの拡張
	//-------------------------------------------------------------------------
	//指定した番号が配列の要素数内であればtrueを返す。
	Array.prototype.indexIn = function(i){
		return ((typeof(i)=="number")&&(i>=0)&&(i<this.length));
	}
	//配列をクリア（要素数を０に)
	Array.prototype.clear = function() {this.length=0;return this;}
	//配列を複製
	Array.prototype.clone = function(){ return [].concat(this);}
	//配列の先頭を取り出す
	Array.prototype.first = function(){
		if (this.length>0)
		{
			return this[0];
		} else {
			return null;
		}
	}
	//配列の最後を取り出す
	Array.prototype.last = function() {
		if (this.length>0)
		{
			return this[this.length-1];
		} else {
			return null;
		}
	}
	//指定したインデックス番号の要素を削除
	Array.prototype.removeAt = function(i) {
		if(this.indexIn(i)==true)
		{
			return this.splice(i,1);
		} else{
			 return null;
		}
	}
	//指定したインデックス番号で要素を入れ替える
	Array.prototype.swap = function(s,d) {
		if(this.indexIn(s) && this.indexIn(d)){
			var tmp = this[s]; this[s]=this[d]; this[d]=tmp;
			return this;
		}
	}
    //-------------------------------------------------------------------------
	//Collectionの配列化
	//-------------------------------------------------------------------------
	//コレクションを普通の配列に変換
	ItemCollection.prototype.toArray = 
	LayerCollection.prototype.toArray = 
	function(){
		var r=[];
		if(this.length>0) for(var i=1;i<=this.length;i++) r.push(this[i]);
		return r;
	}
	//配列自身を返す。
	Array.prototype.toArray = function() { return this;}
	//文字列を１文字１文字で配列に変換
	String.prototype.toArray = function(){return this.split('');}
    //-------------------------------------------------------------------------
	//interate
	//配列の要素全てに指定した関数を適応させる。指定する関数の引数に注意
	//-------------------------------------------------------------------------
	Array.prototype.interate = function(fnc){
		if (this.length<=0)return;
		if (fnc instanceof Function){
			for(var i=0;i<this.length;i++){ fnc(this[i],i);}
		}
	}
	
	ItemCollection.prototype.interate = 
	LayerCollection.prototype.interate = 
	function(fnc){
		if (this.length<=0)return;
		if (fnc instanceof Function){
			for(var i=1;i<=this.length;i++){ fnc(this[i],i);}
		}
	}
	
	Property.prototype.interate = function(fnc){
		if (this.numKeys>0){
			if (fnc instanceof Function){
				for(var i=1;i<=this.numKeys;i++){fnc(this,i);}
			}
		}
	}
})();