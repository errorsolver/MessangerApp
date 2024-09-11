// Create Contact List
const getContactUL = document.getElementById("ulContact");
const getUsers = async () => {
  try {
    const res = await fetch("/user/getusers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();
    let users = result.users;

    users.forEach((e) => {
      const createLI = document.createElement("li");

      createLI.id = e.id;
      createLI.classList.add("list-group-item");
      createLI.textContent = e.username;
      createLI.addEventListener("click", (e) => {
        saveReceiverId(e);
        getMessage();
      });
      getContactUL.appendChild(createLI);
    });
  } catch (error) {
    console.error("error: ", error);
  }
};

// Look for who will get the message
const saveReceiverId = (detail) => {
  if (!detail.target.id) throw "need target id";
  const targetId = detail.target.id;
  sessionStorage.selectedUser = targetId;
};

//Get list of messages
const getMessagesUL = document.getElementById("ulMessages");
getMessagesUL.innerHTML = "";

const getMessage = async () => {
  try {
    receiverId = sessionStorage.selectedUser;

    // Collect message data
    const res = await fetch("/message/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receiverId,
      }),
    });

    const result = await res.json();
    const senderMessages = await result.senderMessages;
    const receiverMessages = await result.receiverMessages;

    const messages = [];

    //  get all messages from this user
    senderMessages.forEach((e) => {
      if (e.receiverId != e.senderId) {
        messages.push(e);
      }
    });

    // get all messages for this user
    receiverMessages.forEach((e) => {
      if (e.receiverId != e.senderId) {
        messages.push(e);
      }
    });

    //sort the message desc
    messages.sort((a, b) => a.id - b.id);

    //Create list of text
    messages.forEach((e) => {
      const createLI = document.createElement("li");
      createLI.id = e.senderId;
      createLI.textContent = e.message;

      // Sended messages
      if (createLI.id != sessionStorage.selectedUser) {
        createLI.classList.add("text-end");
        createLI.innerHTML = `
            <div class="d-inline-block m-1 py-2 px-4 rounded-start border text-bg-primary">
              ${e.message}
              </div>
            `;
        // Recieved messages
      } else {
        createLI.classList.add("text-start");
        createLI.innerHTML = `
            <div class="d-inline-block m-1 py-2 px-3 rounded-end border text-bg-info">
              ${e.message}
            </div>
            `;
      }
      getMessagesUL.appendChild(createLI);
    });

    if (!getMessagesUL.hasChildNodes()) {
      const createLI = document.createElement("li");
      createLI.setAttribute("style", "white-space: pre-line");
      createLI.textContent = "No conversation yet \r\n";
      createLI.textContent += "Say something :D";
      createLI.classList.add("text-center", "m-5");
      getMessagesUL.appendChild(createLI);
    }
  } catch (error) {
    console.error("error: ", error);
  }
};

//interval to refresh the page
// if(sessionStorage.selectedUser){
//   setInterval(getMessage, 1500)
// }

window.onload = () => {
  getUsers();
};

const sendMessageForm = document.querySelector("form");
sendMessageForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    await sendMessages();
    await getMessage();
  } catch (error) {
    console.error(error);
  }
});

//
async function sendMessages() {
  const getInputMessage = document.getElementById("inputMessage");
  const message = getInputMessage.value;
  getInputMessage.value = "";
  const receiverId = sessionStorage.selectedUser;
  try {
    const result = await fetch("/message/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        receiverId,
      }),
    });
  } catch (error) {
    console.error("send message: ", error);
  }
}
