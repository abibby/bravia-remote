import { braviaAPIFactory } from './internal'

export interface GetPublicKeyResult {
    publicKey: string
}

export const getPublicKey = braviaAPIFactory<[], GetPublicKeyResult>(
    'encryption',
    'getPublicKey',
    '1.0',
)

export interface GetSecretDataOptions {
    encKey: string
}
export interface GetSecretDataResult {
    secretData: string
}

export const getSecretData = braviaAPIFactory<
    [options: GetSecretDataOptions],
    GetSecretDataResult
>('encryption', 'getSecretData', '1.0')
