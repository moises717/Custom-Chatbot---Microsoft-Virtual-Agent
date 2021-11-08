/// variable globales

let element = document.getElementById("bot-card");
let addBtn = document.getElementById("productContent");
let btnOpenChat = document.getElementById("btn-open-bot");
let ClickHeadingOpenChat = document.getElementById("heading");

const BOT_ID = "your bot ID here";
const theURL = "https://powerva.microsoft.com/api/botmanagement/v1/directline/directlinetoken?botId=" + BOT_ID;

const token = "user token here";

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
					//Web Chat will show the 'Greeting' System Topic message which has a trigger-phrase 'hello'
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

function startToChat() {
	addBtn.addEventListener("click", (e) => {
		let textToChat = "";
		if (e.target.nodeName === "H5") {
			textToChat = e.target.innerText;
		} else {
			textToChat = "";
			toasAlert();
		}

		store.dispatch({
			type: "WEB_CHAT/SEND_MESSAGE",
			payload: {
				text: textToChat,
			},
		});
	});

	store.dispatch({
		type: "WEB_CHAT/SEND_EVENT",
		payload: {
			name: "webchat/join",
			value: { language: window.navigator.language },
		},
	});

	const avatarOptions = {
		botAvatarImage: "./alita.jpeg",
		botAvatarInitials: "",
	};

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

function toasAlert() {
	var toastElList = document.getElementById("toast");
	var toastElement = new bootstrap.Toast(toastElList, {
		animation: true,
		delay: 4000,
	});

	toastElement.show();
}
