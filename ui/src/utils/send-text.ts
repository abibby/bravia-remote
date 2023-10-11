import { getTextForm, setTextForm } from '../bravia/appControl'
import { getPublicKey } from '../bravia/encryption'

export async function sendText(text: string): Promise<void> {
    const result = await setTextForm(text)
    console.log(result)

    // const { publicKey } = await getPublicKey()
    // const key = await importPublicKey(publicKey)
    // const data = await encryptData(text, key)
    // getTextForm()
}
function base64ToArrayBuffer(base64: string) {
    var binary_string = window.atob(base64)
    var len = binary_string.length
    var bytes = new Uint8Array(len)
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i)
    }
    return bytes.buffer
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
    var binary = ''
    var bytes = new Uint8Array(buffer)
    var len = bytes.byteLength
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
}

async function importPublicKey(spki: string) {
    const binaryDer = base64ToArrayBuffer(spki)
    var cryptoKey = await window.crypto.subtle.importKey(
        'spki',
        binaryDer,
        {
            name: 'RSA-OAEP',
            modulusLength: 256,
            hash: { name: 'sha-256' },
        },
        false,
        ['encrypt'],
    )
    return cryptoKey
}

async function encryptData(message: string, cryptoKey: CryptoKey) {
    let enc = new TextEncoder()
    let encodedMessage = enc.encode(message)
    var encryptedData = await window.crypto.subtle.encrypt(
        {
            name: 'RSA-OAEP',
        },
        cryptoKey,
        encodedMessage,
    )
    var encodedData = arrayBufferToBase64(encryptedData)
    return encodedData
}
