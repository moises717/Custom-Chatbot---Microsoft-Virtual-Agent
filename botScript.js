/// variable globales

let element = document.getElementById("bot-card");
let addBtn = document.getElementById("productContent");
let btnOpenChat = document.getElementById("btn-open-bot");
let ClickHeadingOpenChat = document.getElementById("heading");

const BOT_ID = "bot id";
const theURL = "https://powerva.microsoft.com/api/botmanagement/v1/directline/directlinetoken?botId=" + BOT_ID;

const token = "user token";

const store = window.WebChat.createStore({}, ({ dispatch }) => (next) => (action) => {
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
		});
	}
	return next(action);
});

// html content

let startText = "<img src='./alita.jpeg' class='img-alita' alt='Imagen del bot'>";

endText =
	"<span class='position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary'><i class='fas fa-robot'></i></span>";

// Eventos del DOM
window.addEventListener("DOMContentLoaded", (event) => {
	if (localStorage.getItem("isOpenChat") === "true") {
		element.classList.toggle("show-bot");
		btnOpenChat.innerHTML = `${startText}` + "  TERMINAR CONVERSACION" + `${endText}`;
		startToChat();
	}

	// ALERTAS

	btnOpenChat.addEventListener("click", (event) => {
		openChatbot();
	});

	ClickHeadingOpenChat.addEventListener("click", (event) => {
		openChatbot();
	});

	addBtn.addEventListener("click", (e) => listenProductClick(e));
});

// Click button to open bot
function openChatbot() {
	let isOpenChat = localStorage.getItem("isOpenChat");
	element.classList.toggle("show-bot");

	if (isOpenChat === "true") {
		localStorage.setItem("isOpenChat", !JSON.parse(isOpenChat));
		btnOpenChat.innerHTML = btnOpenChat.innerHTML = `${startText}` + " REALIZAR PEDIDO " + `${endText}`;
	} else {
		localStorage.setItem("isOpenChat", !JSON.parse(isOpenChat));
		btnOpenChat.innerHTML = `${startText}` + "  TERMINAR CONVERSACION" + `${endText}`;

		startToChat();
	}
}

function listenProductClick(clickEvent) {
	let lastMessage = store.getState().activities[[store.getState().activities.length - 1]].text;
	let textToChat;

	if (lastMessage.includes("articulo")) {
		if (clickEvent.target.nodeName === "H5") {
			textToChat = clickEvent.target.innerText;
		} else {
			textToChat = "";
			alertToUser();
		}
		sendMessage(textToChat);
	}
}

function startToChat() {
	const avatarOptions = {
		botAvatarImage: "./alita.jpeg",
		botAvatarInitials: "",
	};

	let botState = store.getState().connectivityStatus;

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
		);
	}
}

function sendMessage(message) {
	store.dispatch({
		type: "WEB_CHAT/SEND_MESSAGE",
		payload: {
			text: message,
		},
	});
}

function alertToUser() {
	store.dispatch({
		type: "WEB_CHAT/SET_NOTIFICATION",
		payload: {
			alt: "ALiTA",
			id: "alertForClick",
			level: "info",
			message: "Has click en el nombre del articulo!",
		},
	});
}
