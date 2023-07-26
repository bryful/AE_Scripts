
(function(me){
	//ファイル名のみ取り出す（拡張子付き）
	String.prototype.getName = function(){
		var r=this;var i=this.lastIndexOf("/");if(i>=0) r=this.substring(i+1);
		return r;
	}
	String.prototype.changeExt=function(s){
		var i=this.lastIndexOf(".");
		if(i>=0){return this.substring(0,i)+s;}else{return this + s; }
	}
    //----------------------------------
	var scriptName = File.decode($.fileName.getName().changeExt(""));
    //----------------------------------
    // 環境設定ファイルのFileオブジェクトを得る。
    var getPrefFile = function()
    {
        var pff = new Folder(Folder.userData.fullName+"/bry-ful");
        if(pff.exists==false)
        {
            pff.create();
        }
        var pff2 = new Folder(pff.fullName+"/" + scriptName);
        if (pff2.exists==false)
        {
            pff2.create();
        }
        var pf = new File(pff2.fullName + "/" + scriptName + ".pref");
        return pf;

    }
	//----------------------------------
    var prefData = {};
    prefData.left = 100;
    prefData.top = 100;
    prefData.width = 500;
    prefData.height = 450;
    prefData.addValue = 10;
    prefData.pathCenter = false;
    prefData.scale = 1.0;
    prefData.rect = function()
    {
        var ret =[];
        ret.push(this.left);
        ret.push(this.top);
        ret.push(this.left + this.width);
        ret.push(this.top + this.height);
        return ret;

    }
	//----------------------------------
    var loadPref = function()
    {
        var prefFile = getPrefFile();
        if(prefFile.exists)
        {
            var s = "";
		    if (prefFile.open("r"))
            {
                try{
                    s = prefFile.read();
                    var obj = eval(s);
                    var v = obj.left;
                    if((v!=undefined)&&(typeof(v)=="number")){prefData.left = v; v=null;}
                    v = obj.top;
                    if((v!=undefined)&&(typeof(v)=="number")){ prefData.top = v; v=null;}
                    v = obj.width;
                    if((v!=undefined)&&(typeof(v)=="number")){ prefData.width = v; v=null;}
                    v = obj.height;
                    if((v!=undefined)&&(typeof(v)=="number")){ prefData.height = v; v=null;}
                    v = obj.addValue;
                    if((v!=undefined)&&(typeof(v)=="number")){ prefData.addValue = v; v=null;}
                    v = obj.pathCenter;
                    if((v!=undefined)&&(typeof(v)=="boolean")){ prefData.pathCenter = v; v=null;}
                    v = obj.scale;
                    if((v!=undefined)&&(typeof(v)=="number")){ prefData.scale = v; v=null;}


                }catch(e){
                }finally{
                    prefFile.close();
                }
    		}
        }
    }
    loadPref();
	//----------------------------------
    var savePref = function()
    {
        var prefFile = getPrefFile();
        if (prefFile.open("w")){
			try{
                var b = winObj.bounds;
                prefData.left = b[0];
                prefData.top = b[1];
                prefData.width = b[2] - b[0];
                prefData.height = b[3] - b[1];
                prefData.addValue = eval(etValue.text);
                prefData.pathCenter = cbScale.value;
                prefData.scale = eval(etScale.text);
				prefFile.write(prefData.toSource());
				ret = true;
			}catch(e){
            }finally{
                prefFile.close();
            }
		}
    }
	//-------------------------------------------------------------------------
	var winObj = null;
    var btnGet = null;
 	var btnSet = null;
 	var btnNew = null;
	var etCode = null;
	var etCodeLine = null;
	var etValue = null;
	var btnUp = null;
	var btnRight = null;
 	var btnDown = null;
	var btnLeft = null;

    var etScale = null;
    var cbScale = null;
    var btnScale = null;

	var btnFunc1 = null;
	var btnFunc2 = null;
	var btnFunc3 = null;
	var btnFunc4 = null;
	var btnFunc5 = null;
	var btnFunc6 = null;



	var btnFunc7 = null;
	var btnFunc8 = null;
	var btnFunc9 = null;
	//-------------------------------------------------------------------------
    var selectedProp = function(sels)
    {
        var ret = null;
        if(sels.length>0)
        {
            for(var i=0; i < sels.length; i++)
            {
                var prop = sels[i];
                if(prop.matchName=="ADBE Vector Shape - Group")
                {
                    ret = prop(2);
                }else if (prop.matchName=="ADBE Mask Atom")
                {
                    ret = prop(1);
                }else if (prop.matchName=="ADBE Vector Shape")
                {
                    ret = prop;
                }else if (prop.matchName=="ADBE Mask Shape")
                {
                    ret = prop;
                }

            }
        }
        return ret;

    }
	//-------------------------------------------------------------------------
    var getShapeLayer = function()
    {
        var ret = null;
        var ac = app.project.activeItem;
        if ((ac instanceof CompItem) == false) return ret;

        var prop = selectedProp(ac.selectedProperties);
        if(prop!=null)
        {
            if (prop.numKeys>0)
            {
                var idx = prop.nearestKeyIndex(ac.time);
                sh = prop.keyValue(idx);
            }else{
                sh = prop.value;
            }
            if (sh==null) return ret;
            ret = {};
            ret.closed = sh.closed;
            ret.vertices = sh.vertices;
            ret.inTangents = sh.inTangents;
            ret.outTangents = sh.outTangents;
        }
        return ret;
    }
	//-------------------------------------------------------------------------
    var setShapeLayer = function()
    {
        var ret = false;
        var ac = app.project.activeItem;
        if ((ac instanceof CompItem) == false) return ret;

        var o = eval(etCode.text);
        if(o==null) return false;
        var prop = selectedProp(ac.selectedProperties);
        if(prop!=null)
        {

            var idx =0;
            if (prop.numKeys>0)
            {
                idx = prop.nearestKeyIndex(ac.time);
                sh = prop.keyValue(idx);
            }else{
                sh = prop.value;
            }
            if (sh==null) return ret;
            sh.closed = o.closed;
            sh.vertices = o.vertices;
            sh.inTangents = o.inTangents;
            sh.outTangents = o.outTangents;
            if(idx>=1)
            {
                prop.setKeyValue(idx,sh);
            }else{
                prop.setValue(sh);
            }
            etCodeLine.text = toLineFromShape(sh);

            ret = true;

        }
        return ret;
    }
    //-------------------------------------------------------------------------
    var binarization = function(o)
    {

        if(o==null) return null;
        if ((o.vertices==null )||(o.vertices==undefined)) return null;
        if(o.vertices.length<=0) return o;

        for (var i=0; i<o.vertices.length;i++)
        {
            var a = o.vertices[i];
            a[0] = Math.round(a[0]);
            a[1] = Math.round(a[1]);
            o.vertices[i] = a;

            var a = o.inTangents[i];
            a[0] = Math.round(a[0]);
            a[1] = Math.round(a[1]);
            o.inTangents[i] = a;

            var a = o.outTangents[i];
            a[0] = Math.round(a[0]);
            a[1] = Math.round(a[1]);
            o.outTangents[i] = a;

        }
        return o;
    }
    //-------------------------------------------------------------------------
    var binarization2 = function(o)
    {

        if(o==null) return null;
        if ((o.vertices==null )||(o.vertices==undefined)) return null;
        if(o.vertices.length<=0) return o;

        for (var i=0; i<o.vertices.length;i++)
        {
            var a = o.vertices[i];
            a[0] = Math.round(a[0]*10)/10;
            a[1] = Math.round(a[1]*10)/10;
            o.vertices[i] = a;

            var a = o.inTangents[i];
            a[0] = Math.round(a[0]*10)/10;
            a[1] = Math.round(a[1]*10)/10;
            o.inTangents[i] = a;

            var a = o.outTangents[i];
            a[0] = Math.round(a[0]*10)/10;
            a[1] = Math.round(a[1]*10)/10;
            o.outTangents[i] = a;

        }
        return o;
    }
   //-------------------------------------------------------------------------
    var mirrerHor = function(o)
    {

        if(o==null) return null;
        if ((o.vertices==null )||(o.vertices==undefined)) return null;
        if(o.vertices.length<=0) return o;

        for (var i=0; i<o.vertices.length;i++)
        {
            var a = o.vertices[i];
            a[0] = a[0]*-1;
            o.vertices[i] = a;

            var a = o.inTangents[i];
            a[0] = a[0]*-1;
            o.inTangents[i] = a;

            var a = o.outTangents[i];
            a[0] = a[0]*-1;
            o.outTangents[i] = a;

        }
        return o;
    }
    //-------------------------------------------------------------------------
    var mirrerVur = function(o)
    {

        if(o==null) return null;
        if ((o.vertices==null )||(o.vertices==undefined)) return null;
        if(o.vertices.length<=0) return o;

        for (var i=0; i<o.vertices.length;i++)
        {
            var a = o.vertices[i];
            a[1] = a[1]*-1;
            o.vertices[i] = a;

            var a = o.inTangents[i];
            a[1] = a[1]*-1;
            o.inTangents[i] = a;

            var a = o.outTangents[i];
            a[1] = a[1]*-1;
            o.outTangents[i] = a;

        }
        return o;
    }
   //-------------------------------------------------------------------------
   var arrayShift = function(ary)
   {
        var a = ary;
        if(a.length<=0) return ary;
        var b = a[0];
        a.shift();
        a.push(b);
        return a;
   }
   //-------------------------------------------------------------------------
   var arrayUnshift = function(ary)
   {
        var a = ary;
        if(a.length<=0) return ary;
        var b = a.pop();
        a.unshift(b);
        return a;
   }

   //-------------------------------------------------------------------------
    var pointShift = function(o)
    {

        if(o==null) return null;
        if ((o.vertices==null )||(o.vertices==undefined)) return null;
        if(o.vertices.length<=0) return o;

        o.vertices = arrayShift(o.vertices);
        o.inTangents = arrayShift(o.inTangents);
        o.outTangents = arrayShift(o.outTangents);
        return o;
    }
   //-------------------------------------------------------------------------
    var pointUnshift = function(o)
    {

        if(o==null) return null;
        if ((o.vertices==null )||(o.vertices==undefined)) return null;
        if(o.vertices.length<=0) return o;

        o.vertices = arrayUnshift(o.vertices);
        o.inTangents = arrayUnshift(o.inTangents);
        o.outTangents = arrayUnshift(o.outTangents);
        return o;
    }
    //-------------------------------------------------------------------------
    var pointUnshift = function(o)
    {

        if(o==null) return null;
        if ((o.vertices==null )||(o.vertices==undefined)) return null;
        if(o.vertices.length<=0) return o;

        o.vertices = arrayUnshift(o.vertices);
        o.inTangents = arrayUnshift(o.inTangents);
        o.outTangents = arrayUnshift(o.outTangents);
        return o;
    }

    //-------------------------------------------------------------------------
    var arrayScale = function(ary,v)
    {
        var a = ary;
        if(a.length<=0) return ary;

        for(var i=0; i<a.length; i++)
        {
            var b = a[i];
            if (b.length>=2)
            {
                b[0] *= v;
                b[1] *= v;
            }
            a[i] = b;
        }

        return a;
    }
	//-------------------------------------------------------------------------
    var pointScale = function(o,v)
    {
        if(o==null) return null;
        if ((o.vertices==null )||(o.vertices==undefined)) return null;
        if(o.vertices.length<=0) return o;
        o.vertices = arrayScale(o.vertices,v);
        o.inTangents = arrayScale(o.inTangents,v);
        o.outTangents = arrayScale(o.outTangents,v);
        return o;

    }
    //-------------------------------------------------------------------------
    var shapeCenter = function(ary)
    {
        var ret ={};
        ret.x = 0;
        ret.y = 0;
        var a = ary;
        if(a.length<=0) return ret;

        var minX = 35000;
        var minY = 35000;
        var maxX = -35000;
        var maxY = -35000;
        for(var i=0; i<a.length; i++)
        {
            var b = a[i];
            if (minX >b[0]) minX = b[0];
            if (maxX <b[0]) maxX = b[0];
            if (minY >b[1]) minY = b[1];
            if (maxY <b[1]) maxY = b[1];
        }
        ret.x = (minX+maxX)/2;
        ret.y = (minY+maxY)/2;

        return ret;
    }

    //-------------------------------------------------------------------------
    var arrayScaleCenter = function(ary,cp,v)
    {
        var a = ary;
        if(a.length<=0) return ary;

        for(var i=0; i<a.length; i++)
        {
            var b = a[i];
            if (b.length>=2)
            {
                b[0] = (b[0]- cp.x)*v + cp.x;
                b[1] = (b[1]- cp.y)*v + cp.y;
            }
            a[i] = b;
        }

        return a;
    }
    //-------------------------------------------------------------------------
    var pointScaleCenter = function(o,v)
    {
        if(o==null) return null;
        if ((o.vertices==null )||(o.vertices==undefined)) return null;
        if(o.vertices.length<=0) return o;

        var cp = shapeCenter(o.vertices);
        o.vertices = arrayScaleCenter(o.vertices,cp,v);
        o.inTangents = arrayScale(o.inTangents,v);
        o.outTangents = arrayScale(o.outTangents,v);
        return o;

    }
    //-------------------------------------------------------------------------
    var toStrFromShape = function(sh)
    {
        function arrayTo(ary)
        {
            var r = "";
           if(ary.length>0)
            {
                for(var i=0; i<ary.length;i++)
                {
                    r += "/*" + i +"*/" + ary[i].toSource();
                    if (i <ary.length -1)
                    {
                        r += ",\r\n";
                    }else{
                        r += "\r\n";
                    }
                }
            }
            return r;
        }
        var ret = "";
        if ((sh.closed==null) || (sh.closed==undefined) ) return "";
        ret += "closed:" + sh.closed +",\r\n";
        // -------------------------
        if ((sh.vertices==null) || (sh.vertices==undefined) ) return "";
        ret += "vertices:[\r\n";
        ret += arrayTo(sh.vertices);
        ret += "],\r\n";
        // -------------------------
       if ((sh.inTangents==null) || (sh.inTangents==undefined) ) return "";
        ret += "inTangents:[\r\n";
        ret += arrayTo(sh.inTangents);
        ret += "],\r\n";
        // -------------------------
       if ((sh.outTangents==null) || (sh.outTangents==undefined) ) return "";
        ret += "outTangents:[\r\n";
        ret += arrayTo(sh.outTangents);
        ret += "]\r\n";

        ret = "({\r\n" + ret + "})\n";

        return ret;

    }
    var toLineFromShape = function(sh)
    {
        function arrayTo(ary)
        {
            var r = "";
           if(ary.length>0)
            {
                for(var i=0; i<ary.length;i++)
                {
                    r += ary[i].toSource();
                    if (i <ary.length -1)
                    {
                        r += ",";
                    }
                }
            }
            return r;
        }
        var ret = "createPath(points = [$1], inTangents = [$2], outTangents = [$3], isClosed = $4);";

        if ((sh.vertices==null) || (sh.vertices==undefined) ) return "";
        var s1 = s1 = arrayTo(sh.vertices);
        ret = ret.replace("$1",s1);
        if ((sh.inTangents==null) || (sh.inTangents==undefined) ) return "";
        var s2 = arrayTo(sh.inTangents);
        ret = ret.replace("$2",s2);
        if ((sh.outTangents==null) || (sh.outTangents==undefined) ) return "";
        var s3 = arrayTo(sh.outTangents);
        ret = ret.replace("$3",s3);
        if ((sh.closed==null) || (sh.closed==undefined) ) return "";
        var s4 = sh.closed + "";
        ret = ret.replace("$4",s4);

        return ret;

    }
    //-------------------------------------------------------------------------
    var moveShape = function(o,dir,v)
    {
        var x =0;
        var y =0;
        switch(dir) {
            case 1:
                x = v;
                break;
            case 2:
                y = v;
                break;
            case 3:
                x = -v;
                break;
            default:
            case 0:
                y = -v;
                break;
        }
        if (o.vertices.length>0)
        {
            var v =[];
            for ( var i=0; i<o.vertices.length ; i++)
            {
                var a = o.vertices[i];
                a[0] += x;
                a[1] += y;
                v.push(a);
            }
            o.vertices = v;
        }
        return o;
    }
    //-------------------------------------------------------------------------
    var moveShapeLayer = function(dir,v)
    {
        var ret = false;
        var ac = app.project.activeItem;
        if ((ac instanceof CompItem) == false) return ret;

        var prop = selectedProp(ac.selectedProperties);
        if (prop!=null)
        {
            var idx =0;
            var sh = null;
            if (prop.numKeys>0)
            {
                idx = prop.nearestKeyIndex(ac.time);
                sh = prop.keyValue(idx);
            }else{
                sh = prop.value;
            }
            if (sh != null)
            {

                sh = moveShape(sh,dir,v);
                if (sh==null) return ret;
                etCode.text = toStrFromShape(sh);
                //etCodeLine.text = toLineFromShape(sh);

                if(idx>=1)
                {
                    prop.setKeyValue(idx,sh);
                }else{
                    prop.setValue(sh);
                }
                ret = true;
            }

        }
        return ret;
    }
    //-------------------------------------------------------------------------
	winObj = ( me instanceof Panel) ? me : new Window("palette", scriptName, prefData.rect() ,{resizeable : true});
    winObj.onClose= savePref;
	//-------------------------------------------------------------------------
 	//-------------------------------------------------------------------------
    var createWindow = function()
    {
        var xp= 12;
        var yp = 12;
        btnGet = winObj.add("button", [  xp,   yp,   xp + 100,  yp + 23], "Get" );
        yp += 25;
        btnSet = winObj.add("button", [  xp,   yp,   xp + 100,  yp + 23], "Set" );
        yp += 25;
        btnNew = winObj.add("button", [  xp,   yp,   xp + 100,  yp + 23], "Init" );
        yp += 25;
        xp = 12;
        etValue = winObj.add("edittext", [ xp,   yp,  xp+ 100,   yp + 23], "2");
        yp += 25;
        xp = 12 +25;
        btnUp = winObj.add("button", [  xp,   yp,   xp + 50,   yp + 23], "Up" );
        yp += 25;
        xp = 12;
        btnLeft = winObj.add("button", [ xp, yp, xp + 50,   yp + 23], "Left" );
        xp += 50;
        btnRight = winObj.add("button", [ xp, yp, xp+ 50,   yp+ 23], "Right" );
        xp = 12 + 25;
        yp += 25;
        btnDown = winObj.add("button", [  xp,  yp,   xp + 50, yp + 23], "Down" );
        yp += 35;
        xp = 12;

        etScale = winObj.add("edittext", [ xp,   yp,  xp+ 100,   yp + 23], "1");
        yp += 25;
        cbScale = winObj.add("checkbox", [ xp,   yp,  xp+ 100,   yp + 23], "PathCenter");
        yp += 25;
        btnScale = winObj.add("button", [ xp,   yp,  xp+ 100,   yp + 23], "Scale");
        yp += 25+ 10;


        btnFunc1 = winObj.add("button", [ xp, yp,xp + 100, yp + 23], "Binarization" );
        yp += 25;
        btnFunc2 = winObj.add("button", [ xp, yp,xp + 100, yp + 23], "Binarization2" );
        yp += 25;
        btnFunc3 = winObj.add("button", [ xp, yp,xp + 100, yp + 23], "MirreerHor" );
        yp += 25;
        btnFunc4 = winObj.add("button", [ xp, yp,xp + 100, yp + 23], "MirreerVur" );
        yp += 25;
        btnFunc5 = winObj.add("button", [ xp, yp,xp + 100, yp + 23], "PointShift" );
        yp += 25;
        btnFunc6 = winObj.add("button", [ xp, yp,xp + 100, yp + 23], "PointUnshift" );
        //yp += 25;
        //btnFunc7 = winObj.add("button", [ xp, yp,xp + 100, yp + 23], "PointReverse" );
        xp = 12 + 100 + 5;
        yp = 12;
        etCodeLine = winObj.add("edittext", [ xp,yp,  540, yp+46], "", { multiline:true,readonly:true});
        yp += 50;
        etCode = winObj.add("edittext", [ xp,yp,  540, 390], "", { multiline:true, scrollable:true });

        etValue.text = prefData.addValue + "";
        cbScale.value = prefData.pathCenter;
        etScale.text = prefData.scale + "";
    }
    createWindow();
	//-------------------------------------------------------------------------
    var resize = function()
    {
        var b = winObj.bounds;
        var w = b[2] - b[0];
        var h = b[3] - b[1];
        var b2 = etCode.bounds;
        b2[2] = w -10;
        b2[3] = h -10;
        var b3 = etCodeLine.bounds;
        b3[2] = w -10;
    }
    resize();

    //-------------------------------------------------------------------------
    winObj.onResize = resize;
	//-------------------------------------------------------------------------
    etCode.onChanging = function()
    {
        try
        {
            if(etCode.text==""){
                etCodeLine.text = "";
                return;
            }
            var sh = eval(etCode.text);

            etCodeLine.text = toLineFromShape(sh);
        }catch(e){
            etCodeLine.text = "";
        }

    }
	//-------------------------------------------------------------------------
    btnNew.onClick = function()
    {
        var sh = {};
        sh.closed = false;
        sh.vertices = [[-100,0,],[100,0]];
        sh.inTangents = [[0,0,],[0,0]];
        sh.outTangents = [[0,0,],[0,0]];
        etCode.text = toStrFromShape(sh);
        //etCodeLine.text = toLineFromShape(sh);

    };
	//-------------------------------------------------------------------------
    btnGet.onClick = function()
    {
       var sh = getShapeLayer();
       if(sh==null)
       {
            alert("err");
            return;
       }
        etCode.text = toStrFromShape(sh);
        //etCodeLine.text = toLineFromShape(sh);
    };
	//-------------------------------------------------------------------------
    btnSet.onClick = function()
    {
       setShapeLayer();
    };
	//-------------------------------------------------------------------------
    btnUp.onClick = function()
    {
        var v = eval(etValue.text);
        moveShapeLayer(0,v);
    }
	//-------------------------------------------------------------------------
    btnRight.onClick = function()
    {
        var v = eval(etValue.text);
        moveShapeLayer(1,v);
    }
	//-------------------------------------------------------------------------
    btnDown.onClick = function()
    {
        var v = eval(etValue.text);
        moveShapeLayer(2,v);
    }
	//-------------------------------------------------------------------------
    btnLeft.onClick = function()
    {
        var v = eval(etValue.text);
        moveShapeLayer(3,v);
    }
    //-------------------------------------------------------------------------
    btnScale.onClick = function()
    {
        var o = eval(etCode.text);
        var v = eval(etScale.text);
        if((o != null)&&(v!=null) )
        {
            if (cbScale.value==true)
            {
                o = pointScaleCenter(o,v);
            }else{
                o = pointScale(o,v);
            }
            if( o != null)
            {
                etCode.text = toStrFromShape(o);
                setShapeLayer();
            }
        }
    };
	//-------------------------------------------------------------------------
    btnFunc1.onClick = function()
    {
        var o = eval(etCode.text);
        if(o != null)
        {
            o = binarization(o);
            if( o != null)
            {
                etCode.text = toStrFromShape(o);
                setShapeLayer();
            }
        }
    };
    //-------------------------------------------------------------------------
    btnFunc2.onClick = function()
    {
        var o = eval(etCode.text);
        if(o != null)
        {
            o = binarization2(o);
            if( o != null)
            {
                etCode.text = toStrFromShape(o);
                setShapeLayer();
            }
        }
    };
        //-------------------------------------------------------------------------
    btnFunc3.onClick = function()
    {
        var o = eval(etCode.text);
        if(o != null)
        {
            o = mirrerHor(o);
            if( o != null)
            {
                etCode.text = toStrFromShape(o);
                setShapeLayer();
            }
        }
    };
    //-------------------------------------------------------------------------
    btnFunc4.onClick = function()
    {
        var o = eval(etCode.text);
        if(o != null)
        {
            o = mirrerVur(o);
            if( o != null)
            {
                etCode.text = toStrFromShape(o);
                setShapeLayer();
            }
        }
    };
        //-------------------------------------------------------------------------
    btnFunc5.onClick = function()
    {
        var o = eval(etCode.text);
        if(o != null)
        {
            o = pointShift(o);
            if( o != null)
            {
                etCode.text = toStrFromShape(o);
                setShapeLayer();
            }
        }
    };
    //-------------------------------------------------------------------------
    btnFunc6.onClick = function()
    {
        var o = eval(etCode.text);
        if(o != null)
        {
            o = pointUnshift(o);
            if( o != null)
            {
                etCode.text = toStrFromShape(o);
                setShapeLayer();
            }
        }
    };
    /*
    //-------------------------------------------------------------------------
    btnFunc7.onClick = function()
    {
        var o = eval(etCode.text);
        if(o != null)
        {
            o = pointReverse(o);
            if( o != null)
            {
                etCode.text = toStrFromShape(o);
                setShapeLayer();
            }
        }
    };
    */
	//-------------------------------------------------------------------------
	if ( ( me instanceof Panel) == false)
    {
		winObj.center();
		winObj.show();
	}
	//-------------------------------------------------------------------------
})(this);