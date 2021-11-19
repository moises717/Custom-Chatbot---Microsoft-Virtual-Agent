/// variable globales

let element = document.getElementById("bot-card")
let addBtn = document.getElementById("productContent")
let btnOpenChat = document.getElementById("btn-open-bot")
let ClickHeadingOpenChat = document.getElementById("heading")

const BOT_ID = "700f3ffb-29a0-43af-bc61-ce9dd3dc8b06"
const theURL = "https://powerva.microsoft.com/api/botmanagement/v1/directline/directlinetoken?botId=" + BOT_ID

const token = "CaRHEHlKlcg.jkrRozf2zM2cbK66CgabpqUUABUmokDm6w9L41f4Adk"

// estado del chatbot
const store = window.WebChat.createStore({}, ({ dispatch }) => (next) => (action) => {
	console.log(action)
	if (action.type === "DIRECT_LINE/CONNECT_FULFILLED") {
		dispatch({
			meta: {
				method: "keyboard",
			},
			payload: {
				activity: {
					channelData: {
						postBack: true,
					},

					name: "startConversation",
					type: "event",
				},
			},
			type: "DIRECT_LINE/POST_ACTIVITY",
		})
	}
	return next(action)
})

// html content

let startText = "<img src='./alita.jpeg' class='img-alita' alt='Imagen del bot'>"

endText =
	"<span class='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary'><i class='fas fa-robot'></i></span>"

// Eventos del DOM
window.addEventListener("DOMContentLoaded", (event) => {
	if (localStorage.getItem("isOpenChat") === "true") {
		element.classList.toggle("show-bot")
		btnOpenChat.innerHTML = `${startText}` + "  TERMINAR CONVERSACION" + `${endText}`
		startToChat()
	}

	//Eventos
	btnOpenChat.addEventListener("click", (event) => {
		openChatbot()
	})

	ClickHeadingOpenChat.addEventListener("click", (event) => {
		openChatbot()
	})

	addBtn.addEventListener("click", (e) => listenProductClick(e))
})

// Click button to open bot
function openChatbot() {
	let isOpenChat = localStorage.getItem("isOpenChat")
	element.classList.toggle("show-bot")

	if (isOpenChat === "true") {
		localStorage.setItem("isOpenChat", !JSON.parse(isOpenChat))
		btnOpenChat.innerHTML = btnOpenChat.innerHTML = `${startText}` + " REALIZAR PEDIDO " + `${endText}`
	} else {
		localStorage.setItem("isOpenChat", !JSON.parse(isOpenChat))
		btnOpenChat.innerHTML = `${startText}` + "  TERMINAR CONVERSACION" + `${endText}`

		startToChat()
	}
}

// Escuchar click en producto
function listenProductClick(clickEvent) {
	let isOpenChat = localStorage.getItem("isOpenChat")
	if (isOpenChat === "false") {
		openChatbot()
		htmlAlert()
	}

	let lastMessage = store.getState().activities[[store.getState().activities.length - 1]].text
	let textToChat

	if (lastMessage.includes("articulo")) {
		if (clickEvent.target.nodeName === "H5") {
			textToChat = clickEvent.target.innerText
		} else {
			textToChat = ""
			alertToUser("Has click en el nombre del articulo!")
		}
		sendMessage(textToChat)
	} else {
		// html alert
		htmlAlert()
	}
}

// comenzar con el chatbot
function startToChat() {
	const avatarOptions = {
		botAvatarImage: "./alita.jpeg",
		botAvatarInitials: "",
		userAvatarImage: "./user.png",
		userAvatarInitials: "",
	}

	let botState = store.getState().connectivityStatus

	if (botState !== "connected") {
		window.WebChat.renderWebChat(
			{
				directLine: window.WebChat.createDirectLine({
					token,
				}),
				store,
				styleOptions: avatarOptions,
			},
			document.getElementById("chat-content")
		)
	}
}

function sendMessage(msg) {
	store.dispatch({
		type: "WEB_CHAT/SEND_MESSAGE",
		payload: {
			text: msg,
		},
	})
}

function alertToUser(msg) {
	store.dispatch({
		type: "WEB_CHAT/SET_NOTIFICATION",
		payload: {
			alt: "ALiTA",
			id: "alertForClick",
			level: "info",
			message: msg,
		},
	})
}
function htmlAlert() {
	var toastEl = document.getElementById("toast")
	var toast = new bootstrap.Toast(toastEl)
	toast.show()
}
