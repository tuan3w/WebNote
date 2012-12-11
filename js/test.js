

var container;
var entry = null;
var board;
function start(){
    board = new NoteBoard("wrap2");

    $("#new").click(function(){
        board.enable();
    });
   $(document).click(function(e){

        var x = e.pageX;
        var y = e.pageY;
       // alert(x + "," + y);
        board.newNote(x,y);
   });  
}