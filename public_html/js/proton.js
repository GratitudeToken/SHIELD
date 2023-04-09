import { $, $$ } from '/js/selectors.js'

let link = undefined
let session = undefined


export let user

export let membership = false
export let accountStatus

export const url = 'http://127.0.0.1:9632'

export let avatarbase64

const PROTON_MAINNET_EPS = [
    // "https://api.protonnz.com",
    // "https://proton.eosusa.news",
    // "https://sbp.proton.cryptolions.io",
    // "https://hyperion.quantumblok.com",
    // "https://proton.protonuk.io",
    // "https://proton.eoscafeblock.com",
    // "https://bp1.protonmt.com",
    // "https://proton.eu.eosamsterdam.net",
    "https://proton.greymass.com"
    // "https://proton.eosphere.io",
    // "https://proton.genereos.io",
    // "https://api.proton.alohaeos.com",
    // "https://protonapi.ledgerwise.io",
    // "https://proton-api.eosiomadrid.io",
    // "https://api.proton.eossweden.org",
    // "https://api.proton.bountyblok.io",
    // "https://proton.eosrio.io",
    // "https://api.proton.detroitledger.tech",
    // "https://hyperion.proton.detroitledger.tech",
    // "https://proton.eoscannon.io",
    // "https://proton.eosargentina.io",
    // "https://apiproton.blockside.io",
    // "https://api.protoneastern.cn",
    // "https://proton.eoseoul.io",
    // "https://api-proton.eosarabia.net",
    // "https://mainnet.brotonbp.com",
    // "https://bp1.protonind.com",
    // "http://bp1-mainnet.euproton.com",
    // "https://proton.edenia.cloud",
    // "https://api.protongroup.info",
    // "https://main.proton.kiwi",
    // "https://proton-api.alvosec.com",
    // "https://proton.eosvenezuela.io",
    // "https://api-proton.saltant.io",
    // "https://aa-proton.saltant.io",
    // "https://api.protonpoland.com",
    // "https://proton.eos.barcelona",
    // "https://api.protongb.com"
]

const PROTON_TESTNET_EP = [
    "https://testnet.brotonbp.com",
    "https://api-protontest.saltant.io",
    "https://api.testnet.protongb.com",
    "https://testnet-api.protongroup.info"
]

const MAINET_CHAINID = "384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0"
const TESTNET_CHAINID = "71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd"

const appIdentifier = "SHIELD"
const chainId = MAINET_CHAINID
const endpoints = PROTON_MAINNET_EPS

const loginButton = $('#login')
const avatarName = $('#avatar-name')
// const username = $('#username')
// const toInput = $('#to-input')
// const amountInput = $('#amount-input')
const logoutButton = $('#logout')
// const transferFormContainer = $('#transferFormContainer')
// const transferButton = $('#transfer-button')

// const contractName = 'grat'
// const token = 'GRAT'

// for checking and saving membership and balance and other info

export const userInfo = (user, authenticating) => {
    fetch(url + '/userinfo?user=' + user + '&login=' + authenticating, {
    }).then(response => {
        return response.json()
    }).then(data => {
        accountStatus = data
        if (data.balance > 5 && data.kyc === true) {
            membership = true
        }
        if (user) {
            $('#user-menu .avatar').src = `/avatars/${user}.webp`
            $('#balance b').innerHTML = data.balance + ' GRAT'
            $('#login span').textContent = 'Switch'
        } else {
            $('#user-menu .avatar').src = `/svgs/user.svg`
        }
    })
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

    if (localSession) {
        user = localSession.auth.actor
        avatarName.textContent = user
        $('#add').style.display = 'block'
        loginButton.classList.add('authenticated')

        restoreSession ? userInfo(user, false) : userInfo(user, true)
    }
}

// Logout function sets the link and session back to original state of undefined
const logout = async () => {
    if (link && session) {
        await link.removeSession(appIdentifier, session.auth, chainId)
    }
    session = undefined
    link = undefined
    avatarName.textContent = ''
    location.reload()
}

// Add button listeners
loginButton.addEventListener("click", () => login(false))
logoutButton.addEventListener("click", () => logout())
// Restore
login(true)




//---------------------------------------//




// // Transfer functionality
// const transfer = async ({ to, amount }) => {
//   if (!session) {
//     throw new Error('No Session')
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