import { Config } from './config';
import { window } from './environment';

export class Main {
	private static instance: Main;

	/**
	 * Backup of the original xhr prototype and formdata original
	 */
	public XMLHttpRequest: any;
	public FormData: any;

	public static getInstance(config?: Config) {
		if (!this.instance) {
			this.instance = new Main(config);
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
