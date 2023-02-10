import classNames from 'classnames'
import { h } from 'preact'
import { useCallback, useEffect, useRef, useState } from 'preact/hooks'
import { audio, sendRemoteCode } from '../bravia'
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

    await audio.setAudioVolume({
        target: '',
        ui: 'on',
        volume: String(targetVolume),
    })

    const newVolumeInformation = await audio
        .getVolumeInformation()
        .then(v => v.find(v => v.target === 'speaker'))

    if (newVolumeInformation?.volume === currentVolume) {
        for (let i = 0; i < Math.abs(currentVolume - targetVolume); i++) {
            if (currentVolume < targetVolume) {
                await sendRemoteCode('VolumeUp')
            } else {
                await sendRemoteCode('VolumeDown')
            }
            await sleep(300)
        }
    }
}

export function Volume() {
    const [volume, setVolume] = useState(0.5)
    const [maxVolume, setMaxVolume] = useState(100)
    const [touch, setTouch] = useState(0.5)
    const [oldVolume, setOldVolume] = useState(0.5)

    const [open, setOpen] = useState(false)

    useEffect(() => {
        function updateVolume() {
            audio.getVolumeInformation().then(v => {
                const originalVolume = v.find(v => v.target === 'speaker')
                if (originalVolume !== undefined) {
                    setMaxVolume(originalVolume.maxVolume)
                    const newVolume =
                        originalVolume.volume / originalVolume.maxVolume
                    setVolume(volume => {
                        if (
                            Math.abs(volume - newVolume) *
                                originalVolume.maxVolume >
                            1
                        ) {
                            return newVolume
                        }
                        return volume
                    })
                }
            })
        }
        updateVolume()

        const cancel = setInterval(updateVolume, 10_000)

        return () => {
            clearInterval(cancel)
        }
    }, [])

    const root = useRef<{ base: HTMLElement } | null>(null)
    const click = useCallback(
        async (m: Click) => {
            const rect = root.current?.base?.getBoundingClientRect()

            if (rect === undefined) {
                return
            }
            const newVolume = 1 - m.current.y / rect.height
            setVolume(newVolume)
            await smartSetVolume(newVolume)
        },
        [root, setVolume],
    )

    const start = useCallback(
        (m: SwipeStart) => {
            console.log('start', volume)

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
        await smartSetVolume(volume)
    }, [volume])

    return (
        <Swipe
            class={classNames(styles.volume, { [styles.open]: open })}
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