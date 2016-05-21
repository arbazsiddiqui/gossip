chatroomsref = new Firebase('https://chatapp-befed.firebaseio.com/chatroom');

function createChatRoom() {
    var chatRoomName = document.getElementById('roomname').value.trim();
    chatroomsref.push({
        name : chatRoomName
    })
}

chatroomsref.on('value', function(snapshot){
   chatRooms = snapshot.val();
   var list = [];
   for (var key in chatRooms) {
       list.push({
           name : chatRooms[key].name,
           key : key
       })
   }
    refreshUI(list)
});

function refreshUI(list) {
    var lis = '';
    for (var i = 0; i < list.length; i++) {
        lis += '<li>' + list[i].name  + genLinks(list[i].key, list[i].name) +'</li>';
    }
    document.getElementById('roomlist').innerHTML = lis;
}

function genLinks(key, name) {
    var links = '';
    links += '<a href="javascript:enterChatRoomUI(\'' + key + '\',\'' + name + '\')   ">Enter</a>';
    return links;
}

function enterChatRoomUI(key, name ) {
    temp = '<input type="text" id="username" placeholder="Enter the name">' + '<input type="text" id="message" placeholder="Enter the message">' + '<a href="javascript:enterChatRoom(\'' + key + '\')">enter</a>'
    document.getElementById('enterchatroom').innerHTML = temp;

}

function enterChatRoom(key){
    var room = new Firebase('https://chatapp-befed.firebaseio.com/chatroom/' + key)
        var username = document.getElementById('username').value.trim();
    var message = document.getElementById('message').value.trim();

    room.push({
        user : username,
        message : message,
        status : 'sent'
    });

    room.on('value', function(snapshot){
        roomconversation = snapshot.val();
        var list = [];
        for (var keyx in roomconversation) {
            list.push({
                name : roomconversation[keyx].user,
                message : roomconversation[keyx].message,
                status : roomconversation[keyx].status
            })
        }
        refreshChatRoomUI(list, key, username);
        console.log(list);
    })
}

function refreshChatRoomUI(list, key, username) {
    var lis = '';
    for (var i = 0; i < list.length; i++) {
        lis += '<li>' + '<b>' + list[i].name + '</b>' + ' says ' + list[i].message + ' status '+ list[i].status +'</li>';
    }
    document.getElementById('conversation').innerHTML = lis;

    temp ='<input type="text" id="messagecont" placeholder="Enter the message">' + '<a href="javascript:sendMessage(\'' + key + '\',\'' + username + '\')">send</a>'
    document.getElementById('sendmessage').innerHTML = temp;
}

function sendMessage(key, username){
    var room = new Firebase('https://chatapp-befed.firebaseio.com/chatroom/' + key)
    var message = document.getElementById('messagecont').value.trim();
    room.push({
        user : username,
        message : message,
        status : 'sent'
    });
}
