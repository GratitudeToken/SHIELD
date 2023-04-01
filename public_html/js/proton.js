import { $, $$ } from '/js/selectors.js'

let link = undefined
let session = undefined


export let user = localStorage.getItem('user') || null

export let membership = 'visionary' // !!!! This has to be set from a fetch request done in the LOGIN function to check the data/members.json to see if the user is in there and if he's a guardian or visionary

export const url = 'http://127.0.0.1:9632'

export let avatarbase64

const PROTON_MAINNET_EPS = [
    "https://api.protonnz.com",
    "https://proton.eosusa.news",
    "https://sbp.proton.cryptolions.io",
    "https://hyperion.quantumblok.com",
    "https://proton.protonuk.io",
    "https://proton.eoscafeblock.com",
    "https://bp1.protonmt.com",
    "https://proton.eu.eosamsterdam.net",
    "https://proton.greymass.com",
    "https://proton.eosphere.io",
    "https://proton.genereos.io",
    "https://api.proton.alohaeos.com",
    "https://protonapi.ledgerwise.io",
    "https://proton-api.eosiomadrid.io",
    "https://api.proton.eossweden.org",
    "https://api.proton.bountyblok.io",
    "https://proton.eosrio.io",
    "https://api.proton.detroitledger.tech",
    "https://hyperion.proton.detroitledger.tech",
    "https://proton.eoscannon.io",
    "https://proton.eosargentina.io",
    "https://apiproton.blockside.io",
    "https://api.protoneastern.cn",
    "https://proton.eoseoul.io",
    "https://api-proton.eosarabia.net",
    "https://mainnet.brotonbp.com",
    "https://bp1.protonind.com",
    "http://bp1-mainnet.euproton.com",
    "https://proton.edenia.cloud",
    "https://api.protongroup.info",
    "https://main.proton.kiwi",
    "https://proton-api.alvosec.com",
    "https://proton.eosvenezuela.io",
    "https://api-proton.saltant.io",
    "https://aa-proton.saltant.io",
    "https://api.protonpoland.com",
    "https://proton.eos.barcelona",
    "https://api.protongb.com"
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

const loginButton = $('#login-button')
const avatarName = $('#avatar-name')
// const username = $('#username')
// const toInput = $('#to-input')
// const amountInput = $('#amount-input')
const logoutButton = $('#logout-button')
// const transferFormContainer = $('#transferFormContainer')
// const transferButton = $('#transfer-button')

// const contractName = 'grat'
// const token = 'GRAT'

async function sayHello() {

    const rpc = new JsonRpc(PROTON_TESTNET_EP);
    const res = await rpc.get_table_rows({
        json: true,
        code: "shieldvault",
        scope: "shieldvault",
        table: "accounts",
        lower_bound: "crotte",
        upper_bound: "crotte",
    })
    /*
    session.api.rpc.get_table_rows({
        get_table_rows({
        json: true,
        code: "shieldvault",
        scope: "shieldvault",
        table:"accounts",
        lower_bound:session.auth.actor,
        upper_bound:session.auth.actor
    })
    */

    console.log(res)



}

sayHello();


const fetchUrl = endpoints[0] + '/v1/history/get_actions'

const getAccountData = (user, url) => {
    const payload = {
        "account_name": user,
        "pos": -1,
        "offset": -100
    }
    fetch(url, {
        method: "POST",
        body: JSON.stringify(payload)
    }).then(response => {
        return response.json()
    }).then(data => {
        localStorage.setItem('accountData', JSON.stringify(data))
    })
}

// when clicking on #renew button, pop-up a prompt or modal to enter TRX to confirm type of membership

// GET THE TX STUFF with data.traces[2].act.data -- and much more in data --- or use the method from rockerone to get balance and other stuff
const getStuff = (id) => {
    fetch(url + '/trx?id=' + id, {
    }).then(response => {
        return response.json()
    }).then(data => {
        //console.log(data)
        //console.log(data.traces[2].act.data)
    })
}

getStuff('35439649bfe1cfb1e65c6ea81bd0897073611456e64933a368694858466dba46')


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

    // for now we don't use information after login, so no need to store these
    // localStorage.setItem('link', localLink)
    // localStorage.setItem('session', localSession)

    localSession ? user = localSession.auth.actor : user = null

    // Update some things once a user is logged in
    if (user != null || user != undefined) {
        localStorage.setItem('user', user)
        avatarName.textContent = user
        $('#add').style.display = 'block'
        loginButton.classList.add('authenticated')
    }


    // fetch accountData for this user to find the avatar base64 string by looking into the last 100 actions
    const fetchAndSave = (user) => {
        // the function to get the avatar base64 string and send it to the server along with the user, then update the user login button
        getAccountData(user, fetchUrl)
        const data = JSON.parse(localStorage.getItem('accountData'))

        let ava = []
        // let's see which of these objects has the ava key name, save all the avatar strings in an array
        for (const key in data.actions) {
            if (data.actions.hasOwnProperty(key)) {
                if (data.actions[key].action_trace.act.data.ava) {
                    ava.push(data.actions[key].action_trace.act.data.ava)
                }
            }
        }



        //let's construct the payload
        let postData = {
            "user": user,
            "ava": ''
        }
        // if we do not have any avatar base64 string from the API, we save a generic user icon for this user, else, we use the last string in the array
        ava.length === 0 ? postData.ava = 'PHN2ZyBmaWxsPSIjMDEyNDUzIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbDpzcGFjZT0icHJlc2VydmUiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDI0IDI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiPjxwYXRoIGQ9Ik0xMiAwQzUuNCAwIDAgNS40IDAgMTJzNS40IDEyIDEyIDEyIDEyLTUuNCAxMi0xMlMxOC42IDAgMTIgMHptMCA0YzIuMiAwIDQgMi4yIDQgNXMtMS44IDUtNCA1LTQtMi4yLTQtNSAxLjgtNSA0LTV6bTYuNiAxNS41QzE2LjkgMjEgMTQuNSAyMiAxMiAyMnMtNC45LTEtNi42LTIuNWMtLjQtLjQtLjUtMS0uMS0xLjQgMS4xLTEuMyAyLjYtMi4yIDQuMi0yLjcuOC40IDEuNi42IDIuNS42czEuNy0uMiAyLjUtLjZjMS43LjUgMy4xIDEuNCA0LjIgMi43LjQuNC40IDEtLjEgMS40eiIvPjwvc3ZnPg==' : postData.ava = ava[ava.length - 1]

        // send it to the server
        fetch(url + '/avatarsave', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData)
        }).then(response => {
            return response.json()
        }).then(data => {
            console.log('Server said: Avatar ' + data.avatar)
            $('#login-button img').src = `/avatars/${user}.webp`
        })
    }



    //if we have a date saved in localStorage, let's compare it to NOW to see if it has been more than 23 hours
    const nowTime = Date.now()
    //console.log('Now time: ' + nowTime)
    let savedTime
    if (user != null) {
        // let's get the date for when the avatar was last saved and a now date
        const localStorageAvatarDate = localStorage.getItem('avatarExpirationDate')
        localStorageAvatarDate ? savedTime = localStorageAvatarDate : savedTime = null
        //console.log(localStorageAvatarDate)

        if (savedTime !== null) {
            const timediff = Math.abs(savedTime - nowTime) / 3600000
            console.log('Hours passed for avatar: ' + timediff.toFixed(2) + ' | Avatar update happens when min 23 hours have passed since last update.')

            if (timediff >= 23) {
                fetchAndSave(user)
                localStorage.setItem('avatarExpirationDate', nowTime)
                console.log('Expired avatar overwritten.')
            }
        }

        if (savedTime === null) {
            // if we are here, it means we do not have a date saved in localStorage and that the avatar might be from a new user
            fetchAndSave(user)
            localStorage.setItem('avatarExpirationDate', nowTime)
            console.log('New avatar saved.')
        }
        $('#login-button img').src = `/avatars/${user}.webp`
    }

}

// Logout function sets the link and session back to original state of undefined
const logout = async () => {
    if (link && session) {
        await link.removeSession(appIdentifier, session.auth, chainId)
    }
    session = undefined
    link = undefined
    localStorage.removeItem('user')
    localStorage.removeItem('avatarExpirationDate')
    avatarName.textContent = ''
    $('#login-button img').src = `/svgs/user.svg`
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