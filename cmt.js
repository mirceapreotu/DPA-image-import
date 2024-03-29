/**
 * @desc Settings here
 */
var d = new Date();
var uploadFilename=d.getTime();


/**
 * @desc Image download class
 */
var cmtSaveImage = new Class({
    Implements: [Options, Events],
    options: {
			url: '/path/to/dpa.php',
			onSave: Class.empty,
			type: 'jpeg',
			username: '',
			challenge: '',
			path: '',
			ajaxActionId: 'ajax-action',
			filename: uploadFilename
    },

    // reference to the canvas element
    canvasEl: null,

    // reference to the save button
    saveEl: null,

    // reference to the canvas context
    canvasCtx: null,

    // height and width of the canvas element
    height: 0,

    width: 0,
    // Element where to display the progression of the upload

    ajaxAction: null,


		initialize: function(canvasEl, saveEl, options){
			// init
			var self=this;
			self.setOptions(options);
			self.canvasEl = $(canvasEl);
			self.saveEl = $(saveEl);
			
			if (!self.canvasEl) {
				alert ('cmtSaveImage: div with id \''+canvasEl+'\' not found.');
				return;
			}
			if (!self.saveEl) {
				alert ('cmtSaveImage: div with id \''+saveEl+'\' not found.');
				return;
			}
			this.ajaxAction = $(this.options.ajaxActionId);
			this.canvasCtx = self.canvasEl.getContext('2d');
			
			// buttons
			self.saveEl.addEvent('click', function(){
				this.save(this.options.type);
			}.bind(this));
		},

    save: function(type) {
			var xhr = new XMLHttpRequest(),
			fileUpload = xhr.upload,
			self = this,
			boundary = 'multipartformboundary' + (new Date).getTime();

			// ajax action element init
			self.ajaxAction.set('text', 'saving picture: 0%').morph('.show');
			
			// add event listeners to track the progression of the upload
			fileUpload.addEventListener("progress", function(event){
				var progress=Math.round((event.loaded * 100) / event.total);
				self.ajaxAction.set('text', 'saving picture: '+progress+'%');
			}, false);
			
			fileUpload.addEventListener("load", function(event){ 
			self.ajaxAction.set('text', 'done!');

			(function(){self.ajaxAction.morph('.hide')}).delay(1500);self.fireEvent('response', self);}, false);
									
			fileUpload.addEventListener("error", function(){
			self.ajaxAction.set('text', 'error during upload. Try again!');
			
			(function(){self.ajaxAction.morph('.hide')}).delay(1500);}, false);
						
			xhr.open("POST", this.options.url, true);
			xhr.setRequestHeader('content-type', 'multipart/form-data; boundary='+ boundary);
			xhr.onreadystatechange = function(){
				responseHtml='Done! <br /><br />'+xhr.responseText;
				document.getElementById('response').innerHTML=responseHtml;
			};
			
			// build the request
			var dashdash = '--',
			crlf     = '\r\n';

			// 1. add file
			// set header of the file part
			builder = dashdash + boundary + crlf + 'Content-Disposition: form-data; name="user_file"' + '; filename="' + this.options.filename + '.' + this.options.type + '"' + crlf + 'Content-Type: application/octet-stream' + crlf + crlf; 
			
			// Append binary data of the file part
			builder += self.canvasEl.toDataURL('image/'+type).replace("data:image/"+type+";base64,", "");

			// Mark end of the request.
			builder += crlf + dashdash + boundary + dashdash + crlf;
			
			xhr.send(builder);
	}
});









/* Functions */
function getImage(imageUrl){
	// load picture in the canvas
	var image = new Element ('img', {src: imageUrl}),
										canvas = $('canvas'),
										ctx = canvas.getContext('2d'); 

										image.addEvent('load', function(){
										ctx.drawImage(image, 0, 0); }
							);

	// instantiate the save canvas object
	var scObj = new cmtSaveImage('canvas', 'response');

	// execute save event
	document.getElementById('response').fireEvent('click', null, 8000);
}