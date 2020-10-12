(function (){

    //レイヤのタイムリマップを０で静止画状態に
	AVLayer.prototype.remapIsOnekey = function(){
		if(this.canSetTimeRemapEnabled){
			this.timeRemapEnabled = true;
			var r=this.timeRemap;
			r.addKey(0);
			if(r.numKeys>1)
				for(var i=r.numKeys;i>1;i--)
					r.removeKey(i);
		}
	}
    AVLayer.prototype.setRemapKoma = function(koma)
    {
	    if (this.canSetTimeRemapEnabled === false) return;
		
		var st = this.startTime;
		
		var k = koma / this.source.frameRate;
		var cnt = Math.floor(this.source.duration / k);
		
		this.timeRemapEnabled = true;
		var remap = this.property("ADBE Time Remapping");
		if (st>=0)
			remap.setValueAtTime(st,0);
		if ( remap.numKeys>1) {
            for ( var i = remap.numKeys; i>1;i--) remap.removeKey(i);
        }	
		
		for (var i=0; i< cnt; i++){
			var v = k * i;
			var tm = v + st;
			if (tm>=0)
				remap.setValueAtTime(tm,v);
		}
		for (var i=1 ; i<=remap.numKeys ; i++) {
            remap.setInterpolationTypeAtKey(i,
                KeyframeInterpolationType.HOLD,
                KeyframeInterpolationType.HOLD);
        }
		
		var op = this.startTime + this.source.duration;
		if ( this.outPoint > op) this.outPoint = op;	
    }

	//指定された時間にキーフレームがあったらtrue
	Property.prototype.isKeyAtTime = function(t){
		return ( this.keyTime(this.nearestKeyIndex(t)) == t);
	}
	//キーフレームを全て削除
	Property.prototype.keyClear = function(){
		if( this.numKeys>0){
			var v=this.value;
			for(var i=this.numKeys;i>=1;i--) this.removeKey(i);
			this.setValue(v);
		}
	}
	//キーフレームを最初の１個のみにする
	Property.prototype.keyFreeze = function(){
		this.addKey(0);
		if(this.numKeys>1) for(var i=this.numKeys; i>1;i--)this.removeKey(i);
	}
	//このプロパティのあるLayer objectを返す
	Property.prototype.getParentLayer = function(){
		var ret=this.parentProperty;
		while(ret!=null){
			if ((ret instanceof AVLayer)||(ret instanceof ShapeLayer)
			||(ret instanceof TextLayer)) break;
            if( ret.parentProperty == null)
            {
                break;
            }
			ret = ret.parentProperty;
		}
		return ret;
	}
	//全てのキーフレームを選択。引数にfalseを入れると全ての選択を解除
	Property.prototype.keySelectedAll = function(b){
		if ( this.numKeys>0){
			if ((b==null)||(typeof(b)!="boolean")) b = true;
			for(var i=1; i<=this.numKeys; i++) this.setSelectedAtKey(i,b);
		}
	}    
    // プロパティの親プロパティをルートから配列にして返す。
    MaskPropertyGroup.prototype.getPathArray =
    PropertyBase.prototype.getPathArray =
    PropertyGroup.prototype.getPathArray =
    Property.prototype.getPathArray = function()
    {
    	var ret = [];
        var pp = this;
        while ( pp != null){
            ret.push(pp);
            if(pp.parentProperty == null)
            {
                var cmp = pp.containingComp;
                if  ((cmp!=null)&&(cmp!=undefined)){
                    ret.push(cmp);
                }
                break;
            }
            pp = pp.parentProperty;	//このメソッドがキモ
        }
        if ( ret.length>1) ret = ret.reverse();
        return ret;
    }
    // プロパティグループが名前を変えられるか
    MaskPropertyGroup.prototype.isNamed =
    PropertyGroup.prototype.isNamed = function()
    {
        var ret = false;
        var bak = this.name;
        try{
            var s = "_---_-_";
            this.name = s;
            ret = (this.name == s);
            if(ret==true){ this.name = bak;}
        }catch(e){
            ret = false;
        }      
        return ret;
    }
    Property.prototype.isNamed = function()
    {
        return false;
    }
    // スクリプトのコードを返す
    LightLayer.prototype.scriptIndex = 
    LightLayer.prototype.scriptCode = 
    CameraLayer.prototype.scriptIndex = 
    CameraLayer.prototype.scriptCode = 
    TextLayer.prototype.scriptIndex = 
    TextLayer.prototype.scriptCode = 
    ShapeLayer.prototype.scriptIndex = 
    ShapeLayer.prototype.scriptCode = 
    AVLayer.prototype.scriptIndex = 
    AVLayer.prototype.scriptCode = function()
    {
         return  ".layer(\"" + this.name + "\")";
    }
    CompItem.prototype.scriptIndex =
    CompItem.prototype.scriptCode = function()
    {
         return  "comp(\"" + this.name + "\")";
    }
    Property.prototype.scriptCode = function()
    {
        return ".property(\"" + this.name + "\")";
    }
    Property.prototype.scriptIndex = function()
    {
        return "(" + this.propertyIndex + ")";
    }
    PropertyGroup.prototype.scriptCode = function()
    {
        if(this.isNamed()==true)
        {
            return ".property(\"" + this.name + "\")";
        }else{
            return ".property(\"" + this.matchName + "\")";
        }
    }
    PropertyGroup.prototype.scriptIndex = function()
    {
        if(this.isNamed()==true)
        {
            return "(\"" + this.name + "\")";
        }else{
            return "(" + this.propertyIndex + ")";
        }
    }

    // プロパティの親プロパティをルートから文字列にして返す。
    MaskPropertyGroup.prototype.getPathString =
    PropertyBase.prototype.getPathString =
    PropertyGroup.prototype.getPathString =
    Property.prototype.getPathString = function()
    {
        var ret = "";
        var ary = this.getPathArray();
        if(ary.length>0) {
            for (var i=0;i<ary.length;i++){
                try{
                ret += ary[i].scriptCode();
                }catch(e){
                    alert(ary[i].name);
                }
            }
        }
        return ret;
    }
    MaskPropertyGroup.prototype.getPathStringIndex =
    PropertyBase.prototype.getPathStringIndex =
    PropertyGroup.prototype.getPathStringIndex =
    Property.prototype.getPathStringIndex = function()
    {
        var ret = "";
        var ary = this.getPathArray();
        if(ary.length>0) {
            for (var i=0;i<ary.length;i++){
               ret += ary[i].scriptIndex();
            }
        }
        return ret;
    }
    // 情報を返す。
    PropertyGroup.prototype.info =function()
    {
        var lst = [
            "matchName",
            "name",
           "propertyIndex",
            "propertyDepth",
            "numProperties",
            ];
        function toS(prop,p)
        {
            var s = "";
            try{
                if (prop[p] != undefined)
                {
                    s = p + ":" + prop[p].toString(); 
                }
            }catch(e){
                s = p + "/" + e.toString();
            }
            return s;
        }
        var ret = "";
        //type
        ret += "type: PropertyGroup\r\n";
        for (var i=0;i<lst.length;i++)
        {
            ret += toS(this,lst[i]) +"\r\n";
        }
        if(this.numProperties>0)
        {
            for (var i=1; i<=this.numProperties;i++)
            {
                var p = this.property(i);
                ret += "  Property(" + i + "):" + p.name + "[" + p.matchName +"]\r\n"
                //
            }
        }
        return ret;
    } 
PropertyGroup.prototype.infoDetail =function()
    {
        var lst = [
            "matchName",
            "name",
           "propertyIndex",
            "propertyDepth",
            "numProperties",
            "active",
            "canSetEnabled",
            "elided",
            "enabled",
            "isEffect",
            "isMask",
            "isModified",
            "parentProperty",
            "propertyType",
            "selected"
            ];
        function toS(prop,p)
        {
            var s = "";
            try{
                if (prop[p] != undefined)
                {
                    s = p + ":" + prop[p].toString(); 
                }
            }catch(e){
                s = p + "/" + e.toString();
            }
            return s;
        }
        var ret = "";
        //type
        ret += "type: PropertyGroup\r\n";
        for (var i=0;i<lst.length;i++)
        {
            ret += toS(this,lst[i]) +"\r\n";
        }
        return ret;
    }
    Property.prototype.info = function()
    {
        var lst = [
            "matchName",
            "name",
            "propertyIndex",
            "propertyDepth",
            "value",
            "expression"
            ];
        function toS(prop,p)
        {
            var s = "";
            try{
                if (prop[p] != undefined)
                {
                    s = p + ":" + prop[p].toString(); 
                }
            }catch(e){
                s = p + "/" + e.toString();
            }
            return s;
        }
        var ret = "";
        //type
        ret += "type: Property\r\n";
        for (var i=0;i<lst.length;i++)
        {
            ret += toS(this,lst[i]) +"\r\n";
        }
        return ret;
    }
    Property.prototype.infoDetail = function()
    {
        var lst = [
            "matchName",
            "name",
            "propertyIndex",
            "propertyDepth",
            "value",
            "expression",
            "active",
            "canSetEnabled",
            "elided",
            "enabled",
            "isEffect",
            "isMask",
            "isModified",
            "parentProperty",
            "propertyType",
            "selected",
            "canSetExpression",
            "canVaryOverTime",
            "dimensionsSeparated",
            "expressionEnabled",
            "expressionError",
            "hasMax",
            "hasMin",
            "isDropdownEffect",
            "isSeparationFollower",
            "isSeparationLeader",
            "isSpatial",
            "isTimeVarying",
            "maxValue",
            "minValue",
            "numKeys",
            "propertyValueType",
            "selectedKeys",
            "separationDimension",
            "separationLeader",
            "unitsText"];
        function toS(prop,p)
        {
            var s = "";
            try{
                if (prop[p] != undefined)
                {
                    s = p + ":" + prop[p].toString(); 
                }
            }catch(e){
                s = p + "/" + e.toString();
            }
            return s;
        }
        var ret = "";
        //type
        ret += "type: Property\r\n";
        for (var i=0;i<lst.length;i++)
        {
            ret += toS(this,lst[i]) +"\r\n";
        }
        return ret;
    }

    
})();