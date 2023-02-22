import { Inputs, useEffect, useState } from 'preact/hooks'
import { SimpleIP, SimpleIPEvent, SimpleIPEventDataTypeMap } from '../simple-ip'

export const simpleIP = new SimpleIP()

export function useSimpleIP<K extends keyof SimpleIPEventDataTypeMap>(
    type: K,
    callback: (event: SimpleIPEventDataTypeMap[K]) => void,
    inputs: Inputs,
) {
    useEffect(() => {
        const cb = (e: SimpleIPEvent<any>) => {
            callback(e.data)
        }

        simpleIP.addEventListener(type, cb)

        return () => {
            simpleIP.removeEventListener(type, cb)
        }
    }, inputs)
}

function factory<K extends keyof SimpleIPEventDataTypeMap>(
    type: K,
    get: () => Promise<SimpleIPEventDataTypeMap[K]>,
    set: (value: SimpleIPEventDataTypeMap[K]) => Promise<void>,
    defaultValue: SimpleIPEventDataTypeMap[K],
) {
    type T = SimpleIPEventDataTypeMap[K]

    return (): [T, (status: T) => void] => {
        const [status, setStatus] = useState(defaultValue)
        useEffect(() => {
            get.call(simpleIP).then(s => setStatus(s))
        }, [])
        useSimpleIP(
            type,
            value => {
                setStatus(value)
            },
            [setStatus],
        )
        return [
            status,
            async status => {
                setStatus(status)
                await set.call(simpleIP, status)
            },
        ]
    }
}

export const usePowerStatus = factory(
    'power',
    simpleIP.getPowerStatus,
    simpleIP.setPowerStatus,
    false,
)
export const usePictureMute = factory(
    'pictureMute',
    simpleIP.getPictureMute,
    simpleIP.setPictureMute,
    false,
)
export const useVolume = factory(
    'volume',
    simpleIP.getVolume,
    simpleIP.setVolume,
    0,
)
