import { $, $$ } from '/js/selectors.js'

let link = undefined
let session = undefined

export let user
export const url = 'http://127.0.0.1:9632'
export let accountData
export let avatarbase64

const appIdentifier = "SHIELD"
const chainId = "384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0"
const endpoints = ["https://proton.greymass.com"]

const loginButton = $('#login-button')
const avatarName = $('#avatar-name')
const username = $('#username')
const toInput = $('#to-input')
const amountInput = $('#amount-input')
const logoutIcon = $('#logout-button')
const transferFormContainer = $('#transferFormContainer')
const transferButton = $('#transfer-button')

const contractName = 'grat'
const token = 'GRAT'

const getAccountData = (user) => {
    // const fetchUrl = endpoints[0] + '/v1/history/get_actions'
    // const payload = {
    //     "account_name": user,
    //     "pos": -1,
    //     "offset": -100
    // }

    // fetch(fetchUrl, {
    //     method: "POST",
    //     body: JSON.stringify(payload)
    // }).then(response => {
    //     return response.json();
    // }).then(data => {
    //     accountData = data.actions[2];
    // });
}

const saveAvatar = (user) => {
    fetch(url + '/avatarsave?user=' + user, {
    }).then(response => {
        return response.json();
    }).then(data => {
        console.log(data)
        $('#login-button img').src = `/avatars/${user}.webp`
    });
}

// Status is updated once a user is logged in
const updateStatus = () => {
    user = session.auth.actor
    localStorage.setItem('user', user)
    avatarName.textContent = user;
    saveAvatar(user)
}

// Login in function that is called when the login button is clicked
const login = async (restoreSession) => {
    const { link: localLink, session: localSession } = await ProtonWebSDK({
        // linkOptions is a required part of logging in with the protonWebSDK(), within
        // the options, you must have the chain API endpoint array, a chainID that matches the chain your API
        // endpoint is on, and restoreSession option that is passed to determine if there is
        // an existing session that needs to be saved or if a new session needs to be created.
        linkOptions: {
            endpoints,
            chainId,
            restoreSession,
        },
        // The account that is requesting the transaction with the client
        transportOptions: {
            requestAccount: appIdentifier
        },
        // This is the wallet selector style options available
        selectorOptions: {
            appName: "SHIELD",
            appLogo: "/svgs/SHIELD-logo.svg",
            customStyleOptions: {
                modalBackgroundColor: "#F4F7FA",
                logoBackgroundColor: "white",
                isLogoRound: false,
                optionBackgroundColor: "white",
                optionFontColor: "#0274f9",
                primaryFontColor: "#012453",
                secondaryFontColor: "#6B727F",
                linkColor: "#0274f9"
            }
        }
    })

    link = localLink
    session = localSession

    updateStatus()
}

// Logout function sets the link and session back to original state of undefined
const logout = async () => {
    if (link && session) {
        await link.removeSession(appIdentifier, session.auth, chainId)
    }
    session = undefined
    link = undefined

    updateStatus()
}

// Add button listeners
loginButton.addEventListener("click", () => login(false))
logoutIcon.addEventListener("click", logout)
// Restore
login(true)




//---------------------------------------//




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



// transferButton.addEventListener("click", () => transfer({
//   to: toInput.value,
//   amount: amountInput.value,
// }))