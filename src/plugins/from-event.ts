import { createDecorator } from 'vue-class-component'

export function FromEvent(selector: any, eventName: any, fn: any) {

    return createDecorator(function (options: any, key) {
        const { subscriptions = () => { } } = options

        options.subscriptions = function () {
            return {
                [key]: fn(this.$fromDOMEvent(selector, eventName)),
                ...subscriptions.bind(this)()
            }
        }
    })
}