'use strict';

// TODO create mobile view

var LOCAL_SERVER = "http://localhost:8080";
var PUBLIC_SERVER = "http://104.197.3.113";

var message_count = 0;

var server = LOCAL_SERVER;
var sups;
var currentSup;
var currentSupIndex;

window.addEventListener('load', function() {
    // Place your Wassup app code here
    console.log("Wassup?");

    var friend_select_form = document.getElementById('friend_select_form');
    var getFriendsCallback = function (response) {
        var friends = response;
        friend_select_form.innerHTML = '';
        _.each(
            friends,
            function (friend) {
                var checkDiv = document.createElement('div');
                var label = document.createElement('label');
                var option = document.createElement('input');
                option.type = 'checkbox';
                option.id = friend.user_id;
                option.classList.add('friend_list');
                friend_select_form.appendChild(checkDiv);
                label.appendChild(option);
                label.innerHTML = label.innerHTML + friend.full_name;
                checkDiv.appendChild(label);
            }
        );
    };
    getFriends(getFriendsCallback);

    var sup_count = document.getElementById('sup_count');
    var getSupsCallback = function (response) {
        sups = response;
        sup_count.innerText = sups.length;
        if (!currentSup && sups.length > 0) {
            currentSup = sups[sups.length - 1];
            currentSupIndex = sups.length - 1;
            drawSup();
        }
        var sup_info = document.getElementById('sup_info');
        if (currentSup) {
            sup_info.style.display = 'initial';
            var sup_sender = document.getElementById('sup_sender');
            var sup_time = document.getElementById('sup_time');
            sup_sender.innerHTML = currentSup.sender_id;
            sup_time.innerHTML = new Date(currentSup.date).toLocaleString();
        } else {
            sup_info.style.display = 'none';
        }
    };
    getSups(getSupsCallback);

    var private_btn = document.getElementById('private_btn');
    var public_btn = document.getElementById('public_btn');
    private_btn.addEventListener('click', function () {
        server = LOCAL_SERVER;
        currentSup = null;
        getSups(getSupsCallback);
        getFriends(getFriendsCallback);
    });
    public_btn.addEventListener('click', function () {
        server = PUBLIC_SERVER;
        currentSup = null;
        getSups(getSupsCallback);
        getFriends(getFriendsCallback);
    });

    var userExistsCallback = function (response) {
        if (response.exists) {
            addFriend(response.user_id);
            getFriends(getFriendsCallback);
        }
    };

    var add_friend_form = document.getElementById('add_friend_form');
    add_friend_form.addEventListener('submit', function(event) {
        event.preventDefault();
    }, true);
    var add_friend_button = document.getElementById('add_friend_button');
    add_friend_button.addEventListener('click', function() {
        var friend_id = document.getElementById('friend_id').value;
        userExists(friend_id, userExistsCallback);
    });
    var remove_friend_button = document.getElementById('remove_friend_button');
    remove_friend_button.addEventListener('click', function() {
        var friend_id = document.getElementById('friend_id').value;
        removeFriend(friend_id);
        getFriends(getFriendsCallback);
    });

    var send_sup_btn = document.getElementById('send_sup_btn');
    send_sup_btn.addEventListener('click', function () {
        var friend_list = document.getElementsByClassName('friend_list');
        _.each (friend_list, function (friend) {
            if (friend.checked) {
                message_count += 1;
                sendSup(friend.id,generateUUID());
            }
        });
    });

    var next_sup_btn = document.getElementById('next_sup_btn');
    next_sup_btn.addEventListener('click', function () {
        if (currentSupIndex != sups.length - 1) {
            currentSupIndex += 1;
            currentSup = sups[currentSupIndex];
            drawSup();
        }
        var sup_sender = document.getElementById('sup_sender');
        var sup_time = document.getElementById('sup_time');
        sup_sender.innerHTML = currentSup.sender_id;
        sup_time.innerHTML = new Date(currentSup.date).toLocaleString();
    });
    var prev_sup_btn = document.getElementById('prev_sup_btn');
    prev_sup_btn.addEventListener('click', function () {
        if (currentSupIndex != 0) {
            currentSupIndex -= 1;
            currentSup = sups[currentSupIndex];
            drawSup();
        }
        var sup_sender = document.getElementById('sup_sender');
        var sup_time = document.getElementById('sup_time');
        sup_sender.innerHTML = currentSup.sender_id;
        sup_time.innerHTML = new Date(currentSup.date).toLocaleString();
    });
    var delete_sup_btn = document.getElementById('delete_sup_btn');
    delete_sup_btn.addEventListener('click', function () {
        removeSup(currentSup.sup_id);
        if (currentSupIndex === sups.length-1) {
            currentSupIndex -= 1;
            currentSup = sups[currentSupIndex];
        } else {
            currentSup = sups[currentSupIndex+1];
        }
        if (currentSup) {
            var sup_sender = document.getElementById('sup_sender');
            var sup_time = document.getElementById('sup_time');
            sup_sender.innerHTML = currentSup.sender_id;
            sup_time.innerHTML = new Date(currentSup.date).toLocaleString();
            drawSup();
        } else {
            var sup_info = document.getElementById('sup_info');
            sup_info.style.display = 'none';
            var canvas = document.getElementById('sup_canvas');
            var context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
        getSups(getSupsCallback);
    });

    var clear_sup_btn = document.getElementById('clear_sup_btn');
    clear_sup_btn.addEventListener('click', function () {
        clearSups();
        currentSup = null;
        var sup_info = document.getElementById('sup_info');
        sup_info.style.display = 'none';
        var canvas = document.getElementById('sup_canvas');
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        getSups(getSupsCallback);
    });

    setInterval(function () {getSups(getSupsCallback)}, 10000);

});

window.addEventListener('resize', function () {
    var canvas = document.getElementById('sup_canvas');
    if (window.innerWidth < 510) {
        canvas.width = window.innerWidth - 60;
        canvas.height = canvas.width*8/9;
    } else {
        canvas.width = 450;
        canvas.height = canvas.width*8/9;
    }
    drawSup();
});

function createUser(user_id, full_name) {
    handleAjaxRequest('create_user', {'user_id': user_id, 'full_name':full_name});
}

function userExists(user_id, userExistsCallback) {
    handleAjaxRequest('user_exists', {'user_id': user_id}, userExistsCallback);
}

function addFriend(user_id) {
    handleAjaxRequest('add_friend', {'user_id': user_id});
}

function removeFriend(user_id) {
    handleAjaxRequest('remove_friend', {'user_id': user_id});
}

function getFriends(callback) {
    handleAjaxRequest('get_friends', {}, callback);
}

function sendSup(user_id,sup_id) {
    handleAjaxRequest('send_sup', {'user_id': user_id, 'sup_id': sup_id, 'date': new Date()});
}

function removeSup(sup_id) {
    handleAjaxRequest('remove_sup', {'sup_id': sup_id});
}

function clearSups() {
    handleAjaxRequest('clear_sups', {});
}

function getSups(callback) {
    var responseData = handleAjaxRequest('get_sups', {}, callback);
}

// Example derived from: https://developer.mozilla.org/en-US/docs/AJAX/Getting_Started
function handleAjaxRequest(command, command_data, callback) {
    // Create the request object
    var httpRequest = new XMLHttpRequest();
    var body = document.getElementsByTagName('body');
    message_count += 1;

    // Set the function to call when the state changes
    httpRequest.addEventListener('readystatechange', function() {

        // These readyState 4 means the call is complete, and status
        // 200 means we got an OK response from the server
        if (httpRequest.readyState === 4 && httpRequest.status === 200) {
            // Parse the response text as a JSON object
            var responseObj = JSON.parse(httpRequest.responseText);
            body[0].classList.remove('loading');

            if (responseObj.error != "") {
                console.log(responseObj.error);
            } else {
                if (callback) {
                    callback(responseObj.reply_data);
                }
            }
        }
    });
    if (command != 'get_sups') {
        body[0].classList.add('loading');
    }

    // This opens a POST connection with the server at the given URL
    httpRequest.open('POST', server + '/post');

    // Set the data type being sent as JSON
    httpRequest.setRequestHeader('Content-Type', 'application/json');

    // Send the JSON object, serialized as a string
    var objectToSend = {
        protocol_version: '1.0',
        message_id: generateUUID(),
        command: command,
        command_data: command_data};
    if (server === PUBLIC_SERVER) {
        objectToSend.user_id = getCookie("user_id");
    }
    httpRequest.send(JSON.stringify(objectToSend));
}

function drawSup () {
    if (currentSup) {
        var canvas = document.getElementById('sup_canvas');
        var context = canvas.getContext('2d');
        context.font = canvas.width*2/9 + "px sans-serif";
        context.textAlign="center";
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.save();
        context.translate(canvas.width/2,canvas.height/2);
        context.rotate(Math.random()*Math.PI/2-Math.PI/4);
        context.scale(Math.random()+0.5,Math.random()+0.5);
        context.fillStyle = '#'+ Math.floor(Math.random()*Math.pow(2,24)).toString(16);
        context.fillText("SUP?", 0, 0);
        context.restore();
    }
}

// Method taken from https://piazza.com/class/i4c5eq9ken44cj?cid=353
// originally from http://stackoverflow.com/a/8809472
function generateUUID(){
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

// Original JavaScript code by Chirp Internet: www.chirp.com.au
function getCookie(name)
{
    var re = new RegExp(name + "=([^;]+)");
    var value = re.exec(document.cookie);
    return (value != null) ? unescape(value[1]) : null;
}