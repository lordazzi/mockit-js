import { StreamIOService } from './service/stream-io.service';
import { StorageIOService } from './service/storage-io.service';
import { IOInterface } from './interface/io.interface';
import { ConfigModel } from './model/config.model';
import { IOTypeEnum } from "./enum/IOType.enum";

export namespace MockitJs {
	export class NativeRequest extends XMLHttpRequest {

	}

	export class NativeFormData extends FormData {

	}
}

(<any>MockitJs).NativeRequest = XMLHttpRequest;
(<any>MockitJs).NativeFormData = FormData;

export class Main {
	private static instance: Main;

	private hasNetworkConnection: boolean = true;

	public IO: IOInterface;

	public static getInstance(config: ConfigModel) {
		if (!this.instance) {
			this.instance = new Main(config);
			if (config.IOType == IOTypeEnum.STORAGE) {
				this.instance.IO = StorageIOService.getInstance();
			} else if (config.IOType == IOTypeEnum.STREAM) {
				this.instance.IO = StreamIOService.getInstance();

			}
		}

		return this.instance;
	}

	private constructor(public config: ConfigModel) {
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