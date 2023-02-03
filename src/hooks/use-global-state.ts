import EventTarget, { Event } from 'event-target-shim'
import { createStore, get, set } from 'idb-keyval'
import { useCallback, useEffect, useState } from 'preact/hooks'

class ChangeEvent extends Event<'change'> {
    constructor(public readonly name: string, public readonly value: any) {
        super('change')
    }
}

type EventMap = {
    change: ChangeEvent
}

const target = new EventTarget<EventMap, 'strict'>()
const store = createStore('global-state', 'global-state')

export function useGlobalState<T>(
    name: string,
    defaultValue: T,
): [T, (v: T) => void] {
    const [value, setValue] = useState(defaultValue)
    const change = useCallback(async (newValue: T) => {
        await set(name, newValue, store)
        target.dispatchEvent(new ChangeEvent(name, newValue))
    }, [])

    useEffect(() => {
        get(name, store).then(newValue => setValue(newValue))

        const change = (e: ChangeEvent) => {
            if (e.name === name) {
                setValue(e.value)
            }
        }

        target.addEventListener('change', change)

        return () => {
            target.removeEventListener('change', change)
        }
    }, [])
    return [value, change]
}

export async function getGlobalState<T>(name: string): Promise<T | undefined> {
    return get<T>(name, store)
}
