

function createMessage(msg) {
    return `<div class="chat-message">
        <div class="flex items-end">
            <div
            class="flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start"
            >
            <span class="brand-color">${msg.user}</span>
            <div>
                <span
                class="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-300 text-gray-600"
                >${msg.message}</span>
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

function scrollToBottom() {
        messages.scrollTop = messages.scrollHeight;
    }   
      
const socket = io("http://localhost:8080");
socket.on("messageLogs", (msgs) => {

    console.log(msgs);
    const user= localStorage.getItem("username")
    const msgHtml = msgs.map((msg) => msg.user == user ? createOwnMessage(msg.message): createMessage(msg));
    $("#messages").html(msgHtml.join(" "));
    scrollToBottom()
});

function onLoad (){

    const username= localStorage.getItem("username")
    if(username){
        socket.auth = {username}
        socket.connect()
        $("#chat").removeClass("hidden")
        $("#joinChat").addClass("hidden")
    }
}

$( function () {
    onLoad()
    $("#sendMsg").on("click", function () {
    const input = $("#message").val();
    $("#message").val("");
    const user= localStorage.getItem("username")
    socket.emit("message", {user: user, message: input});

    $("#messages").append(createOwnMessage(input));
    scrollToBottom()
    });
    
    $("#joinBtn").on("click",()=>{
        const input= $("#username"). val()
        localStorage.setItem("username", input)
        console.log(input)
        socket.auth= {username:input}
        socket.connect()
        $("#chat").removeClass("hidden")
        $("#joinChat").addClass("hidden")
    })

    $("#message").on("keyup", function (event) {
    if (event.key === "Enter") {
        const input = $("#message").val();
        $("#message").val("");
        const user= localStorage.getItem("username")
        socket.emit("message", {user: user, message: input});
        console.log(input,user)
        $("#messages").append(createOwnMessage(input))
        scrollToBottom()
        
    }
    });
});
