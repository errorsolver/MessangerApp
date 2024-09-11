//Get Message list form DB
const getMessage = async (receiverId) => {
  try {
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

    return {
      senderMessages,
      receiverMessages,
    };
  } catch (error) {
    console.error("error: ", error);
  }
};

const getMessagesUL = document.getElementById("ulMessages");
getMessagesUL.innerHTML = "";

let lastMessageID = 0;

//Show Message list
const showMessage = async () => {
  try {
    const receiverId = sessionStorage.selectedUser;
    if (!receiverId) {
      return;
    }
    getMessagesUL.innerHTML = "";
    const messages = [];
    const { senderMessages, receiverMessages } = await getMessage(receiverId);

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

      // Sended messages bubble
      if (createLI.id != sessionStorage.selectedUser) {
        createLI.classList.add("text-end");
        if (validator.isURL(e.message)) {
          const link = changeLink(e.message);
          createLI.innerHTML = `
                <div class="d-inline-block m-1 py-2 px-4 rounded-start border text-bg-primary">
                  <a href=${link} target='_blank' class ="link-light">${e.message}</a>
                </div>
                `;
        } else {
          createLI.innerHTML = `
                <div class="d-inline-block m-1 py-2 px-4 rounded-start border text-bg-primary">
                    ${e.message}
                </div>
                `;
        }
        // Recieved messages bubble
      } else {
        createLI.classList.add("text-start");
        if (validator.isURL(e.message)) {
          const link = changeLink(e.message);
          createLI.innerHTML = `
                <div class="d-inline-block m-1 py-2 px-3 rounded-end border text-bg-info">
                <a href=${link} target='_blank' class ="link-light">${e.message}</a>
                </div>
                `;
        } else {
          createLI.innerHTML = `
                <div class="d-inline-block m-1 py-2 px-3 rounded-end border text-bg-info">
                    ${e.message}
                </div>
                `;
        }
      }
      getMessagesUL.appendChild(createLI);
    });

    if (messages.length != 0) {
      lastMessageID = messages[messages.length - 1].id;
      scrollToBottom("ulMessages");
    } else {
      const createLI = document.createElement("li");
      createLI.setAttribute("style", "white-space: pre-line");
      createLI.textContent = "No conversation yet \r\n";
      createLI.textContent += "Say something :D";
      createLI.classList.add("text-center", "m-5");
      getMessagesUL.appendChild(createLI);
    }

    return lastMessageID;
  } catch (error) {
    console.error("error: ", error);
  }
};

//
const updateMessage = async () => {
  try {
    const receiverId = sessionStorage.selectedUser;
    if (!receiverId) {
      return;
    }
    const { senderMessages, receiverMessages } = await getMessage(receiverId);

    const newMessages = [];

    //  get all messages from this user
    senderMessages.forEach((e) => {
      if (e.id > lastMessageID) {
        newMessages.push(e);
      }
    });

    // get all messages for this user
    receiverMessages.forEach((e) => {
      if (e.id > lastMessageID) {
        newMessages.push(e);
      }
    });
    if (newMessages.length != 0) {
      newMessages.sort((a, b) => a.id - b.id);

      lastMessageID = newMessages[newMessages.length - 1].id;

      newMessages.forEach((e) => {
        const createLI = document.createElement("li");
        createLI.id = e.senderId;
        createLI.textContent = e.message;

        // Sended messages bubble
        if (createLI.id != sessionStorage.selectedUser) {
          createLI.classList.add("text-end");
          if (validator.isURL(e.message)) {
            const link = changeLink(e.message);
            createLI.innerHTML = `
                  <div class="d-inline-block m-1 py-2 px-4 rounded-start border text-bg-primary">
                  <a href=${link} target='_blank' class ="link-light">${e.message}</a>
                  </div>
                  `;
          } else {
            createLI.innerHTML = `
                  <div class="d-inline-block m-1 py-2 px-4 rounded-start border text-bg-primary">
                      ${e.message}
                  </div>
                  `;
          }
          // Recieved messages bubble
        } else {
          createLI.classList.add("text-start");
          if (validator.isURL(e.message)) {
            const link = changeLink(e.message);
            createLI.innerHTML = `
                  <div class="d-inline-block m-1 py-2 px-3 rounded-end border text-bg-info">
                  <a href=${link} target='_blank' class ="link-light">${e.message}</a>
                  </div>
                  `;
          } else {
            createLI.innerHTML = `
                  <div class="d-inline-block m-1 py-2 px-3 rounded-end border text-bg-info">
                      ${e.message}
                  </div>
                  `;
          }
        }
        getMessagesUL.appendChild(createLI);
      });
    }
  } catch (error) {
    console.error("error: ", error);
  }
};

//interval to refresh the page
if (sessionStorage.getItem("selectedUser")) {
  setInterval(updateMessage, 1000);
}

//Send button
const sendMessageForm = document.querySelector("form");
sendMessageForm.addEventListener("submit", async (e) => {
  try {
    e.preventDefault();
    await sendMessages();
    await updateMessage(); // ganti update
    scrollToBottom();
  } catch (error) {
    console.error(error);
  }
});

//Sending Message into DB
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

// Validasi link
function changeLink(message) {
  if (!/^https?:\/\//i.test(message)) {
    const link = "http://" + message; // Menambahkan protokol jika tidak ada
    return link;
  }
  return message;
}

export { getMessage, showMessage };
