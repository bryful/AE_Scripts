namespace dlg_compSizeSetting
{
	partial class Form1
	{
		/// <summary>
		/// 必要なデザイナー変数です。
		/// </summary>
		private System.ComponentModel.IContainer components = null;

		/// <summary>
		/// 使用中のリソースをすべてクリーンアップします。
		/// </summary>
		/// <param name="disposing">マネージド リソースを破棄する場合は true を指定し、その他の場合は false を指定します。</param>
		protected override void Dispose(bool disposing)
		{
			if (disposing && (components != null))
			{
				components.Dispose();
			}
			base.Dispose(disposing);
		}

		#region Windows フォーム デザイナーで生成されたコード

		/// <summary>
		/// デザイナー サポートに必要なメソッドです。このメソッドの内容を
		/// コード エディターで変更しないでください。
		/// </summary>
		private void InitializeComponent()
		{
			this.components = new System.ComponentModel.Container();
			this.ae_window1 = new bryful_due.Ae_window();
			this.btnGetCompSize = new bryful_due.Button_AE();
			this.plPrm = new bryful_due.Panel_AE();
			this.st1 = new bryful_due.Statictext_AE();
			this.edWidth = new bryful_due.Edittext_AE();
			this.edHeight = new bryful_due.Edittext_AE();
			this.st2 = new bryful_due.Statictext_AE();
			this.edFrameRate = new bryful_due.Edittext_AE();
			this.st3 = new bryful_due.Statictext_AE();
			this.edStartFrame = new bryful_due.Edittext_AE();
			this.st4 = new bryful_due.Statictext_AE();
			this.edDurarion = new bryful_due.Edittext_AE();
			this.statictext_AE1 = new bryful_due.Statictext_AE();
			this.btnClose = new bryful_due.Button_AE();
			this.btnApply = new bryful_due.Button_AE();
			this.btnApplyCLose = new bryful_due.Button_AE();
			this.rbPos0 = new bryful_due.Radiobutton_AE();
			this.rbPos1 = new bryful_due.Radiobutton_AE();
			this.rbPos2 = new bryful_due.Radiobutton_AE();
			this.rbPos3 = new bryful_due.Radiobutton_AE();
			this.rbPos4 = new bryful_due.Radiobutton_AE();
			this.rbPos5 = new bryful_due.Radiobutton_AE();
			this.rbPos6 = new bryful_due.Radiobutton_AE();
			this.rbPos7 = new bryful_due.Radiobutton_AE();
			this.rbPos8 = new bryful_due.Radiobutton_AE();
			this.plPrm.SuspendLayout();
			this.SuspendLayout();
			// 
			// ae_window1
			// 
			this.ae_window1.AE_Form = this;
			this.ae_window1.AE_funcName = "myDialog";
			this.ae_window1.AE_isCenter = true;
			this.ae_window1.AE_isExportPict = true;
			this.ae_window1.AE_isInFunc = true;
			this.ae_window1.AE_isLocal = true;
			this.ae_window1.AE_maximizeButton = false;
			this.ae_window1.AE_minimizeButton = false;
			this.ae_window1.AE_objName = "winObj";
			this.ae_window1.AE_resizeable = false;
			this.ae_window1.AE_size = new System.Drawing.Size(343, 216);
			this.ae_window1.AE_title = "CompSettings";
			this.ae_window1.AE_windowType = bryful_due.windowType.paletet;
			// 
			// btnGetCompSize
			// 
			this.btnGetCompSize.AE_bounds = new System.Drawing.Rectangle(203, 114, 102, 23);
			this.btnGetCompSize.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnGetCompSize.AE_isLocal = true;
			this.btnGetCompSize.AE_objName = "btnGetCompSize";
			this.btnGetCompSize.AE_text = "get Comp Size";
			this.btnGetCompSize.AE_textObjName = "";
			this.btnGetCompSize.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnGetCompSize.Location = new System.Drawing.Point(203, 114);
			this.btnGetCompSize.Name = "btnGetCompSize";
			this.btnGetCompSize.Size = new System.Drawing.Size(102, 23);
			this.btnGetCompSize.TabIndex = 0;
			this.btnGetCompSize.Text = "get Comp Size";
			this.btnGetCompSize.UseVisualStyleBackColor = true;
			// 
			// plPrm
			// 
			this.plPrm.AE_borderStyle = bryful_due.borderStyle.etched;
			this.plPrm.AE_bounds = new System.Drawing.Rectangle(12, 12, 311, 145);
			this.plPrm.AE_isLocal = true;
			this.plPrm.AE_objName = "plPrm";
			this.plPrm.AE_text = "パラメータ";
			this.plPrm.AE_textObjName = "";
			this.plPrm.Controls.Add(this.rbPos8);
			this.plPrm.Controls.Add(this.rbPos7);
			this.plPrm.Controls.Add(this.rbPos6);
			this.plPrm.Controls.Add(this.rbPos5);
			this.plPrm.Controls.Add(this.btnGetCompSize);
			this.plPrm.Controls.Add(this.rbPos4);
			this.plPrm.Controls.Add(this.rbPos3);
			this.plPrm.Controls.Add(this.rbPos2);
			this.plPrm.Controls.Add(this.rbPos1);
			this.plPrm.Controls.Add(this.rbPos0);
			this.plPrm.Controls.Add(this.edDurarion);
			this.plPrm.Controls.Add(this.statictext_AE1);
			this.plPrm.Controls.Add(this.edStartFrame);
			this.plPrm.Controls.Add(this.st4);
			this.plPrm.Controls.Add(this.edFrameRate);
			this.plPrm.Controls.Add(this.st3);
			this.plPrm.Controls.Add(this.edHeight);
			this.plPrm.Controls.Add(this.st2);
			this.plPrm.Controls.Add(this.edWidth);
			this.plPrm.Controls.Add(this.st1);
			this.plPrm.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.plPrm.Location = new System.Drawing.Point(12, 12);
			this.plPrm.Name = "plPrm";
			this.plPrm.Size = new System.Drawing.Size(311, 145);
			this.plPrm.TabIndex = 1;
			this.plPrm.TabStop = false;
			this.plPrm.Text = "パラメータ";
			// 
			// st1
			// 
			this.st1.AE_bounds = new System.Drawing.Rectangle(34, 21, 40, 23);
			this.st1.AE_isLocal = true;
			this.st1.AE_multiline = false;
			this.st1.AE_objName = "st1";
			this.st1.AE_scrolling = false;
			this.st1.AE_text = "width";
			this.st1.AE_textObjName = "";
			this.st1.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.st1.Location = new System.Drawing.Point(34, 21);
			this.st1.Name = "st1";
			this.st1.Size = new System.Drawing.Size(40, 23);
			this.st1.TabIndex = 0;
			this.st1.Text = "width";
			// 
			// edWidth
			// 
			this.edWidth.AE_borderless = false;
			this.edWidth.AE_bounds = new System.Drawing.Rectangle(89, 18, 100, 21);
			this.edWidth.AE_isLocal = true;
			this.edWidth.AE_multiline = false;
			this.edWidth.AE_noecho = false;
			this.edWidth.AE_objName = "edWidth";
			this.edWidth.AE_readonly = false;
			this.edWidth.AE_scrollable = false;
			this.edWidth.AE_text = new string[] {
        "1920"};
			this.edWidth.AE_textObjName = "";
			this.edWidth.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edWidth.Location = new System.Drawing.Point(89, 18);
			this.edWidth.Name = "edWidth";
			this.edWidth.Size = new System.Drawing.Size(100, 21);
			this.edWidth.TabIndex = 1;
			this.edWidth.Text = "1920";
			// 
			// edHeight
			// 
			this.edHeight.AE_borderless = false;
			this.edHeight.AE_bounds = new System.Drawing.Rectangle(89, 45, 100, 21);
			this.edHeight.AE_isLocal = true;
			this.edHeight.AE_multiline = false;
			this.edHeight.AE_noecho = false;
			this.edHeight.AE_objName = "edHeight";
			this.edHeight.AE_readonly = false;
			this.edHeight.AE_scrollable = false;
			this.edHeight.AE_text = new string[] {
        "1080"};
			this.edHeight.AE_textObjName = "";
			this.edHeight.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edHeight.Location = new System.Drawing.Point(89, 45);
			this.edHeight.Name = "edHeight";
			this.edHeight.Size = new System.Drawing.Size(100, 21);
			this.edHeight.TabIndex = 3;
			this.edHeight.Text = "1080";
			// 
			// st2
			// 
			this.st2.AE_bounds = new System.Drawing.Rectangle(34, 48, 40, 23);
			this.st2.AE_isLocal = true;
			this.st2.AE_multiline = false;
			this.st2.AE_objName = "st2";
			this.st2.AE_scrolling = false;
			this.st2.AE_text = "Height";
			this.st2.AE_textObjName = "";
			this.st2.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.st2.Location = new System.Drawing.Point(34, 48);
			this.st2.Name = "st2";
			this.st2.Size = new System.Drawing.Size(40, 23);
			this.st2.TabIndex = 2;
			this.st2.Text = "Height";
			// 
			// edFrameRate
			// 
			this.edFrameRate.AE_borderless = false;
			this.edFrameRate.AE_bounds = new System.Drawing.Rectangle(90, 86, 49, 21);
			this.edFrameRate.AE_isLocal = true;
			this.edFrameRate.AE_multiline = false;
			this.edFrameRate.AE_noecho = false;
			this.edFrameRate.AE_objName = "edFrameRate";
			this.edFrameRate.AE_readonly = false;
			this.edFrameRate.AE_scrollable = false;
			this.edFrameRate.AE_text = new string[] {
        "24"};
			this.edFrameRate.AE_textObjName = "";
			this.edFrameRate.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edFrameRate.Location = new System.Drawing.Point(90, 86);
			this.edFrameRate.Name = "edFrameRate";
			this.edFrameRate.Size = new System.Drawing.Size(49, 21);
			this.edFrameRate.TabIndex = 5;
			this.edFrameRate.Text = "24";
			// 
			// st3
			// 
			this.st3.AE_bounds = new System.Drawing.Rectangle(7, 84, 68, 23);
			this.st3.AE_isLocal = true;
			this.st3.AE_multiline = false;
			this.st3.AE_objName = "st3";
			this.st3.AE_scrolling = false;
			this.st3.AE_text = "FrameRate";
			this.st3.AE_textObjName = "";
			this.st3.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.st3.Location = new System.Drawing.Point(7, 84);
			this.st3.Name = "st3";
			this.st3.Size = new System.Drawing.Size(68, 23);
			this.st3.TabIndex = 4;
			this.st3.Text = "FrameRate";
			// 
			// edStartFrame
			// 
			this.edStartFrame.AE_borderless = false;
			this.edStartFrame.AE_bounds = new System.Drawing.Rectangle(209, 86, 47, 21);
			this.edStartFrame.AE_isLocal = true;
			this.edStartFrame.AE_multiline = false;
			this.edStartFrame.AE_noecho = false;
			this.edStartFrame.AE_objName = "edStartFrame";
			this.edStartFrame.AE_readonly = false;
			this.edStartFrame.AE_scrollable = false;
			this.edStartFrame.AE_text = new string[] {
        "1"};
			this.edStartFrame.AE_textObjName = "";
			this.edStartFrame.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edStartFrame.Location = new System.Drawing.Point(209, 86);
			this.edStartFrame.Name = "edStartFrame";
			this.edStartFrame.Size = new System.Drawing.Size(47, 21);
			this.edStartFrame.TabIndex = 7;
			this.edStartFrame.Text = "1";
			// 
			// st4
			// 
			this.st4.AE_bounds = new System.Drawing.Rectangle(145, 84, 68, 23);
			this.st4.AE_isLocal = true;
			this.st4.AE_multiline = false;
			this.st4.AE_objName = "st4";
			this.st4.AE_scrolling = false;
			this.st4.AE_text = "StartFrame";
			this.st4.AE_textObjName = "";
			this.st4.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.st4.Location = new System.Drawing.Point(145, 84);
			this.st4.Name = "st4";
			this.st4.Size = new System.Drawing.Size(68, 23);
			this.st4.TabIndex = 6;
			this.st4.Text = "StartFrame";
			// 
			// edDurarion
			// 
			this.edDurarion.AE_borderless = false;
			this.edDurarion.AE_bounds = new System.Drawing.Rectangle(91, 114, 81, 21);
			this.edDurarion.AE_isLocal = true;
			this.edDurarion.AE_multiline = false;
			this.edDurarion.AE_noecho = false;
			this.edDurarion.AE_objName = "edDurarion";
			this.edDurarion.AE_readonly = false;
			this.edDurarion.AE_scrollable = false;
			this.edDurarion.AE_text = new string[] {
        "144"};
			this.edDurarion.AE_textObjName = "";
			this.edDurarion.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.edDurarion.Location = new System.Drawing.Point(91, 114);
			this.edDurarion.Name = "edDurarion";
			this.edDurarion.Size = new System.Drawing.Size(81, 21);
			this.edDurarion.TabIndex = 9;
			this.edDurarion.Text = "144";
			// 
			// statictext_AE1
			// 
			this.statictext_AE1.AE_bounds = new System.Drawing.Rectangle(6, 118, 96, 23);
			this.statictext_AE1.AE_isLocal = true;
			this.statictext_AE1.AE_multiline = false;
			this.statictext_AE1.AE_objName = "st5";
			this.statictext_AE1.AE_scrolling = false;
			this.statictext_AE1.AE_text = "Duration(Frame)";
			this.statictext_AE1.AE_textObjName = "";
			this.statictext_AE1.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.statictext_AE1.Location = new System.Drawing.Point(6, 118);
			this.statictext_AE1.Name = "statictext_AE1";
			this.statictext_AE1.Size = new System.Drawing.Size(96, 23);
			this.statictext_AE1.TabIndex = 8;
			this.statictext_AE1.Text = "Duration(Frame)";
			// 
			// btnClose
			// 
			this.btnClose.AE_bounds = new System.Drawing.Rectangle(12, 179, 75, 23);
			this.btnClose.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnClose.AE_isLocal = true;
			this.btnClose.AE_objName = "btnClose";
			this.btnClose.AE_text = "Close";
			this.btnClose.AE_textObjName = "";
			this.btnClose.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnClose.Location = new System.Drawing.Point(12, 179);
			this.btnClose.Name = "btnClose";
			this.btnClose.Size = new System.Drawing.Size(75, 23);
			this.btnClose.TabIndex = 2;
			this.btnClose.Text = "Close";
			this.btnClose.UseVisualStyleBackColor = true;
			// 
			// btnApply
			// 
			this.btnApply.AE_bounds = new System.Drawing.Rectangle(126, 163, 75, 39);
			this.btnApply.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnApply.AE_isLocal = true;
			this.btnApply.AE_objName = "btnApply";
			this.btnApply.AE_text = "Apply";
			this.btnApply.AE_textObjName = "";
			this.btnApply.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnApply.Location = new System.Drawing.Point(126, 163);
			this.btnApply.Name = "btnApply";
			this.btnApply.Size = new System.Drawing.Size(75, 39);
			this.btnApply.TabIndex = 3;
			this.btnApply.Text = "Apply";
			this.btnApply.UseVisualStyleBackColor = true;
			// 
			// btnApplyCLose
			// 
			this.btnApplyCLose.AE_bounds = new System.Drawing.Rectangle(215, 163, 92, 39);
			this.btnApplyCLose.AE_defaultElement = bryful_due.defaultElement.none;
			this.btnApplyCLose.AE_isLocal = true;
			this.btnApplyCLose.AE_objName = "btnApplyCLose";
			this.btnApplyCLose.AE_text = "ApplyAndClose";
			this.btnApplyCLose.AE_textObjName = "";
			this.btnApplyCLose.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.btnApplyCLose.Location = new System.Drawing.Point(215, 163);
			this.btnApplyCLose.Name = "btnApplyCLose";
			this.btnApplyCLose.Size = new System.Drawing.Size(92, 39);
			this.btnApplyCLose.TabIndex = 4;
			this.btnApplyCLose.Text = "ApplyAndClose";
			this.btnApplyCLose.UseVisualStyleBackColor = true;
			// 
			// rbPos0
			// 
			this.rbPos0.AE_bounds = new System.Drawing.Rectangle(220, 10, 20, 20);
			this.rbPos0.AE_isLocal = true;
			this.rbPos0.AE_objName = "rbPos0";
			this.rbPos0.AE_text = "";
			this.rbPos0.AE_textObjName = "";
			this.rbPos0.AE_value = false;
			this.rbPos0.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.rbPos0.Location = new System.Drawing.Point(220, 10);
			this.rbPos0.Name = "rbPos0";
			this.rbPos0.Size = new System.Drawing.Size(20, 20);
			this.rbPos0.TabIndex = 10;
			this.rbPos0.TabStop = true;
			this.rbPos0.UseVisualStyleBackColor = true;
			// 
			// rbPos1
			// 
			this.rbPos1.AE_bounds = new System.Drawing.Rectangle(240, 30, 20, 20);
			this.rbPos1.AE_isLocal = true;
			this.rbPos1.AE_objName = "rbPos1";
			this.rbPos1.AE_text = "";
			this.rbPos1.AE_textObjName = "";
			this.rbPos1.AE_value = false;
			this.rbPos1.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.rbPos1.Location = new System.Drawing.Point(240, 30);
			this.rbPos1.Name = "rbPos1";
			this.rbPos1.Size = new System.Drawing.Size(20, 20);
			this.rbPos1.TabIndex = 11;
			this.rbPos1.TabStop = true;
			this.rbPos1.UseVisualStyleBackColor = true;
			// 
			// rbPos2
			// 
			this.rbPos2.AE_bounds = new System.Drawing.Rectangle(260, 10, 20, 20);
			this.rbPos2.AE_isLocal = true;
			this.rbPos2.AE_objName = "rbPos2";
			this.rbPos2.AE_text = "";
			this.rbPos2.AE_textObjName = "";
			this.rbPos2.AE_value = false;
			this.rbPos2.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.rbPos2.Location = new System.Drawing.Point(260, 10);
			this.rbPos2.Name = "rbPos2";
			this.rbPos2.Size = new System.Drawing.Size(20, 20);
			this.rbPos2.TabIndex = 12;
			this.rbPos2.TabStop = true;
			this.rbPos2.UseVisualStyleBackColor = true;
			// 
			// rbPos3
			// 
			this.rbPos3.AE_bounds = new System.Drawing.Rectangle(220, 30, 20, 20);
			this.rbPos3.AE_isLocal = true;
			this.rbPos3.AE_objName = "rbPos3";
			this.rbPos3.AE_text = "";
			this.rbPos3.AE_textObjName = "";
			this.rbPos3.AE_value = false;
			this.rbPos3.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.rbPos3.Location = new System.Drawing.Point(220, 30);
			this.rbPos3.Name = "rbPos3";
			this.rbPos3.Size = new System.Drawing.Size(20, 20);
			this.rbPos3.TabIndex = 13;
			this.rbPos3.TabStop = true;
			this.rbPos3.UseVisualStyleBackColor = true;
			// 
			// rbPos4
			// 
			this.rbPos4.AE_bounds = new System.Drawing.Rectangle(240, 10, 20, 20);
			this.rbPos4.AE_isLocal = true;
			this.rbPos4.AE_objName = "rbPos4";
			this.rbPos4.AE_text = "";
			this.rbPos4.AE_textObjName = "";
			this.rbPos4.AE_value = false;
			this.rbPos4.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.rbPos4.Location = new System.Drawing.Point(240, 10);
			this.rbPos4.Name = "rbPos4";
			this.rbPos4.Size = new System.Drawing.Size(20, 20);
			this.rbPos4.TabIndex = 14;
			this.rbPos4.TabStop = true;
			this.rbPos4.UseVisualStyleBackColor = true;
			// 
			// rbPos5
			// 
			this.rbPos5.AE_bounds = new System.Drawing.Rectangle(260, 30, 20, 20);
			this.rbPos5.AE_isLocal = true;
			this.rbPos5.AE_objName = "rbPos5";
			this.rbPos5.AE_text = "";
			this.rbPos5.AE_textObjName = "";
			this.rbPos5.AE_value = false;
			this.rbPos5.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.rbPos5.Location = new System.Drawing.Point(260, 30);
			this.rbPos5.Name = "rbPos5";
			this.rbPos5.Size = new System.Drawing.Size(20, 20);
			this.rbPos5.TabIndex = 15;
			this.rbPos5.TabStop = true;
			this.rbPos5.UseVisualStyleBackColor = true;
			// 
			// rbPos6
			// 
			this.rbPos6.AE_bounds = new System.Drawing.Rectangle(220, 50, 20, 20);
			this.rbPos6.AE_isLocal = true;
			this.rbPos6.AE_objName = "rbPos6";
			this.rbPos6.AE_text = "";
			this.rbPos6.AE_textObjName = "";
			this.rbPos6.AE_value = false;
			this.rbPos6.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.rbPos6.Location = new System.Drawing.Point(220, 50);
			this.rbPos6.Name = "rbPos6";
			this.rbPos6.Size = new System.Drawing.Size(20, 20);
			this.rbPos6.TabIndex = 16;
			this.rbPos6.TabStop = true;
			this.rbPos6.UseVisualStyleBackColor = true;
			// 
			// rbPos7
			// 
			this.rbPos7.AE_bounds = new System.Drawing.Rectangle(240, 50, 20, 20);
			this.rbPos7.AE_isLocal = true;
			this.rbPos7.AE_objName = "rbPos7";
			this.rbPos7.AE_text = "";
			this.rbPos7.AE_textObjName = "";
			this.rbPos7.AE_value = false;
			this.rbPos7.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.rbPos7.Location = new System.Drawing.Point(240, 50);
			this.rbPos7.Name = "rbPos7";
			this.rbPos7.Size = new System.Drawing.Size(20, 20);
			this.rbPos7.TabIndex = 17;
			this.rbPos7.TabStop = true;
			this.rbPos7.UseVisualStyleBackColor = true;
			// 
			// rbPos8
			// 
			this.rbPos8.AE_bounds = new System.Drawing.Rectangle(260, 50, 20, 20);
			this.rbPos8.AE_isLocal = true;
			this.rbPos8.AE_objName = "rbPos8";
			this.rbPos8.AE_text = "";
			this.rbPos8.AE_textObjName = "";
			this.rbPos8.AE_value = false;
			this.rbPos8.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.rbPos8.Location = new System.Drawing.Point(260, 50);
			this.rbPos8.Name = "rbPos8";
			this.rbPos8.Size = new System.Drawing.Size(20, 20);
			this.rbPos8.TabIndex = 18;
			this.rbPos8.TabStop = true;
			this.rbPos8.UseVisualStyleBackColor = true;
			// 
			// Form1
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(343, 216);
			this.Controls.Add(this.btnApplyCLose);
			this.Controls.Add(this.btnApply);
			this.Controls.Add(this.btnClose);
			this.Controls.Add(this.plPrm);
			this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.SizableToolWindow;
			this.MaximizeBox = false;
			this.MinimizeBox = false;
			this.Name = "Form1";
			this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
			this.Text = "CompSettings";
			this.plPrm.ResumeLayout(false);
			this.plPrm.PerformLayout();
			this.ResumeLayout(false);

		}

		#endregion

		private bryful_due.Ae_window ae_window1;
		private bryful_due.Button_AE btnApplyCLose;
		private bryful_due.Button_AE btnApply;
		private bryful_due.Button_AE btnClose;
		private bryful_due.Panel_AE plPrm;
		private bryful_due.Edittext_AE edDurarion;
		private bryful_due.Statictext_AE statictext_AE1;
		private bryful_due.Edittext_AE edStartFrame;
		private bryful_due.Statictext_AE st4;
		private bryful_due.Edittext_AE edFrameRate;
		private bryful_due.Statictext_AE st3;
		private bryful_due.Edittext_AE edHeight;
		private bryful_due.Statictext_AE st2;
		private bryful_due.Edittext_AE edWidth;
		private bryful_due.Statictext_AE st1;
		private bryful_due.Button_AE btnGetCompSize;
		private bryful_due.Radiobutton_AE rbPos8;
		private bryful_due.Radiobutton_AE rbPos7;
		private bryful_due.Radiobutton_AE rbPos6;
		private bryful_due.Radiobutton_AE rbPos5;
		private bryful_due.Radiobutton_AE rbPos4;
		private bryful_due.Radiobutton_AE rbPos3;
		private bryful_due.Radiobutton_AE rbPos2;
		private bryful_due.Radiobutton_AE rbPos1;
		private bryful_due.Radiobutton_AE rbPos0;
	}
}

