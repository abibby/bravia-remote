const codes = {
    Power: 'AAAAAQAAAAEAAAAVAw==',
    Input: 'AAAAAQAAAAEAAAAlAw==',
    SyncMenu: 'AAAAAgAAABoAAABYAw==',
    Hdmi1: 'AAAAAgAAABoAAABaAw==',
    Hdmi2: 'AAAAAgAAABoAAABbAw==',
    Hdmi3: 'AAAAAgAAABoAAABcAw==',
    Hdmi4: 'AAAAAgAAABoAAABdAw==',
    Num1: 'AAAAAQAAAAEAAAAAAw==',
    Num2: 'AAAAAQAAAAEAAAABAw==',
    Num3: 'AAAAAQAAAAEAAAACAw==',
    Num4: 'AAAAAQAAAAEAAAADAw==',
    Num5: 'AAAAAQAAAAEAAAAEAw==',
    Num6: 'AAAAAQAAAAEAAAAFAw==',
    Num7: 'AAAAAQAAAAEAAAAGAw==',
    Num8: 'AAAAAQAAAAEAAAAHAw==',
    Num9: 'AAAAAQAAAAEAAAAIAw==',
    Num0: 'AAAAAQAAAAEAAAAJAw==',
    Dot: 'AAAAAgAAAJcAAAAdAw==',
    CC: 'AAAAAgAAAJcAAAAoAw==',
    Red: 'AAAAAgAAAJcAAAAlAw==',
    Green: 'AAAAAgAAAJcAAAAmAw==',
    Yellow: 'AAAAAgAAAJcAAAAnAw==',
    Blue: 'AAAAAgAAAJcAAAAkAw==',
    Up: 'AAAAAQAAAAEAAAB0Aw==',
    Down: 'AAAAAQAAAAEAAAB1Aw==',
    Right: 'AAAAAQAAAAEAAAAzAw==',
    Left: 'AAAAAQAAAAEAAAA0Aw==',
    Confirm: 'AAAAAQAAAAEAAABlAw==',
    Help: 'AAAAAgAAAMQAAABNAw==',
    Display: 'AAAAAQAAAAEAAAA6Aw==',
    Options: 'AAAAAgAAAJcAAAA2Aw==',
    Back: 'AAAAAgAAAJcAAAAjAw==',
    Home: 'AAAAAQAAAAEAAABgAw==',
    VolumeUp: 'AAAAAQAAAAEAAAASAw==',
    VolumeDown: 'AAAAAQAAAAEAAAATAw==',
    Mute: 'AAAAAQAAAAEAAAAUAw==',
    Audio: 'AAAAAQAAAAEAAAAXAw==',
    ChannelUp: 'AAAAAQAAAAEAAAAQAw==',
    ChannelDown: 'AAAAAQAAAAEAAAARAw==',
    Play: 'AAAAAgAAAJcAAAAaAw==',
    Pause: 'AAAAAgAAAJcAAAAZAw==',
    Stop: 'AAAAAgAAAJcAAAAYAw==',
    FlashPlus: 'AAAAAgAAAJcAAAB4Aw==',
    FlashMinus: 'AAAAAgAAAJcAAAB5Aw==',
    Prev: 'AAAAAgAAAJcAAAA8Aw==',
    Next: 'AAAAAgAAAJcAAAA9Aw==',
}

export type RemoteCommand = keyof typeof codes

export async function sendRemoteCode(command: RemoteCommand) {
    await fetch(`/sony/IRCC`, {
        credentials: 'include',
        headers: {
            Accept: '*/*',
            'Accept-Language': 'en-US,en;q=0.5',
            'Content-Type': 'text/xml; charset=UTF-8',
            SOAPAction: '"urn:schemas-sony-com:service:IRCC:1#X_SendIRCC"',
        },
        referrer: 'http://www.aczoom.com/',
        body: `<?xml version="1.0"?>
      <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
          <u:X_SendIRCC xmlns:u="urn:schemas-sony-com:service:IRCC:1">
            <IRCCCode>${codes[command]}</IRCCCode>
          </u:X_SendIRCC>
        </s:Body>
      </s:Envelope>`,
        method: 'POST',
        mode: 'cors',
    })
}
