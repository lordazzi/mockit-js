import { Config } from './config';
import { window } from './environment';

export namespace MockitJs {
    export class MockitJs {
        private static instance: MockitJs;

        /**
         * Backup of the original xhr prototype and formdata original
         */
        public XMLHttpRequest: any;
        public FormData: any;

        public static getInstance(config?: Config) {
            if (!this.instance) {
                this.instance = new MockitJs(config);
                this.instance.XMLHttpRequest = window.XMLHttpRequest;
                this.instance.FormData = window.FormData;
            }

            return this.instance;
        }

        private constructor(public config?: Config) {
            if (this.config == null) {
                this.config = new Config();
            }
        }
    }
}