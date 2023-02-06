import { bind } from '@zwzn/spicy'
import { Fragment, h, render } from 'preact'
import './app.css'
import { sendRemoteCode } from './bravia'
import { getApplicationList, setActiveApp } from './bravia/appControl'
import { Buttons } from './components/buttons'
import { DPad } from './components/d-pad'
import { Settings } from './components/settings'
import { Volume } from './components/volume'

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
            </Buttons>
            <Settings />
        </Fragment>
    )
}

render(<App />, document.getElementById('app')!)
