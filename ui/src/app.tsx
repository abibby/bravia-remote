import { bind } from '@zwzn/spicy'
import classNames from 'classnames'
import { Fragment, h, render } from 'preact'
import './app.css'
import styles from './app.module.css'
import { sendRemoteCode } from './bravia'
import { getApplicationList, setActiveApp } from './bravia/appControl'
import { Buttons } from './components/buttons'
import { DPad } from './components/d-pad'
import { Volume } from './components/volume'
import { usePictureMute, usePowerStatus } from './hooks/use-simple-ip'

h

async function openApp(title: string) {
    const apps = await getApplicationList()
    const app = apps.find(app => app.title === title)
    if (app === undefined) {
        return
    }
    await setActiveApp({ uri: app.uri })
    await sendRemoteCode('Confirm')
}

async function openWebApp(url: string) {
    await setActiveApp({
        uri: `localapp://webappruntime?url=${encodeURIComponent(url)}`,
    })
}

function App() {
    const [power, setPower] = usePowerStatus()
    const [pictureMute, setPictureMute] = usePictureMute()
    return (
        <Fragment>
            <DPad />
            <Volume />
            <Buttons>
                <button onClick={bind('YouTube Music', openApp)}>Music</button>
                <button onClick={bind('Play', sendRemoteCode)}>Play</button>
                <button onClick={bind('Back', sendRemoteCode)}>Back</button>

                <button onClick={bind('Plex', openApp)}>Plex</button>
                <button onClick={bind('Pause', sendRemoteCode)}>Pause</button>
                <button onClick={bind('Home', sendRemoteCode)}>Home</button>

                <button
                    class={classNames({ [styles.powerOff]: !power })}
                    onClick={bind(!power, setPower)}
                >
                    {power ? 'Power Off' : 'Power On'}
                </button>
                <button onClick={bind(!pictureMute, setPictureMute)}>
                    {pictureMute ? 'Screen On' : 'Screen Off'}
                </button>
            </Buttons>
            {/* <Settings /> */}
        </Fragment>
    )
}

render(<App />, document.getElementById('app')!)
