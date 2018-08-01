declare module 'express-messages' {
    function init(options: string): any;

    namespace init {
        export let service: (options: string) => any;
    }

    export = init;
};