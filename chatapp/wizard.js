chatroomsref = new Firebase('https://chatapp-befed.firebaseio.com/chatroom');
var keys=[];
chatroomsref.once("value", function(snapshot) {
    for (var key in snapshot.val()){
        keys.push(key)
    }
    loopover(keys);
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

function loopover(keys){
    for (i= 0; i<keys.length; i++){
        roomListener(keys[i]);
    }
}

function roomListener(roomkey){
    var roomref = new Firebase('https://chatapp-befed.firebaseio.com/chatroom/'+roomkey);
    //var roomref = db.ref("chatroom/" + roomkey);
    roomref.limitToLast(2).on("child_added", function(snapshot){
        if (snapshot.key() != "name"){
            populateUI(snapshot.val());
            changeStatus(roomkey, snapshot.key())
        }
    });
}

function populateUI(ss){

    document.getElementById('recieve').innerHTML = ss.user + ' says ' + ss.message ;

}

function changeStatus(roomkey, messagekey){
    var messageref = new Firebase('https://chatapp-befed.firebaseio.com/chatroom/'+ roomkey + '/' + messagekey);
    messageref.update({
        status : "recieved by wizard"
    });
    if (document.hasFocus()){
        console.log(document.hasFocus());
        messageref.update({
            status : "seen by wizard"
        });
    }
}