After Effects CS4�p�̃��C�u�����ubryful�v

���T�v
�X�N���v�g�쐬�⍲�̃��C�u�����ł��B
�܂��쐬�r���ł��B

���g����
"bryful"�t�H���_����Startup�t�H���_�ɃR�s�[���Ă��������B

AfterEffects�N����ɏ��p�l����"bryful's Lib install finished."�ƕ\��������
�����Ƀ��[�h����Ă��܂��B


bry-ful Hiroshi Furuhashi
2011/04/27

�ȉ��̊֐��E�N���X���g�p�ł��܂��B

//----------------------------------------------------------------------------
	bryful.args.jsxinc
//----------------------------------------------------------------------------
��bryful.args(arguments)
	�֐����ňȉ��̂悤�ɂ���΁A��������͂��ă����o�ϐ��Ɏ��[���܂��B

	var arg = new bryful.args(arguments);

//----------------------------------------------------------------------------
	bryful.comp.jsxinc
//----------------------------------------------------------------------------
��bryful.comp.addComp(name,width,height,pixelAspect,duration,frameRate)
	�R���|���쐬���܂��B
	�����͏_��Ɏg���܂��BFolderItem/CompItem/FootageItem�������Ɏg���܂��B

��bryful.comp.setFrame(cmp,frm);
	�R���|��duration���t���[�����Őݒ�ł��܂��B
	CompItem.setFrame(frm);
	�ł���
��bryful.comp.getFrame(cmp,frm);
	�R���|�̃t���[�������l�����܂��B
	var frm = CompItem.getFrame();
	�ł���
��bryful.comp.setDefSize(w,h,a,d,fr);
	bryful.comp.addComp�ŏȗ����ꂽ�p�����[�^�̃f�t�H���g�l��ݒ肵�܂�
	
��bryful.comp.setDefDuration(d);
	bryful.comp.addComp��duration�̃f�t�H���g�l��ݒ肵�܂�

//----------------------------------------------------------------------------
	bryful.file.jsxinc
//----------------------------------------------------------------------------
��bryful.file.pushD();
	���݂̃J�����g�t�H���_��push���܂��B

��bryful.file.popD();
	pushD()���ꂽ�t�H���_�֕��A���܂��B
	
��bryful.file.saveToTextFile(str,path)
	�������path�֕ۑ����܂��B
	
	String..saveToTextFile(path);
	�ł���

��bryful.file.loadFromTextFile(path);
	path�̃t�@�C����ǂݍ��݂܂��B

//----------------------------------------------------------------------------
	bryful.fld.jsxinc
//----------------------------------------------------------------------------
��bryful.fld.getPathArray(tItem)
	�w�肵��Item�̃t�H���_�ʒu���A������z��ŕԂ��܂��B

��bryful.fld.findFromFolderItem(folderItem,name,matchPatten)
	�w�肳�ꂽFoldetItem�̒�����Aname�̖��O��Item��T���Ĕz��̕Ԃ��܂��B
	matchPatten�ŁAItem�̎�ނ��w��ł��܂��B

��bryful.fld.findFromPathArray(ary)
	������z��Ŏw�肳�ꂽ�A�C�e����T���Ĕz��ŕԂ��܂��B

��bryful.fld.addFolderFromPathArray(ary, findFlag)
	������z��Ŏw�肳�ꂽ�t�H���_���쐬���܂��B
	findFlag��true�Ȃ瓯���t�H���_����������A�����Ԃ��܂��B
	false�Ȃ�A�V�������܂��B

��bryful.fld.addFolder
	������K���ɉ��߂��ăt�H���_���쐬���܂�
	
//----------------------------------------------------------------------------
	bryful.interate.jsxinc
//----------------------------------------------------------------------------

��bryful.iterate
	var loop = new bryful.iterate;
	�ėp�G���g���ł��B

//----------------------------------------------------------------------------
	bryful.items.jsxinc
//----------------------------------------------------------------------------
��bryful.items.getType(t)
	�w�肳�ꂽObject�̎��(�����萔)��Ԃ��܂��B

��bryful.items.getTypeName
	�w�肳�ꂽObject�̎��(������)��Ԃ��܂��B

��bryful.items.isMove
	footage��Movie�t�@�C���Ȃ�true

��bryful.items.isSequence
	footage���A�ԃt�@�C���Ȃ�true

��bryful.items.isType
	�w�肳�ꂽobject���w�肳�ꂽ���̂Ɠ����Ȃ�true

��bryful.items.matchType(array , matchPattern)
	�w�肳�ꂽ�z��̒��ŁAmatchPattern�Ɠ������̂�z��ŕԂ��܂��B

��bryful.items.activeItem
	 app.project.activeItem;�Ɠ����ł�

��bryful.items.activeComp
	�A�N�e�B�u��CompItem��Ԃ��܂��B
	
��bryful.items.activeFootage
	�A�N�e�B�u��FootageItem��Ԃ��܂��B

��bryful.items.activeFolder
	�A�N�e�B�u��FolderItem��Ԃ��܂��B

��bryful.items.activeMovie
	�A�N�e�B�u��Movie�t�@�C����FootageItem��Ԃ��܂��B
��bryful.items.activeSequence
	�A�N�e�B�u��Sequence�t�@�C����FootageItem��Ԃ��܂��B
��bryful.items.activeMvSeq
	�A�N�e�B�u��Movie��Sequence�t�@�C����FootageItem��Ԃ��܂��B
��bryful.items.activeStill
	�A�N�e�B�u�ȐÎ~��t�@�C����FootageItem��Ԃ��܂��B

//----------------------------------------------------------------------------
	bryful.path.jsxinc
//----------------------------------------------------------------------------
��bryful.path.trim()
	������̑O��̔��p�E���䕶�����폜���܂�

��bryful.path.getExt
	�����񂩂�g���q��؂�o���܂��B

��bryful.path.deleteLastSepa
	������Ō�̃p�X��؂蕶��(\/)���폜���܂��B
	
	
��bryful.path.lastSepaIndexOf
	������̖�������p�X��؂蕶����T���āA����index��Ԃ��܂�

��bryful.path.getParent
	�����񂩂�e�t�H���_�̃p�X�������؂�o���܂��B

��bryful.path.getFileName
	�����񂩂�t�@�C�����݂̂�؂�o���܂��B
��bryful.path.getFileNameWithoutExt
	�����񂩂�g���q���������t�@�C�����݂̂�؂�o���܂��B
��bryful.path.getFrameNmber
	�����񂩂�t���[���ԍ���؂�o���܂��B

��bryful.path.splitCutName
	��������e�v�f�ɕ������ĕԂ��܂��B
//----------------------------------------------------------------------------
	bryful.string.jsxinc
//----------------------------------------------------------------------------
��bryful.string.trim
	������̑O��̔��p�E���䕶�����폜���܂�

//----------------------------------------------------------------------------
	bryful.stringList
//----------------------------------------------------------------------------
��bryful.stringList
	�����񃊃X�g��Object�ł�
	var list = new bryful.stringList;

��bryful.stringList.trim
	������̑O��̔��p�E���䕶�����폜���܂�

��bryful.stringList.push
��bryful.stringList.add
	�����񃊃X�g�ɒǉ����܂�
��bryful.stringList.pop
	�����̕������؂�o���܂�

��bryful.stringList.remove
	�w�肳�ꂽindex�̗v�f���폜���܂�

��bryful.stringList.getItems
	�w�肳�ꂽindex�̗v�f���l�����܂�
��bryful.stringList.count
	���X�g�̗v�f����Ԃ��܂��B

��bryful.stringList.setText
	���X�g��Text�������܂��B�s���Ƀ��X�g������܂��B

��bryful.stringList.getText
	�V�X�g��1�̕�����Ƃ��ĕԂ��܂��B

��bryful.stringList.toString
	���X�g���J���}������̕�����ŕԂ��܂��B
