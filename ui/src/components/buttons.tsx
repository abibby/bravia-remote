import { h, RenderableProps } from 'preact'
import styles from './buttons.module.css'

h

export function Buttons({ children }: RenderableProps<{}>) {
    return <div class={styles.buttons}>{children}</div>
}
