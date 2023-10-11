import { bind } from '@zwzn/spicy'
import classNames from 'classnames'
import { Fragment, h, render } from 'preact'
import './app.css'
import styles from './app.module.css'
import { avContent, sendRemoteCode, system } from './bravia'
import {
    getApplicationList,
    getTextForm,
    setActiveApp,
} from './bravia/appControl'
import { Buttons } from './components/buttons'
import { DPad } from './components/d-pad'
import { Volume } from './components/volume'
import { usePictureMute, usePowerStatus } from './hooks/use-simple-ip'
import { getPublicKey } from './bravia/encryption'
import { sendText } from './utils/send-text'
import { useCallback } from 'preact/hooks'

h

async function openApp(title: string) {
    const apps = await getApplicationList()
    const app = apps.find(app => app.title === title)
    if (app === undefined) {
        return
    }
    await setActiveApp({ uri: app.uri })
    // await sendRemoteCode('Confirm')
}

async function openWebApp(url: string) {
    await setActiveApp({
        uri: `localapp://webappruntime?url=${encodeURIComponent(url)}`,
    })
}

async function powerOnAndOpenApp(title: string) {
    await system.setPowerStatus({ status: true })
    await openApp(title)
}
async function powerOnAndSetInput(port: number) {
    await system.setPowerStatus({ status: true })
    await avContent.setPlayContent({uri:`extInput:hdmi?port=${port}`})
}

function App() {
    const [power, setPower] = usePowerStatus()
    const [pictureMute, setPictureMute] = usePictureMute()

    return (
        <Fragment>
            <DPad />
            <Volume />
            <Buttons>
                <button onClick={bind(2, powerOnAndSetInput)}>Switch</button>
                <button onClick={bind('Play', sendRemoteCode)}>Play</button>
                <button onClick={bind('Back', sendRemoteCode)}>Back</button>

                <button onClick={bind('Plex', powerOnAndOpenApp)}>Plex</button>
                <button onClick={bind('Pause', sendRemoteCode)}>Pause</button>
                <button onClick={bind('Home', sendRemoteCode)}>Home</button>

                {/* <button onClick={bind("https://google.com", openWebApp)}>Switch</button>
                <div />
                <div /> */}

                <button onClick={bind(4, powerOnAndSetInput)}>PC</button>
                <button onClick={bind(!power, setPower)}>
                    {power ? 'Power Off' : 'Power On'}
                </button>
                <button onClick={bind(!pictureMute, setPictureMute)}>
                    {pictureMute ? 'Screen On' : 'Screen Off'}
                </button>

                {/* <button>Keyboard</button> */}
            </Buttons>
            {/* <div>
                <form onSubmit={sendText}>
                    <input type='text' />
                    <button type='submit'>Send</button>
                </form>
            </div> */}
            {/* <Settings /> */}
        </Fragment>
    )
}

render(<App />, document.getElementById('app')!)
