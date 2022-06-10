"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;
changeUser()
connection.on("ReceiveMessage", function (message) {
    let msg = `<div class="message text-only">
                        <div class="response">
                            <p class="text">${message}</p>
                        </div>
                    </div>`;
    $(".messages-chat").append(msg);
});

connection.on("Connected", function (username) {
    let id = "#" + username;
    $(id).removeClass(" offline")
    $(id).addClass("online ")
})
connection.on("DisConnected", function (username) {
    let id = "#" + username;
    $(id).addClass(" offline")
    $(id).removeClass("online ")
})

connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

$("#sendButton").click(function () {
    let message = $("#messageInput").val();
    connection.invoke("SendMessage", username, message).then(function () {
        $("#messageInput").val("");
    }).catch(function (err) {
        return console.error(err.toString());
    });
})
$(".discussion").not(".search").click(function () {
    $(".discussion").removeClass("message-active");
    $(this).addClass("message-active");
    $("#sendButton").attr("username", $(this).find(".status").attr("id"));
})
function changeUser() {
    $(".discussion").eq(1).addClass("message-active");
    $("#sendButton").attr("username", $(".discussion .status").attr("id"))

}