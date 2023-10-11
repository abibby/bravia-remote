import { braviaAPIFactory } from './internal'

export interface SetPowerStatusOptions {
    status: boolean
}

/**
 * @link https://pro-bravia.sony.net/develop/integrate/rest-api/spec/service/system/v1_0/setPowerStatus/index.html
 */
export const setPowerStatus = braviaAPIFactory<
    [options: SetPowerStatusOptions],
    void
>('system', 'setPowerStatus', '1.0')
