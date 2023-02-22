import classNames from 'classnames'
import { h } from 'preact'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { audio, sendRemoteCode } from '../bravia'
import { useSimpleIP } from '../hooks/use-simple-ip'
import { sleep } from '../utils/sleep'
import { Click, Swipe, SwipeMove, SwipeStart } from './swipe'
import styles from './volume.module.css'

h

async function smartSetVolume(volume: number): Promise<void> {
    const volumeInformation = await audio
        .getVolumeInformation()
        .then(v => v.find(v => v.target === 'speaker'))
    if (volumeInformation === undefined) {
        throw new Error('no volume')
    }

    const maxVolume = volumeInformation.maxVolume
    const currentVolume = volumeInformation.volume
    const targetVolume = Math.floor(volume * maxVolume)

    // await audio.setAudioVolume({
    //     target: '',
    //     ui: 'on',
    //     volume: String(targetVolume),
    // })

    // const newVolumeInformation = await audio
    //     .getVolumeInformation()
    //     .then(v => v.find(v => v.target === 'speaker'))

    // if (newVolumeInformation?.volume === currentVolume) {
    for (let i = 0; i < Math.abs(currentVolume - targetVolume) * 2; i++) {
        if (currentVolume < targetVolume) {
            await sendRemoteCode('VolumeUp')
        } else {
            await sendRemoteCode('VolumeDown')
        }
        await sleep(300)
    }
    // }
}

export function Volume() {
    const [volume, setVolume] = useState(0.5)
    const [maxVolume, setMaxVolume] = useState(100)
    const [touch, setTouch] = useState(0.5)
    const [oldVolume, setOldVolume] = useState(0.5)
    const [updatingVolume, setUpdatingVolume] = useState(false)

    const [open, setOpen] = useState(false)

    useEffect(() => {
        audio.getVolumeInformation().then(v => {
            const originalVolume = v.find(v => v.target === 'speaker')
            if (originalVolume === undefined) {
                return
            }
            setMaxVolume(originalVolume.maxVolume)
            setVolume(originalVolume.volume / originalVolume.maxVolume)
        })
    }, [setVolume, setMaxVolume])

    useSimpleIP(
        'volume',
        newVolume => {
            if (updatingVolume) {
                return
            }
            setVolume(volume => {
                if (Math.abs(volume * maxVolume - newVolume) > 1) {
                    return newVolume / maxVolume
                }
                return volume
            })
        },
        [updatingVolume, setVolume, maxVolume],
    )

    const root = useRef<{ base: HTMLElement } | null>(null)
    const click = useCallback(
        async (m: Click) => {
            const rect = root.current?.base?.getBoundingClientRect()

            if (rect === undefined) {
                return
            }
            const newVolume = 1 - m.current.y / rect.height
            setVolume(newVolume)
            setUpdatingVolume(true)
            await smartSetVolume(newVolume)
            setUpdatingVolume(false)
        },
        [root, setVolume],
    )

    const start = useCallback(
        (m: SwipeStart) => {
            setOldVolume(volume)
        },
        [volume, setOldVolume],
    )
    const move = useCallback(
        (m: SwipeMove) => {
            const rect = root.current?.base?.getBoundingClientRect()

            if (rect === undefined) {
                return
            }

            const newVolume =
                oldVolume + (m.start.y - m.current.y) / rect.height
            setVolume(clamp(newVolume, 0, 1))
            setTouch(1 - m.current.y / rect.height)

            setOpen(true)
        },
        [root, oldVolume, setVolume, setTouch, setOpen],
    )

    const end = useCallback(async () => {
        setOpen(false)
        setUpdatingVolume(true)
        await smartSetVolume(volume)
        setUpdatingVolume(false)
    }, [volume])

    return (
        <Swipe
            class={classNames(styles.volume, {
                [styles.open]: open,
                [styles.updating]: updatingVolume,
            })}
            style={{
                '--volume': volume,
                '--touch': touch,
            }}
            onSwipeStart={start}
            onSwipeMove={move}
            onClick={click}
            onSwipe={end}
            ref={root as any}
        >
            <div class={styles.current}>
                <div class={styles.background}></div>
                <div class={styles.value}>{Math.floor(volume * maxVolume)}</div>
            </div>
        </Swipe>
    )
}

function clamp(v: number, min: number, max: number): number {
    if (v < min) {
        return min
    }
    if (v > max) {
        return max
    }
    return v
}
