const $sidebarLeft = document.querySelector('.sidebarLeft')
const authApi = `https://cepegra-frontend.xyz/chat2/wp-json/jwt-auth/v1/token`;

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
const hideauthForm = () => {
  let $authForm = document.querySelector('#authForm')
  $authForm.classList.add('hidden')
}

authForm.onsubmit = async (e) => {
  e.preventDefault()
const messageApi =
  "https://cepegra-frontend.xyz/chat2/wp-json/wp/v2/messagerie";
const contentChat = document.querySelector(".content-chat");
const formChat = document.querySelector(".chat-box");

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
    contentChat.innerHTML = template;
  });

//------- POST le fomulaire chat -------//
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

  let response = await fetch(authApi, {
    method: 'POST',
    body: new FormData(authForm)
  })
  if (response.status === 200) {
    let result = await response.json()
    let userid = await ""
    let users = fetch(`https://cepegra-frontend.xyz/chat2/wp-json/wp/v2/users?search=${result.user_nicename}`)
    .then((uresp) => uresp.json())
    .then(users => {
      console.log(users)
      const firstUser = users[0]
      sessionStorage.setItem(`${firstUser.id}`, `${result.token}`)    
      hideauthForm()
    })
  } else {
    alert("Log in failed")
  }
}