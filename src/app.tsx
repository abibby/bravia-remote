import { bind } from '@zwzn/spicy'
import { Fragment, h, render } from 'preact'
import './app.css'
import { sendRemoteCode } from './bravia'
import { Buttons } from './components/buttons'
import { DPad } from './components/d-pad'
import { Settings } from './components/settings'
import { Volume } from './components/volume'

h

function App() {
    return (
        <Fragment>
            <DPad />
            <Volume />
            <Buttons>
                <button>Music</button>
                <button onClick={bind('Play', sendRemoteCode)}>Play</button>
                <button onClick={bind('Back', sendRemoteCode)}>Back</button>

                <button>Plex</button>
                <button onClick={bind('Pause', sendRemoteCode)}>Pause</button>
                <button onClick={bind('Home', sendRemoteCode)}>Home</button>
            </Buttons>
            <Settings />
        </Fragment>
    )
}

render(<App />, document.getElementById('app')!)
