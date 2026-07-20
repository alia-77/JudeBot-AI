const chatBox = document.getElementById("chat-box");
const input = document.getElementById("message");
const sendBtn = document.getElementById("sendBtn");
const clearBtn = document.getElementById("clearBtn");
const typing = document.getElementById("typing");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");

// Auto resize text area
input.addEventListener("input", () => {
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
});

// Enter = Send
// Shift+Enter = New line
input.addEventListener("keydown", function(e){

    if(e.key==="Enter" && !e.shiftKey){

        e.preventDefault();
        sendMessage();

    }

});
// Send button
sendBtn.addEventListener("click", sendMessage);

function addMessage(text,type){
    let div=document.createElement("div");
    div.className=`message ${type}`;

    if(type==="bot"){

        div.innerHTML=marked.parse(text);

        div.querySelectorAll("pre code").forEach((block)=>{
            hljs.highlightElement(block);
        });

    }

    else{

        div.textContent=text;

    }

    chatBox.appendChild(div);
    chatBox.scrollTop=chatBox.scrollHeight;

}

async function sendMessage(){

    let message=input.value.trim();
    if(message==="") return;
    addMessage(message,"user");
    input.value="";
    input.style.height="60px";
    typing.classList.remove("hidden");
    sendBtn.disabled=true;

    try{

        let response=await fetch("/chat",{
            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                message:message

            })

        });

        let data=await response.json();
        typing.classList.add("hidden");
        addMessage(data.reply,"bot");

    }

    catch{

        typing.classList.add("hidden");
        addMessage("Something went wrong.","bot");

    }

    sendBtn.disabled=false;

}

clearBtn.addEventListener("click",async()=>{
    await fetch("/clear",{

        method:"POST"

    });

    chatBox.innerHTML="";

});

uploadBtn.onclick = () => {
    fileInput.click();
};

fileInput.onchange = async () => {

    const file = fileInput.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    typing.classList.remove("hidden");
    typing.textContent = "Processing document...";

    try {

        await fetch("/upload", {
            method: "POST",
            body: formData
        });

        addMessage(
            `📄 Document uploaded successfully: ${file.name}`,
            "bot"
        );

    }
    catch {

        addMessage(
            "Failed to upload the document.",
            "bot"
        );

    }

    typing.classList.add("hidden");
    typing.textContent = "JudeBot is thinking...";
};