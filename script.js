const urlApi = `https://cepegra-frontend.xyz/chat2/wp-json/wp/v2/messagerie/37`;

let resp = fetch(urlApi)
.then((resp) => resp.json())
.then((resp) => console.log(resp))