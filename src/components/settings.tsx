import { bindValue } from '@zwzn/spicy'
import { h } from 'preact'
import { useGlobalState } from '../hooks/use-global-state'
import styles from './settings.module.css'

h

export function Settings() {
    const [ip, setIP] = useGlobalState('ip', '')
    const [psk, setPSK] = useGlobalState('psk', '')
    return (
        <div class={styles.settings}>
            <input type='text' value={ip} onInput={bindValue(setIP)} />
            <input type='text' value={psk} onInput={bindValue(setPSK)} />
        </div>
    )
}
