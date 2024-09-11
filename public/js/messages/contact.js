import { getMessage, showMessage } from "./messages.js";

// Create Contact List
const getFriendsUL = document.getElementById("ulFriends");
const getStrangersUL = document.getElementById("ulStrangers");

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

    return users;
  } catch (error) {
    console.error("error: ", error);
  }
};

async function catUsers() {
  const friends = [];
  const stangers = [];
  const users = await getUsers();

  for (const user of users) {
    const { senderMessages, receiverMessages } = await getMessage(user.id);

    if (senderMessages.length != 0 || receiverMessages.length != 0) {
      friends.push(user);
    } else {
      stangers.push(user);
    }
  }
  return {
    friends,
    stangers,
  };
}

const showFriends = async () => {
  try {
    // let users = await getUsers()
    const { friends, _ } = await catUsers();

    friends.forEach((e) => {
      const createLI = document.createElement("li");

      createLI.id = e.id;
      createLI.classList.add("list-group-item");
      createLI.textContent = e.username;
      createLI.addEventListener("click", (e) => {
        saveReceiverId(e);
        showMessage();
      });
      getFriendsUL.appendChild(createLI);
    });
  } catch (error) {
    console.error("error: ", error);
  }
};

const showStrangers = async () => {
  try {
    const { _, stangers } = await catUsers();

    stangers.forEach((e) => {
      const createLI = document.createElement("li");
      const createHR = document.createElement("hr");

      createLI.id = e.id;
      createLI.classList.add("dropdown-item", "stangersUL");
      createLI.textContent = e.username;
      createLI.addEventListener("click", (e) => {
        saveReceiverId(e);
        showMessage();
      });
      getStrangersUL.appendChild(createLI);
      getStrangersUL.appendChild(createHR);
    });
  } catch (error) {
    console.error("error: ", error);
  }
};

showStrangers();

// Look for who will get the message
const saveReceiverId = (detail) => {
  if (!detail.target.id) throw "need target id";
  const targetId = detail.target.id;
  sessionStorage.selectedUser = targetId;
};

//
window.onload = () => {
  showFriends();
  sessionStorage.clear();
};

//Dropdown bocor bawah benerin besok
