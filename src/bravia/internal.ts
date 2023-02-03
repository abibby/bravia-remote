import { getGlobalState } from '../hooks/use-global-state'

interface RPCCall {
    method: string
    id: number
    params: unknown[]
    version: string
}

type RPCResponse<T> =
    | {
          result: T[]
      }
    | {
          error: [number, string]
          id: number
      }

export async function braviaAPI<TResult>(
    serviceName: string,
    body: RPCCall,
): Promise<TResult> {
    const ip = await getGlobalState('ip')
    const psk = await getGlobalState('psk')

    const response = await fetch(`http://${ip}/sony/${serviceName}`, {
        method: 'POST',
        headers: {
            'X-Auth-PSK': String(psk),
        },
        body: JSON.stringify(body),
    })

    const a: RPCResponse<TResult> = await response.json()

    if ('error' in a) {
        throw new Error(a.error[1])
    }

    return a.result[0]
}
