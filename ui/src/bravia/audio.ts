import { braviaAPIFactory } from './internal'

export interface Volume {
    volume: number
    minVolume: number
    mute: boolean
    maxVolume: number
    target: 'speaker' | 'headphone'
}

export const getVolumeInformation = braviaAPIFactory<[], Volume[]>(
    'audio',
    'getVolumeInformation',
    '1.0',
)

export interface SetAudioVolumeOptions {
    target: '' | 'speaker' | 'headphone'
    volume: string
    ui: 'on' | 'off' | null
}

/**
 * @link https://pro-bravia.sony.net/develop/integrate/rest-api/spec/service/audio/v1_2/setAudioVolume/index.html
 */
export const setAudioVolume = braviaAPIFactory<
    [options: SetAudioVolumeOptions],
    void
>('audio', 'setAudioVolume', '1.2')
