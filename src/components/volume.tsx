import { bind } from '@zwzn/spicy'
import classNames from 'classnames'
import { h } from 'preact'
import { useCallback, useRef, useState } from 'preact/hooks'
import { Click, Swipe, SwipeMove, SwipeStart } from './swipe'
import styles from './volume.module.css'

h

export function Volume() {
    const [volume, setVolume] = useState(0.5)
    const [touch, setTouch] = useState(0.5)
    const [oldVolume, setOldVolume] = useState(0.5)

    const [open, setOpen] = useState(false)

    const root = useRef<{ base: HTMLElement } | null>(null)
    const click = useCallback(
        (m: Click) => {
            const rect = root.current?.base?.getBoundingClientRect()

            if (rect === undefined) {
                return
            }
            setVolume(1 - m.current.y / rect.height)
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
                oldVolume + (m.start.y - m.current.y) / rect.height / 2
            setVolume(clamp(newVolume, 0, 1))
            setTouch(1 - m.current.y / rect.height)

            setOpen(true)
        },
        [root, oldVolume, setVolume, setTouch, setOpen],
    )

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
            onSwipe={bind(false, setOpen)}
            ref={root as any}
        >
            <div class={styles.current}>
                <div class={styles.value}>{Math.floor(volume * 50)}</div>
                <div class={styles.background}></div>
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
