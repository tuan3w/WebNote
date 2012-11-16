
function NoteBoard(id,cvId){
	this.notes = new Array();
	this.id = 0;
	this.container = id;
	this.enabled = false;
	this.target = null;
	var ct = new Ocr.Container({
            container: "container",
            width: 800,
            height: 500,
            strokeWidth: 2,
            stroke: "#00ff00"
      });
        
	this.entry = new Ocr.Entry({
        container: ct,       //Ocr container
        target: "text",             //target
        line : 7,                   //number of lines
       // train: true,               //train? if train make a real training else only copy outputWeight and mapNeuron 
        guide: true               //draw guide line
        // deday: 300,                 //time delay to make an recognition
    });

	var that = this;
    //add event listener
    $("#clear").click(function(){
        that.entry.clear();
    });
    $("#undo").click(function(e){
        that.entry.undoText();
    });
    $("#redo").click(function(e){
        that.entry.redoText();
    });

    $("#st").click(function(e){
        that.entry.toggle();
        if (that.entry.enabled){
            this.style.cssText = "background: #000; border: 2px solid #000;";
            this.value = "OFF";
        }else {
            this.value = "ON";
            this.style.cssText = "background: #888; border: 2px solid #333";

        }
    });
    $("#ok").click(function(){
        if (that.target instanceof Note) {
        	var entry = that.entry;
        	var target = that.target;
        	target.data = entry.copy(entry.input);
        	target.img = that.entry.currentImg;
          
        	target.content.css("background", "url(" + that.entry.currentImg + ")");
        	target.setText(entry._target.value);
        	target.content.css("background-size", "100% 100%");

        }
        $('#wrap').hide();
    });
}
NoteBoard.prototype.enable = function(){
	this.enabled = true;
};
NoteBoard.prototype.disable = function(){
	this.enabled = false;
};
NoteBoard.prototype.newNote = function(x,y){
	if (!this.enabled)
		return;
	var t = new Note(this, x, y);
	this.notes.push(t);
	this.enabled = false;
};
NoteBoard.prototype.delNote = function(note) {
	var idx = this.notes.indexOf(note);
	this.notes.splice(idx, 1);
};
NoteBoard.prototype.edit = function(note){
	this.target = note;
	this.entry.clear();
	var entry = this.entry;
	if (note.data != null && note.img != null) {
		entry.input = note.data;

		var ct = this.entry.context;
		ct.clearRect(0, 0, this.entry.width, this.entry.height);
		var img = new Image();
		img.src=note.img;
		ct.drawImage(img,0, 0);

		entry.undo.push(entry.copy(entry.input));
	    entry.undoData.push(note.img);
		entry.update();
		entry._target.value = note.text;
	}

	$("#wrap").show();
};



function Note(parent, x,y,text, width, height) {
	this.parent = parent;
	this.img = null;
	this.data = null;
	this.text = "";
	this.main = $("<div class='popup ui-widget-header ui-draggable'></div>");
	this.icon = null;
	this.close = $("<div class='popup-close'> </div>");
	this.tooltip = $("<div class='tooltip'> New note</div>");
	this.content = $("<div class='content'></div>");
	this.x = x;
	this.y = y;
	this.main.css("top", y);
	this.main.css("left", x);
	this.text = "";
	
	$('#'+this.parent.container).append(this.main);
	this.main.append(this.close);
	this.main.append(this.tooltip);
	this.main.append(this.content);
	this.main.hover(function(){
		that.tooltip.show();
	});

	var id = Math.floor(Math.random() * 10);
	this.bgImg = IMG["note_" + id];
	if (width != undefined)
		this.main.css("width", width);
	if (height != undefined)
		this.main.css('height', height);
	this.main.css("background", "url("+this.bgImg.src + ") no-repeat");
	this.main.css("background-size", "100% 100%");
	this.main.draggable();

	var that = this;
	this.main.hover(function(){
		that.tooltip.show();
	}, function(){
		that.tooltip.hide();
	});
	this.main.dblclick(function(){
		that.parent.edit(that);
	});
	this.close.click(function(){
		that.hide();
		that.parent.delNote(that);
	});
}
Note.prototype.show = function(){
	this.main.show();
};
Note.prototype.hide = function(){
	this.main.hide();
	
};
Note.prototype.setText = function(text){
	var temp = "";
	for (var i=0; i< text.length; i++) {
		if (text[i] == "\n" && text[i+1] !="\n" && i!=0)
			temp +="<br/>";
		else
			temp +=text[i];
	}
	if (text == "") {
		temp = "New note";
  		this.content.css("background", "transparent");
  		this.img = null;
	}
	this.tooltip.html(temp);
	this.text = text;
};