const $sidebarLeft = document.querySelector('.sidebarLeft')
const authApi = `https://cepegra-frontend.xyz/chat2/wp-json/jwt-auth/v1/token`;
const messageApi = "https://cepegra-frontend.xyz/chat2/wp-json/wp/v2/messagerie";
const $contentChat = document.querySelector(".content-chat");
const $formChat = document.querySelector(".chat-box");
const $chat = document.querySelector(".chat-form")
const $titleMessage = document.querySelector("#titlemessage")

//display auth form
const displayauthForm = () => {
  let template = ``
  template += `
  <form id="authForm" action="" method="post">
  <label for="username">Username :</label>
  <input type="text" name="username" id="username">
  <label for="password">Password :</label>
  <input type="text" name="password" id="password">
  <button id="authformBtn">Log in</button>
  </form>
  `
  $sidebarLeft.innerHTML = template
}
displayauthForm()

//hide auth form
const hideauthForm = () => {
  let $authForm = document.querySelector('#authForm')
  $authForm.classList.add('hidden')
  $titleMessage.classList.remove('hidden')
}

//on form submit if request is 200 then give sessiontoken and hide auth form else alert
authForm.onsubmit = async (e) => {  
e.preventDefault() 
let response = await fetch(authApi, {
    method: 'POST',
    body: new FormData(authForm)
  })
  if (response.status === 200) {
    let result = await response.json()
    let userid =  ""
    let template = ``
    let users = fetch(`https://cepegra-frontend.xyz/chat2/wp-json/wp/v2/users?search=${result.user_nicename}`)
    .then((uresp) => uresp.json())
    .then(users => {
      const firstUser = users[0]
      sessionStorage.setItem(`token`, `${result.token}`)
      sessionStorage.setItem(`id`, `${firstUser.id}`)
      hideauthForm()

      template += `
        <label for="chat_titre">Titre: </label>
        <input name="chat_titre" id="chat_titre" type="text" />
        <label for="chat_message">message: </label>
        <textarea name="chat_message" id="chat_message" cols="30" rows="10"></textarea>
        <input type="submit" value="Envoyer" />
      `
      $formChat.innerHTML = template
    })
  } else {
    alert("Log in failed")
  }
}

//--------- affichage du chat ---------//
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
    $contentChat.innerHTML = template;
  });

//------- POST le fomulaire chat -------//
$formChat.addEventListener("submit", (e) => {
  e.preventDefault();
  let data = new FormData($formChat);
  let dataJson = {
    "fields": {
      "chat_titre": data.get("chat_titre"),
      "chat_message": data.get("chat_message"),
    },
    "title": data.get("chat_titre"),
    "status": "publish",
  };
  console.log(dataJson)
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