emailjs.init("nCBS-FOcz288jM3oE");


let btnSendMessage = document.getElementById("btnSendMessage");

btnSendMessage.addEventListener("submit",(e)=>{
    e.preventDefault();

    const formInputs = {
        user_name: document.getElementById("user_name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
    }
    
    emailjs.send("service_mh3xsnz","template_m3xxftl",formInputs)
})

