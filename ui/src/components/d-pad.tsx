import { h } from 'preact'
import { useCallback } from 'preact/hooks'
import { sendRemoteCode } from '../bravia'
import styles from './d-pad.module.css'
import { Click, Swipe } from './swipe'
import { useMediaQuery } from '../hooks/use-media-query'
import classNames from 'classnames'
import { bind } from '@zwzn/spicy'
import { RemoteCommand } from '../bravia/ircc-ip'
import { useElementSize } from '../hooks/resize-effect'

h

export function DPad() {
    const swipe = useCallback((s: Swipe) => {
        switch (s.direction) {
            case 'up':
                sendRemoteCode('Up')
                break
            case 'down':
                sendRemoteCode('Down')
                break
            case 'left':
                sendRemoteCode('Left')
                break
            case 'right':
                sendRemoteCode('Right')
                break
        }
    }, [])
    const click = useCallback((c: Click) => {
        sendRemoteCode('Confirm')
    }, [])
    const touch = useMediaQuery('(hover: none) and (pointer: coarse)')

    const remote = useCallback(
        (key: RemoteCommand, e: Event) => {
            if (touch) {
                return
            }
            e.stopPropagation()
            sendRemoteCode(key)
        },
        [touch],
    )

    const [dPad, size] = useElementSize()

    return (
        <Swipe
            class={classNames(styles.dPad, {
                [styles.touch]: touch,
                [styles.key]: !touch,
            })}
            onSwipe={swipe}
            onClick={click}
            style={{
                '--width': size.width,
                '--height': size.height,
            }}
            htmlRef={dPad}
        >
            <div onClick={bind('Up', remote)} class={styles.up} />
            <div onClick={bind('Down', remote)} class={styles.down} />
            <div onClick={bind('Left', remote)} class={styles.left} />
            <div onClick={bind('Right', remote)} class={styles.right} />
            <div onClick={bind('Confirm', remote)} class={styles.enter} />
        </Swipe>
    )
}
