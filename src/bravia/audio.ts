import { braviaAPI } from './internal'

export interface Volume {
    volume: number
    minVolume: number
    mute: boolean
    maxVolume: number
    target: 'speaker' | 'headphone'
}

export function getVolumeInformation(): Promise<Volume[]> {
    return braviaAPI('audio', {
        id: 1,
        method: 'getVolumeInformation',
        params: [],
        version: '1.0',
    })
}

export interface SetAudioVolumeOptions {
    target: '' | 'speaker' | 'headphone'
    volume: string
    ui: 'on' | 'off' | null
}

/**
 * @link https://pro-bravia.sony.net/develop/integrate/rest-api/spec/service/audio/v1_2/setAudioVolume/index.html
 */
export function setAudioVolume(
    options: SetAudioVolumeOptions,
): Promise<Volume[]> {
    return braviaAPI('audio', {
        id: 1,
        method: 'setAudioVolume',
        params: [options],
        version: '1.0',
    })
}
