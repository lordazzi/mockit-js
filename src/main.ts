import { ConfigModel } from './model/config.model';
import { window } from './environment';

export class Main {
	private static instance: Main;

	/**
	 * Backup of the original xhr prototype and formdata original
	 */
	public XMLHttpRequest: any;
	public FormData: any;
	private hasNetworkConnection: boolean = true;

	public static getInstance(config?: ConfigModel) {
		if (!this.instance) {
			this.instance = new Main(config);
			this.instance.XMLHttpRequest = window.XMLHttpRequest;
			this.instance.FormData = window.FormData;
		}

		return this.instance;
	}

	private constructor(public config?: ConfigModel) {
		if (this.config == null) {
			this.config = new ConfigModel();
		}
	}

	/**
	 * @method removeNetworkCable
	 * 
	 * Faz com que as requisições mocadas comecem a lençar erro 0, simbolizando
	 * a ausência de conexão com o servidor.
	 *
	 * Esta funcionalidade serve para mocar situações onde um problema na rede
	 * ou no servidor possa lançar um problema em uma situação onde um conjunto
	 * de serviços que se interdependem estão sendo consumidos pelo front end e
	 * um deles falha.
	 */
	public removeNetworkCable(): void {
		this.hasNetworkConnection = false;
	}

	/**
	 * @method plugNetworkCable
	 * 
	 * Reconecta o cabo com a rede ficticia
	 * 
	 * Esta funcionalidade serve para mocar situações onde um problema na rede
	 * ou no servidor possa lançar um problema em uma situação onde um conjunto
	 * de serviços que se interdependem estão sendo consumidos pelo front end e
	 * um deles falha.
	 */
	public plugNetworkCable(): void {
		this.hasNetworkConnection = true;
	}
}
