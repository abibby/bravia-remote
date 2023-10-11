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

export interface GetTextFormOptions {
    encKey: string
}
export interface GetTextFormResult {
    text: string
}

/**
 * @link https://pro-bravia.sony.net/develop/integrate/rest-api/spec/service/appcontrol/v1_1/getTextForm/index.html
 */
export const getTextForm = braviaAPIFactory<
    [options: GetTextFormOptions],
    GetTextFormResult
>('appControl', 'getTextForm', '1.1')

export interface SetTextFormResult {}
/**
 * @link https://pro-bravia.sony.net/develop/integrate/rest-api/spec/service/appcontrol/v1_0/setTextForm/index.html
 */
export const setTextForm = braviaAPIFactory<
    [message: string],
    SetTextFormResult
>('appControl', 'setTextForm', '1.0')
