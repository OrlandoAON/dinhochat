//Create a chat module to use.
$(function () {

  window.Chat = {
    socket : null,
  
    initialize : function(socketURL) {
      this.socket = io.connect(socketURL);

      //Send message on button click or enter
      $('#send').click(function() {
        Chat.send();
      });

      $('#message').keyup(function(evt) {
        if ((evt.keyCode || evt.which) == 13) {
          Chat.send();
          return false;
        }
      });

         //events
      $('.usernameInput').keydown(this.keydown);
      $(window).bind('beforeunload',function(){
        socket.emit("disconnect", socket);
      });

      //Process any incoming messages
      this.socket.on('new', this.add);
      this.socket.on('serverInfo', this.serverInfo);
      this.socket.on('user joined', this.userJoined);
    },

    //Adds a new message to the chat.
    add : function(data) {
      var name = data.name || 'anonymous';
      var msg = $('<div class="msg"></div>')
      .append('<span class="name">' + name + '</span>: ')
      .append('<span class="text">' + data.msg + '</span>')
      $('#messages')
      .append(msg)
      .animate({scrollTop: $('#messages').prop('scrollHeight')}, 0);
    },

    //Add server info to the chat
    serverInfo : function(message) {
      var name = 'Server';
     
      $('.messages')
      .append('<span class="name"><i>' + name + '</i></span>: ')
      .append('<span class="text"><i>' + message + '</i></span><br>')
      //  .append(msg)
        .animate({scrollTop: $('#messages').prop('scrollHeight')}, 0);
    },
 
    //Sends a message to the server,
    //then clears it from the textarea
    send : function() {
      this.socket.emit('msg', {
        name: $('.usernameInput').val(),
        msg: $('#message').val()
      });

      $('#message').val('');

      return false;
    },

    // Sets the client's username
  setUsername: function() {
    //username = cleanInput($usernameInput.val().trim());

    // If the username is valid
    if ($('.usernameInput')) {
      $('.login.page').fadeOut();
      $('.chat.page').show();
      $('.login.page').off('click');
      this.socket.emit('user joined', $('.usernameInput').val());
    }
  },

  addParticipantsMessage: function(data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there're " + data.numUsers + " participants";
    }
    data.message = message;
    window.Chat.writeMessage(data);
  //  log(message);
  },

  writeMessage: function(data) {
    username = data.username === undefined ? 'Server' : data.username
    $('.messages')
    .append('<span class="name"><i>' + username + '</i></span>: ')
    .append('<span class="text"><i>' + data.message + '</i></span><br>')
    .animate({scrollTop: $('#messages').prop('scrollHeight')}, 0);
  },

  userJoined: function(data) {
 //   log(data.username + ' joined');
    window.Chat.addParticipantsMessage(data);
  },

  keydown: function (event) {
    // Auto-focus the current input when a key is typed
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $(this).focus();
    }
    if (event.which === 13) {
        window.Chat.setUsername();
    }
  }

};

 }());