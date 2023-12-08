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