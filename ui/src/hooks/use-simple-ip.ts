import { Inputs, useEffect, useState } from 'preact/hooks'
import {
    Commands,
    SimpleIP,
    SimpleIPEvent,
    SimpleIPEventDataTypeMap,
} from '../simple-ip'

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

export function usePowerStatus(): [boolean, (status: boolean) => void] {
    const [status, setStatus] = useState(false)
    useSimpleIP(
        'power',
        power => {
            setStatus(power)
        },
        [setStatus],
    )
    return [
        status,
        async status => {
            if (status) {
                await simpleIP.send(Commands.SetPowerStatusOn)
            } else {
                await simpleIP.send(Commands.SetPowerStatusOff)
            }
        },
    ]
}

export function usePictureMute(): [boolean, (status: boolean) => void] {
    const [status, setStatus] = useState(false)
    useSimpleIP(
        'pictureMute',
        muted => {
            setStatus(muted)
        },
        [setStatus],
    )
    return [
        status,
        async status => {
            if (status) {
                await simpleIP.send(Commands.SetPictureMuteOn)
            } else {
                await simpleIP.send(Commands.SetPictureMuteOff)
            }
        },
    ]
}
