
let link = undefined;
let session = undefined;
let accountData = undefined;

export const user = 'decryptr';
export const url = 'http://127.0.0.1:3333';

const appIdentifier = "Shield Login"
const chainId = "384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0"
const endpoints = ["https://proton.greymass.com"]

const loginButton = document.querySelector('#login-button')
const avatar = document.querySelector('#avatar')
const avatarName = document.querySelector('#avatar-name')
const username = document.querySelector('#username')
const toInput = document.querySelector('#to-input')
const amountInput = document.querySelector('#amount-input')
const logoutIcon = document.querySelector('#logout-button')
const transferFormContainer = document.querySelector('#transferFormContainer')
const transferButton = document.querySelector('#transfer-button')

const userId = 'decryptr'
const contractName = 'grat'
const token = 'GRAT'

// Status is updated once a user is logged in
const updateStatus = () => {

  // Session and session.auth are automatically returned when a user logs in
  // here we use that to determing what UI we display
  if (session && session.auth) {
    avatarName.textContent = session.auth.actor.toString()
    username.textContent = session.auth.actor.toString()
    loginButton.style.display = "none"
    avatar.style.display = "block"
    logoutIcon.style.display = "block"
    transferFormContainer.style.display = "block"
  } else {
    avatarName.textContent = ""
    loginButton.style.display = "block"
    avatar.style.display = "none"
    logoutIcon.style.display = "none"
    transferFormContainer.style.display = "none"
  }
}

// Login in function that is called when the login button is clicked
const login = async (restoreSession) => {
  const { link: localLink, session: localSession } = await ProtonWebSDK({
    linkOptions: {
      endpoints,
      chainId,
      restoreSession,
    },
    // // The account that is requesting the transaction with the client
    // transportOptions: {
    //   requestAccount: appIdentifier
    // },
    // This is the wallet selector style options available
    selectorOptions: {
      appName: "Shield",
      appLogo: "/svgs/SHIELD-logo.svg",
      customStyleOptions: {
        modalBackgroundColor: "#F4F7FA",
        logoBackgroundColor: "white",
        isLogoRound: true,
        optionBackgroundColor: "white",
        optionFontColor: "black",
        primaryFontColor: "black",
        secondaryFontColor: "#6B727F",
        linkColor: "#752EEB"
      }
    }
  })

  link = localLink
  session = localSession
  console.log(link, session)

  updateStatus()
}

// Logout function sets the link and session back to original state of undefined
const logout = async () => {
  if (link && session) {
    await link.removeSession(appIdentifier, session.auth, chainId);
  }
  session = undefined;
  link = undefined;

  updateStatus()
}

// // Transfer functionality
// const transfer = async ({ to, amount }) => {
//   if (!session) {
//     throw new Error('No Session');
//   }

//   return await session.transact({
//     actions: [{

//       // Token contract
//       account: "grat",

//       // Action name
//       name: "transfer",

//       // Action parameters
//       data: {
//         // Sender
//         from: session.auth.actor,

//         // Receiver
//         to: to,

//         // 8 is precision (how many decimals places the token allows), GRAT is symbol
//         quantity: `${(+amount).toFixed(8)} GRAT`,

//         // Optional memo
//         memo: "Testing transactions from the API"
//       },
//       authorization: [session.auth]
//     }]
//   }, {
//     broadcast: true
//   })
// }

// Add button listeners
logoutIcon.addEventListener("click", logout)
loginButton.addEventListener("click", () => login(false))
// transferButton.addEventListener("click", () => transfer({
//   to: toInput.value,
//   amount: amountInput.value,
// }))

// Restore
// login(true)