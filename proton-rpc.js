//import { JsonRpc } from '@proton/js'
const JsonRpc = require('@proton/js')

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
];

const PROTON_TESTNET_EP = [
    "https://testnet.brotonbp.com",
    "https://api-protontest.saltant.io",
    "https://api.testnet.protongb.com",
    "https://testnet-api.protongroup.info"
];

const PROTON_MAINET_CHAINID = "384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0";
const PROTON_TESTNET_CHAINID = "71ee83bcf52142d61019d95f9cc5427ba6a0d7ff8accd9e2088ae2abeaf3d3dd";

const PROTON_APP_IDENTIFIER = "snipcoins";

async function protonRPC() {

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