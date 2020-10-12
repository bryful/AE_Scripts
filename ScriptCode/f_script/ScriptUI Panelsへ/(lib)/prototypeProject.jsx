(function (){
//現在アクティブなコンポを返す
	Project.prototype.getActiveComp = function() {
		if (this.activeItem instanceof CompItem) return this.activeItem;
		else return null;
	}
	Project.prototype.getActiveLayer = function(cmp){
		var ret = null;
		var ac =null;
		if (cmp instanceof CompItem){
			ac = cmp;
		}else{
			ac = this.getActiveComp();
		}
		if(ac == null) return ret;
		var sel = ac.selectedLayers;
		if(sel.length>0)
		{
			ret = sel[0];
		}
		return ret;
	}
	//現在アクティブなフッテージを返す
	Project.prototype.getActiveFootage = function() {
		if (this.activeItem instanceof FootageItem) return this.activeItem;
		else return null;
	}
	//選択されているコンポを配列で返す。
	Project.prototype.getSelectedComp = function(){
		var s=this.selection;
		var ret = [];
		var c=s.length;
		if ( c>0)
			for(var i=0;i<c;i++)
				if (s[i] instanceof CompItem)
					ret.push(s[i]);
		return ret;
	}
	//選択されているフォルダアイテムを配列で返す。
	Project.prototype.getSelectedFolder = function(){
		var s=this.selection;
		var ret = [];
		var c=s.length;
		if ( c>0)
			for(var i=0;i<c;i++)
				if (s[i] instanceof FolderItem)
					ret.push(s[i]);
		return ret;
	}
	//選択されているフォルダを配列で返す。
	Project.prototype.getSelectedFootage = function(){
		var s=this.selection;
		var ret = [];
		var c=s.length;
		if ( c>0)
			for(var i=0;i<c;i++)
				if (s[i] instanceof FootageItem)
					ret.push(s[i]);
		return ret;
	}
	//現在選択されているプロパティを配列で返す。
	Project.prototype.selectedProperties = function(){
		var ret=[];
		var p = this.getActiveComp();
		if (p!=null){
			if (p.selectedLayers.length==1){
				ret = p.selectedLayers[0].selectedProperties;
			}
		}
		return ret;
	}
	//現在選択されているプロパティを配列で返す。
	Project.prototype.selectedProperty = function(){
		var ret=[];
		var p = this.getActiveComp();
		if (p!=null){
			if (p.selectedLayers.length==1){
				var pp = p.selectedLayers[0].selectedProperties;
				if(pp.length>0){
					for (var i=0; i<pp.length; i++)
					{
						if(pp[i] instanceof Property)
						{
							ret.push(pp[i]);
						}
					}
				}
			}
		}
		return ret;
	}
	//現在選択されているプロパティを配列で返す。
	Project.prototype.selectedPropertyGroup = function(){
		var ret=[];
		var p = this.getActiveComp();
		if (p!=null){
			if (p.selectedLayers.length==1){
				var pp = p.selectedLayers[0].selectedProperties;
				if(pp.length>0){
					for (var i=0; i<pp.length; i++)
					{
						if(pp[i] instanceof PropertyGroup)
						{
							ret.push(pp[i]);
						}
					}
				}
			}
		}
		return ret;
	}
	//現在選択されているレイヤを配列で返す。
	Project.prototype.selectedLayers = function(){
		var ret=[];
		var p=this.getActiveComp();
		if (p!=null){
			ret=p.selectedLayers;
		}
		return ret;
	}
	//フォルダーアイテム内のCompItemを獲得
	Project.prototype.getComp =
	FolderItem.prototype.getComp =
	function(){
		var ret=[];
			if(this.numItems>0){
				for(var i=1;i<=this.numItems;i++)
					if ( this.item(i).isComp()==true)
						ret.push(this.item(i));
			}
			return ret;
	}
	//フォルダーアイテム内のFootageItemを獲得
	Project.prototype.getFootage =
	FolderItem.prototype.getFootage =
	function(){
		var ret=[];
		if(this.numItems>0){
			for(var i=1;i<=this.numItems;i++)
				if ( this.item(i).isFootage()==true)
					ret.push(this.item(i));
		}
		return ret;
	}
	//フォルダーアイテム内のFolderItemを獲得
	Project.prototype.getFolderItem =
	FolderItem.prototype.getFolderItem =
	function(){
		var ret=[];
		if(this.numItems>0){
			for(var i=1;i<=this.numItems;i++)
				if ( this.item(i).isFolder()==true)
					ret.push(this.item(i));
		}
		return ret;
	}
	//フォルダーアイテム内の平面フッテージを獲得
	Project.prototype.getSolid =
	FolderItem.prototype.getSolid =
	function(){
		var ret=[];
		if(this.numItems>0){
			for(var i=1;i<=this.numItems;i++)
				if ( this.item(i).isSolid()==true)
					ret.push(this.item(i));
		}
		return ret;
	}

})();