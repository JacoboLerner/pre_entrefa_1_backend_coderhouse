function createMessage(msg) {
    return `<div class="chat-message">
        <div class="flex items-end">
            <div
            class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start"
            >
            <span class="brand-color">${msg.username}</span>
            <div>
                <span
                class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600"
                >${msg.text}</span>
            </div>
            </div>
        </div>
        </div>`;
}
function createOwnMessage(msg) {
        return `<div class="chat-message">
        <div class="flex items-end justify-end">
            <div
            class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-1 items-end"
            >
            <div>
                <span
                class="px-4 py-2 rounded-lg inline-block rounded-br-none bg-blue-600 text-white"
                >${msg}</span>
            </div>
            </div>
        </div>
        </div>`;
    }
const socket = io();
socket.on("historial", (msgs) => {
    console.log(msgs);
    // [{ text: "hola mundo!", username: "eduardo" }];
    const msgHtml = msgs.map((msg) => createMessage(msg));
    $("#messages").html(msgHtml.join(" "));
});

socket.on("recibirMensaje", (msg) => {
    console.log(`mensaje entrante: `, msg);
    $("#messages").append(createMessage(msg));
});

$(function () {
    $("#sendMsg").on("click", function () {
    const input = $("#message").val();
    $("#message").val("");
    socket.emit("enviarMensaje", input);

    $("#messages").append(createOwnMessage(input));
    });

    $("#message").on("keyup", function (event) {
    if (event.key == "Enter") {
        const input = $("#message").val();
        $("#message").val("");
        socket.emit("enviarMensaje", input);

        $("#messages").append(createOwnMessage(input));
    }
    });
});
const inputBox = document.getElementById("message");

inputBox.addEventListener("keydown", (event) => {
    console.log(event);
    if (event.key == "Enter") {
        socket.emit("enviarMensaje", inputBox.value);
        $("#messages").append(createOwnMessage(inputBox.value));
        inputBox.value = "";
    }
});
