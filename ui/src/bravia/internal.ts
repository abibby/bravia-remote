interface RPCCall {
    method: string
    id: number
    params: unknown[]
    version: string
}

type RPCResponse<T> =
    | {
          result: T[]
          id: number
      }
    | {
          error: [number, string]
          id?: number
      }

export async function braviaAPI<TResult>(
    serviceName: string,
    body: RPCCall,
): Promise<RPCResponse<TResult>> {
    const response = await fetch(`/sony/${serviceName}`, {
        credentials: 'include',
        method: 'POST',
        body: JSON.stringify(body),
    })

    return await response.json()
}

let id = 1

export function braviaAPIFactory<TArgs extends unknown[], TResult>(
    serviceName: string,
    method: string,
    version: string,
): (...args: TArgs) => Promise<TResult> {
    return async (...args) => {
        let _id = id++
        const response = await braviaAPI<TResult>(serviceName, {
            method: method,
            id: _id,
            params: args,
            version: version,
        })

        if ('error' in response) {
            throw new Error(response.error[1])
        }

        if (response.id !== _id) {
            throw new Error('mismatched id')
        }

        return response.result[0]
    }
}
