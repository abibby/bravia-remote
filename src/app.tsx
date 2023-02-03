import { Fragment, h, render } from 'preact'
import { DPad } from './components/d-pad'

import './app.css'
import { Volume } from './components/volume'

h

function App() {
    return (
        <Fragment>
            <DPad />
            <Volume />
        </Fragment>
    )
}

render(<App />, document.getElementById('app')!)
