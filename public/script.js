const form = document.querySelector("#signupForm")
const passwordInput = document.querySelector("#passwordInput")
const usernameInput = document.querySelector("#usernameInput")
const emailInput = document.querySelector("#emailInput")
const serverMessage = document.querySelector("#serverMessage")
const loadingSpinner = document.querySelector("#loadingSpinner")

form.addEventListener("submit", async event => {
  event.preventDefault()

  const password = passwordInput.value
  const username = usernameInput.value
  const email = emailInput.value

  serverMessage.innerText = ""
  loadingSpinner.classList.remove("hidden")

  const result = await fetch('http://localhost:3000/users', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password, email })
  }).then(response => response.json())
  
  loadingSpinner.classList.add("hidden")
  
  if (result.message) {
    serverMessage.innerText = result.message
    serverMessage.classList.replace("error", "success")
  }
  if (result.error) {
    serverMessage.innerText = result.error
    serverMessage.classList.replace("success", "error")
  }
  console.log(result)
})