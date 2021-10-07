
namespace dlg_Test3
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
			this.button_AE1 = new bryful_due.Button_AE();
			this.ae_window1 = new bryful_due.Ae_window();
			this.SuspendLayout();
			// 
			// button_AE1
			// 
			this.button_AE1.AE_bounds = new System.Drawing.Rectangle(49, 27, 75, 23);
			this.button_AE1.AE_defaultElement = bryful_due.defaultElement.none;
			this.button_AE1.AE_isLocal = true;
			this.button_AE1.AE_objName = "button_AE1";
			this.button_AE1.AE_text = "button_AE1";
			this.button_AE1.AE_textObjName = "";
			this.button_AE1.Font = new System.Drawing.Font("Tahoma", 8.25F);
			this.button_AE1.Location = new System.Drawing.Point(49, 27);
			this.button_AE1.Name = "button_AE1";
			this.button_AE1.Size = new System.Drawing.Size(75, 23);
			this.button_AE1.TabIndex = 0;
			this.button_AE1.Text = "button_AE1";
			this.button_AE1.UseVisualStyleBackColor = true;
			// 
			// ae_window1
			// 
			this.ae_window1.AE_Form = this;
			this.ae_window1.AE_funcName = "myDialog";
			this.ae_window1.AE_isCenter = true;
			this.ae_window1.AE_isExportPict = true;
			this.ae_window1.AE_isInFunc = true;
			this.ae_window1.AE_isLocal = true;
			this.ae_window1.AE_maximizeButton = true;
			this.ae_window1.AE_minimizeButton = true;
			this.ae_window1.AE_objName = "winObj";
			this.ae_window1.AE_resizeable = false;
			this.ae_window1.AE_size = new System.Drawing.Size(189, 97);
			this.ae_window1.AE_title = "Form1";
			this.ae_window1.AE_windowType = bryful_due.windowType.paletet;
			// 
			// Form1
			// 
			this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
			this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
			this.ClientSize = new System.Drawing.Size(189, 97);
			this.Controls.Add(this.button_AE1);
			this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.SizableToolWindow;
			this.Name = "Form1";
			this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
			this.Text = "Form1";
			this.ResumeLayout(false);

		}

		#endregion

		private bryful_due.Button_AE button_AE1;
		private bryful_due.Ae_window ae_window1;
	}
}

