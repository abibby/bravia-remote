import { braviaAPIFactory } from './internal'

export interface Application {
    title: string
    uri: string
    icon: string
}

export const getApplicationList = braviaAPIFactory<[], Application[]>(
    'appControl',
    'getApplicationList',
    '1.0',
)

export interface SetActiveAppOptions {
    uri: string
}

/**
 * @link https://pro-bravia.sony.net/develop/integrate/rest-api/spec/service/appcontrol/v1_0/setActiveApp/index.html
 */
export const setActiveApp = braviaAPIFactory<
    [options: SetActiveAppOptions],
    Application[]
>('appControl', 'setActiveApp', '1.0')
