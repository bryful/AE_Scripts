(function(){/*	$SAVEPATHは、獲得したリマップデータをセーブする場所。	cellRemapは、このファイルが作成されるのを待ち、作成終わっていたタイミングで読み込む。		 $INDEXはターゲットとなるセルレイヤのインデックス番号（０スタート）*/
	var savePath = "$SAVEPATH";
	//var savePath = "d:/aaa.json";
	var cellData ={
		mode:0,
		//index : 0,
		index : $INDEX,
		inFrame:-1,
		outFrame:-1,
		frameRate :24,
		cell:[],
	}

	//--------------------------------------------------
	var save = function()
	{
		var js = cellData.toSource();
		var f = new File(savePath);
		try{
			if ( f.exists === true) f.remove();
			f.open("w");
			f.write(js);
		}catch(e){
			alert("getRemap\n" +e.toString());
		}finally{
			f.close();
		}	}

	//--------------------------------------------------
	var getRemap = function(lyr,fps)
	{
		var rd = [];
		if ( lyr.canSetTimeRemapEnabled == true) {
			var rp = lyr.property("ADBE Time Remapping");
			if ( rp.numKeys<=0){
				var dd = [];
				dd.push(0);
				if ( rp.value == rp.maxValue){
					dd.push(0);
				}else{
					dd.push( Math.round(rp.value * fps) +1);
				}
				rd.push(dd);
			}else{
				for ( var i=1; i<=rp.numKeys;i++){
					var dd = [];
					dd.push (  Math.round(rp.keyTime(i) * fps));
					var v = rp.keyValue(i)
					if ( v == rp.maxValue){
						dd.push(0);
					}else{
						dd.push( Math.round(v * fps) +1);
					}
					rd.push(dd);
				}
			}
		}
		cellData.inFrame = Math.round(lyr.inPoint * fps);
		cellData.outFrame = Math.round(lyr.outPoint * fps);
		cellData.cell = rd;
		return rd;
	}
	//--------------------------------------------------
	var exec = function()
	{
		var err = "";
		var cnt = 0;
		if (app.project.activeItem instanceof CompItem){
			cellData.frameRate = app.project.activeItem.frameRate;
			if ( app.project.activeItem.selectedLayers.length === 1){
				cellData.cell = getRemap(app.project.activeItem.selectedLayers[0],app.project.activeItem.frameRate);
				if ( cellData.cell.length<=0){
					err += "none TimeRemap!\r\n";
				}else{
					save();
				}
			}else{
				err += "layer selection 1 onlyl!\r\n";
			}
			
		}else{
			err += "please active comp!\r\n";
		}
		if (err !=""){
			alert(err);
		}
	}	
	//--------------------------------------------------
	exec();
})();