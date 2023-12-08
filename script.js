const messageApi =
  "https://cepegra-frontend.xyz/chat2/wp-json/wp/v2/messagerie";
const contentChat = document.querySelector(".content-chat");
const formChat = document.querySelector(".chat-box");
//--------- affichage de chat ---------//
fetch(`${messageApi}`)
  .then((res) => res.json())
  .then((res) => {
    let template = "";
    res.forEach((el) => {
      template += `
      <h2 data-id=${el.id}>${el.acf.chat_titre}</h2>
      <p>${el.acf.chat_message}</p>
      `;
    });
    contentChat.innerHTML = template;
  });

//------- envoyer le fomulaire chat -------//
formChat.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData(formChat);
  let dataJson = {
    fields: {
      chat_titre: data.get("chat_titre"),
      chat_message: data.get("chat_message"),
    },
    title: data.get("chat_titre"),
    status: "publish",
  };
  fetch(`${messageApi}`, {
    method: "POST",
    body: JSON.stringify(dataJson),
    headers: {
      Authorization: "Bearer " + sessionStorage.token,
      "Content-Type": "application/json",
    },
  })
    .then((resp) => {
      console.log(resp.status);
      return resp.json();
    })
    .catch((error) => console.log(error));
});
