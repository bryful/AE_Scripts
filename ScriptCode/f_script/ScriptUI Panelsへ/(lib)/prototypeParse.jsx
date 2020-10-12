
(function (){
    // 指定した桁でその時頭を0をたす。
    Number.prototype.zeroTopStr = function(keta){
		var ret=" ";
        if ( (keta==undefined)||(keta==null))
        {
            kata = 3;
        }
        ret = "0000000000" + this.valueOf();
        ret = ret.substring(rt.length-keta);
		return ret;
	}
    // 文字を数値に。エラーの場合 -1か 引数の値になる
    String.prototype.toNumber = function(errValue)
    {
        var ret = errValue;
        if ((ret == null)||(ret == undefined))
        {
			errValue = -1;
        }
        try{
            var v = praseInt(this);
            if(isNaN(v)==false){
                ret = v;
            }else{
                ret = errValue;
			}
        }catch(e){
        	ret = errValue;
        }
        return ret;

    }
    
})();