function layerOrder()
{
	var title = "レイヤ並べ";
	var targetComp = null;
	var layerArray = new Array;
	var layerEdit = new Array;
	var layerFrame = new Array;
	var layerSeq = new Array;
	var frameCount = 0;
	var dlg = null;
	
	//--------------------------------------
	function timeToSec(t)
	{
		var sec = Math.floor(t);
		var frm = Math.round( (t-sec) * targetComp.frameRate );
		
		return sec + "+" + frm;
	}
	//--------------------------------------
	function secToFrame(s)
	{
		if (s =="") {
			return 0;
		}
	
		var sa = s.split("+");
		if ( sa.length ==1){
			return sa[0] *1;
		}else{
			return Math.round(sa[0] * targetComp.frameRate) + (sa[1] * 1);
		}
	}
	//--------------------------------------
	function getLayers()
	{
		layerFrame = new Array;
		layerArray = new Array;
		targetComp = null;
		frameCount = 0;

		if ( app.project.activeItem == null) return false;
		if ( ( app.project.activeItem instanceof CompItem) == false ) return false;
	
		var cmp = app.project.activeItem;
		if ( cmp.numLayers <=0 ) return;
		
		for( var i=1; i<=cmp.numLayers; i++)
		{
			if ( cmp.layer(i).source.file != null ) {
				layerArray.push(cmp.layer(i));
			}
		}
		
		targetComp = cmp;
		return (layerArray.length>0);
	}
	//--------------------------------------
	function getParams()
	{
		layerFrame = new Array;
		frameCount = 0;
		if (layerEdit.length<=0) return false;
		
		for (var i=0; i<layerEdit.length; i++){
			var frm = secToFrame(layerEdit[i].text);
			layerFrame.push(frm);
			frameCount += frm;
		}
		return true;
	}
	//-----------------------------------------------
	function isSequece(ftg)
	{
		var ret = false;
		if (ftg == null) return ret;
		if ( ftg instanceof FootageItem) {
			if (ftg.file != null){
				if ( ftg.mainSource.isStill == false) ret = true;
			}
		}
		
		return ret;
	}
	//--------------------------------------
	function go()
	{
		app.beginUndoGroup("レイヤ並べ");
		targetComp.duration = frameCount / targetComp.frameRate;
		
		var pos = 0;
		for (var i=0; i<layerArray.length; i++){
			var ip =layerArray[i].inPoint;
			var op =layerArray[i].outPoint;
			var st = layerArray[i].startTime;
			var du = layerFrame[i] / targetComp.frameRate;
			var offset = ip - st;
			
			layerArray[i].startTime = pos - offset;
			layerArray[i].inPoint = pos;
			pos += du;
			layerArray[i].outPoint = pos;
		
		}
		app.endUndoGroup();
	}
	//--------------------------------------
	function buildDialog()
	{
		var left = 5;
		var top = 5;
		var btnW = 60;
		var btnH = 20;
		var stW	= 200;
		var stH	= 20;
		var edW	= 50;
		dlg = new Window("dialog",title,[0,0,350,300]);

		var x0;
		var x1;
		var y0;
		var y1;

		if ( layerArray.length>0) {
		
			for ( var i=0; i<layerArray.length; i++){
				x0 = left;
				x1 = x0 + stW;
				y0 = (stH + 2) * i + top;
				y1 = y0 + stH;
				var st = dlg.add("statictext", [x0,y0,x1,y1 ], layerArray[i].name);
				st.justify="right";
				st.alignment  ="center";
				x0 = x1 + 2;
				x1 = x0 + edW;
				var isS = isSequece(layerArray[i].source);
				var du = layerArray[i].outPoint - layerArray[i].inPoint;
				var ed = dlg.add("edittext", [x0,y0,x1,y1 ], timeToSec(du));
				ed.justify="right";
				ed.alignment  ="center";
				ed.enabled = !isS;
				layerEdit.push( ed );
				layerSeq.push(isS);
			}
		
		}

		x0 = left;
		x1 = x0 + btnW;
		y0 = y1 + 5;
		y1 = y0 + btnH;
		var okBtn    	= dlg.add("button", [ x0, y0, x1, y1], "OK",     {name:'ok'} );
		x0 = x0 + btnW +5;
		x1 = x0 + btnW;
		var cancelBtn	= dlg.add("button", [ x0, y0, x1, y1], "Cancel", {name:'cancel'});

		dlg.center();
		return dlg.show();

	}
	//--------------------------------------
	
	this.exec = function()
	{
		if ( getLayers()==false){
			alert("コンポを選択してください");
			return;
		}
		while (true){
			var r = buildDialog();
			//showの戻り値が１ならOKボタンが押された
			if (r==1){
				if ( getParams() == true){
					go();
					return true;
				}
			}else{
				return false;
			}
		}
	}
}

var lo = new layerOrder();
lo.exec();

