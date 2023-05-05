import { h, JSX, RenderableProps } from 'preact'
import { Ref, useCallback, useRef } from 'preact/hooks'

h

export interface Point {
    x: number
    y: number
}

export type Direction = 'up' | 'down' | 'left' | 'right'

export interface SwipeStart {
    start: Point
}
export interface SwipeMove {
    start: Point
    current: Point
}
export interface Swipe {
    start: Point
    end: Point
    direction: Direction
}
export interface Click {
    current: Point
}

type SwipeProps = Omit<
    JSX.HTMLAttributes,
    'onTouchStart' | 'onTouchMove' | 'onTouchEnd' | 'onClick'
> & {
    onSwipeStart?: (move: SwipeStart) => void
    onSwipeMove?: (move: SwipeMove) => void
    onSwipe?: (swipe: Swipe) => void
    onClick?: (click: Click) => void
    htmlRef?: Ref<HTMLDivElement> | ((e: HTMLDivElement | null) => void)
}

export function Swipe(props: RenderableProps<SwipeProps>) {
    const swipeStart = useRef<Point>()
    const swipeEnd = useRef<Point>()

    const touchStart = useCallback(
        (e: TouchEvent) => {
            swipeStart.current = getTouchPoint(e)
            props.onSwipeStart?.({
                start: swipeStart.current,
            })
        },
        [swipeStart, props.onSwipeStart],
    )
    const touchMove = useCallback(
        (e: TouchEvent) => {
            if (swipeStart.current === undefined) {
                return
            }
            e.preventDefault()
            swipeEnd.current = getTouchPoint(e)

            props.onSwipeMove?.({
                start: swipeStart.current,
                current: swipeEnd.current,
            })
        },
        [swipeEnd, props.onSwipeMove],
    )
    const touchEnd = useCallback(
        (e: TouchEvent) => {
            if (
                swipeStart.current === undefined ||
                swipeEnd.current === undefined
            ) {
                return
            }
            const dx = swipeStart.current.x - swipeEnd.current.x
            const dy = swipeStart.current.y - swipeEnd.current.y

            let dir: Direction
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0) {
                    dir = 'left'
                } else {
                    dir = 'right'
                }
            } else {
                if (dy > 0) {
                    dir = 'up'
                } else {
                    dir = 'down'
                }
            }

            props.onSwipe?.({
                direction: dir,
                start: swipeStart.current,
                end: swipeEnd.current,
            })
            swipeStart.current = undefined
            swipeEnd.current = undefined
        },
        [swipeStart, swipeEnd, props.onSwipe],
    )

    const click = useCallback(
        (e: MouseEvent) => {
            props.onClick?.({
                current: {
                    x: e.clientX,
                    y: e.clientY,
                },
            })
        },
        [props.onClick],
    )

    return (
        <div
            {...props}
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
            onClick={click}
            ref={props.htmlRef}
        >
            {props.children}
        </div>
    )
}

function getTouchPoint(e: TouchEvent): Point {
    return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
    }
}
