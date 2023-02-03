import { h } from 'preact'
import { useCallback } from 'preact/hooks'
import { sendRemoteCode } from '../bravia'
import styles from './d-pad.module.css'
import { Click, Swipe } from './swipe'

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
    return (
        <Swipe class={styles.dPad} onSwipe={swipe} onClick={click}>
            <div class={styles.up}></div>
            <div class={styles.down}></div>
            <div class={styles.left}></div>
            <div class={styles.right}></div>
        </Swipe>
    )
}
