import { h } from 'preact'
import { useCallback } from 'preact/hooks'
import styles from './d-pad.module.css'
import { Click, Swipe } from './swipe'

h

export function DPad() {
    const swipe = useCallback((s: Swipe) => {
        console.log(s)
    }, [])
    const click = useCallback((c: Click) => {
        console.log(c)
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
