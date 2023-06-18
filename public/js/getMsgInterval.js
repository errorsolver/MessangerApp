const getContactUL = document.getElementById("ulContact")
const getUsers = async () => {
    try {
        const res = await fetch('/user/getusers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const result = await res.json()
        let users = result.users

        users.forEach(e => {
            const createLI = document.createElement('li')

            createLI.id = e.id
            createLI.textContent = e.username
            createLI.addEventListener('click', getMessage)
            getContactUL.appendChild(createLI)
        })
    } catch (error) {
        console.log('error: ', error)
    }
}

const getMessagesUL = document.getElementById('ulMessages')
const getMessage = async (detail) => {
    try {
        getMessagesUL.innerHTML = ''
        if (!detail.target.id) throw 'need target id'
        const targetId = detail.target.id
        sessionStorage.selectedUser = targetId
        receiverId = sessionStorage.selectedUser

        const res = await fetch('/message/get', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                receiverId
            })
        })

        const result = await res.json()
        const senderMessages = await result.senderMessages
        const receiverMessages = await result.receiverMessages

        const messages = []
        senderMessages.forEach(e => {
            if (e.receiverId != e.senderId) {
                messages.push(e)
            }
        })
        receiverMessages.forEach(e => {
            if (e.receiverId != e.senderId) {
                messages.push(e)
            }
        })
        messages.sort((a, b) => a.id - b.id)

        messages.forEach(e => {
            const createLI = document.createElement('li')
            createLI.id = e.senderId
            createLI.textContent = e.message
            // createLI.classList.add('inline', 'list-group-item')
            if (createLI.id != sessionStorage.selectedUser) {
                createLI.classList.add('text-end')
            }
            getMessagesUL.appendChild(createLI)
        })

        if (!getMessagesUL.hasChildNodes()) {
            const createLI = document.createElement('li')
            createLI.textContent = 'There is no message'
            getMessagesUL.appendChild(createLI)
        }
    } catch (error) {
        console.log('error: ', error);
    }
}

window.onload = () => {
    getUsers()
}

const sendMessageForm = document.querySelector('form')
sendMessageForm.addEventListener('submit', async (e) => {
    try {
        e.preventDefault()
        getMessage()
    } catch (error) {
        console.log(error)
    }
})

async function getMessages() {
    const getInputMessage = document.getElementById('inputMessage')
    const message = getInputMessage.value
    const receiverId = sessionStorage.selectedUser
    try {
        const result = await fetch('/message/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                receiverId
            })
        })
    } catch (error) {
        console.log('send message: ', error);
    }
}