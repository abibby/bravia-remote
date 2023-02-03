import { ip, psk } from '../config'

interface RPCCall {
    method: string
    id: number
    params: unknown[]
    version: string
}

interface RPCResponse<T> {
    result: T[]
}

export async function braviaAPI<TResult>(
    serviceName: string,
    body: RPCCall,
): Promise<TResult> {
    const response = await fetch(`http://${ip}/sony/${serviceName}`, {
        method: 'POST',
        headers: {
            'X-Auth-PSK': String(psk),
        },
        body: JSON.stringify(body),
    })

    const a: RPCResponse<TResult> = await response.json()
    return a.result[0]
}
