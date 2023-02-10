import EventTarget, { Event } from 'event-target-shim'

export enum Commands {
    SetPowerStatusOn = '*SCPOWR0000000000000001',
    SetPowerStatusOff = '*SCPOWR0000000000000000',
    GetPowerStatus = '*SEPOWR################',
    TogglePowerStatus = '*SEPOWR################',
    GetAudioVolume = '*SEVOLU################',
    SetAudioMuteOn = '*SCAMUT0000000000000001',
    SetAudioMuteOff = '*SCAMUT0000000000000000',
    GetAudioMute = '*SEAMUT################',
    SetPictureMuteOn = '*SCPMUT0000000000000001',
    SetPictureMuteOff = '*SCPMUT0000000000000000',
}

export type SimpleIPEventDataTypeMap = {
    power: boolean
    input: string
    volume: number
    audioMute: boolean
    pictureMute: boolean
}

export class SimpleIPEvent<
    TEventType extends string,
> extends Event<TEventType> {
    constructor(
        eventType: TEventType,
        public readonly data: TEventType extends keyof SimpleIPEventDataTypeMap
            ? SimpleIPEventDataTypeMap[TEventType]
            : string,
    ) {
        super(eventType)
    }
}

export type SimpleIPEventMap = {
    power: SimpleIPEvent<'power'>
    input: SimpleIPEvent<'input'>
    volume: SimpleIPEvent<'volume'>
    audioMute: SimpleIPEvent<'audioMute'>
    pictureMute: SimpleIPEvent<'pictureMute'>
    [key: string]: SimpleIPEvent<string>
}

export class SimpleIP extends EventTarget<SimpleIPEventMap> {
    public readonly ready: Promise<void>

    private readonly ws: WebSocket

    constructor() {
        super()

        const proto = location.protocol.replace('http', 'ws')
        this.ws = new WebSocket(`${proto}//${location.host}/sony/simple-ip`)
        // Connection opened
        this.ready = new Promise(resolve => {
            this.ws.addEventListener(
                'open',
                () => {
                    resolve()
                },
                { once: true },
            )
        })

        this.ws.addEventListener('message', e => {
            const header = e.data[2]
            const messageType = e.data.slice(3, 7)
            const message = e.data.slice(7)
            this.dispatchEvent(
                new SimpleIPEvent<string>(header + messageType, message),
            )

            if (header === 'N') {
                const messageType = e.data.slice(3, 7)
                const message = e.data.slice(7)

                switch (messageType) {
                    case 'POWR':
                        this.dispatchEvent(
                            new SimpleIPEvent('power', Number(message) === 1),
                        )
                    case 'INPT':
                        this.dispatchEvent(new SimpleIPEvent('input', message))
                    case 'VOLU':
                        this.dispatchEvent(
                            new SimpleIPEvent('volume', Number(message)),
                        )
                    case 'AMUT':
                        this.dispatchEvent(
                            new SimpleIPEvent(
                                'audioMute',
                                Number(message) === 1,
                            ),
                        )
                    case 'PMUT':
                        this.dispatchEvent(
                            new SimpleIPEvent(
                                'pictureMute',
                                Number(message) === 1,
                            ),
                        )
                }
            }
        })
    }

    public send(message: Commands): Promise<string> {
        return new Promise(async resolve => {
            await this.ready

            this.addEventListener(
                'A' + message.slice(3, 7),
                e => {
                    resolve(e.data)
                },
                {
                    once: true,
                },
            )
            this.ws.send(message)
        })
    }
}