declare namespace window {
	 var XMLHttpRequest: any;
	 var FormData: any;
}

 namespace MockitJs {
	 class NativeRequest extends XMLHttpRequest {

	}

	 class NativeFormData extends FormData {

	}
}


(<any>MockitJs).NativeRequest = XMLHttpRequest;
(<any>MockitJs).NativeFormData = FormData;

 class Main {
	private static instance: Main;

	private hasNetworkConnection: boolean = true;

	public version: string = '3.0.0';

	public IO: IOInterface;

	public static getInstance(config?: ConfigModel) {
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

	public isNetworkConnectable(): boolean {
		return this.hasNetworkConnection;
	}

	/**
	 * @method stopHttp
	 * Faz com que a página pare de ler as requisições
	 * http e leia somente as informações do mock, é 
	 * lembrar que nada dentro da página será capaz de efetuar
	 * requisições http enquanto a leitura por mock estiver
	 * habilitada
	 */
	public stopHttp(){
		window.XMLHttpRequest	= RequestSpyInterceptor;
	};

	/**
	 * @method playHttp
	 * Para de ler as informações do mock e volta a fazer
	 * as requisições http normalmente
	 */
	public playHttp(){
		window.XMLHttpRequest = MockitJs.NativeRequest;
	};

	/**
	 * @method loadFromHttp
	 * Faz a chamada de uma requisição http para abrir o arquivo de mock,
	 * este método é utilizado para quando o mock precisa ser lido para o
	 * uso deles nos testes
	 *
	 * @param {String} path
	 * Localização do arquivo de mock
	 * 
	 * @param {Function} callback
	 * Função executada quando o arquivo já foi enviado e o mock
	 * setado
	 * 
	 * @param {Boolean|Error} callback.hasError
	 * Retorna um objeto de erro caso não tenha sido possível ler
	 * o arquivo, caso contrário retorna false
	 */
	public loadFromHttp(path: string, calle: Function){
		var xhr = new MockitJs.NativeRequest;
		xhr.open('GET', path, true);
		xhr.onreadystatechange = () => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				var name = path.match(/[^\/]+$/)[0];
				var isOpen = Main.getInstance().IO.declareFileOpen(
					name, xhr.responseText
				);
				if (calle && calle.constructor == Function) { calle(isOpen); }
			}
		};

		xhr.send();
	};

	/**
	 * @method loadFromDialog
	 * Evoca um open file dialog do sistema para que o usuário
	 * entregue ao MockitJs um arquivo com mock salvo
	 *
	 * @param {Function} callback
	 * Função executada quando o arquivo já foi enviado e o mock
	 * setado
	 * 	@param {Boolean|Error} callback.hasError
	 * 	Retorna um objeto de erro caso não tenha sido possível ler
	 * 	o arquivo, caso contrário retorna false
	 */
	public loadFromDialog(calle: Function){
		setTimeout(function(){
			var i = document.createElement('input');
			i.setAttribute('type', 'file');

			i.addEventListener('change', function(){
				var file = this.files[0];
				var fr = new FileReader();
				fr.onload = function(){
					var isOpen = Main.getInstance().IO.declareFileOpen(
						file.name, fr.result
					);

					if (calle && calle.constructor == Function) { 
						calle(isOpen);
					}
				};
				fr.readAsText(file);
			}, false);

			document.body.appendChild(i);
			i.click();
			document.body.removeChild(i);
		}, 0);
	};

	/**
	 * @method save
	 * Cria um arquivo com o mock gerado e baixa para a maquina
	 * do usuário
	 */
	public save(){
		setTimeout(function(){
			Main.getInstance().IO.setFileVersion();
			var file: MockFileInterface = Main.getInstance().IO.getFile();
			if (!file.fileName) {
				file.fileName = Main.getInstance().IO.generateFileName();
			}

			//	cria o blob
			var blob = new Blob(
					[ file.content ], { type: 'text/plain' }
				);
			//	cria um link virtual
			var a = document.createElement('a');
			a.setAttribute('href', URL.createObjectURL(blob));
			a.setAttribute('target', '_blank');
			a.setAttribute('download', file.fileName);
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}, 0);
	};

	/**
	 * @method clear
	 * Limpa o mock no browser
	 */
	public clear(){
		Main.getInstance().IO.createNewFile();
	};

	/**
	 * @method getVersion
	 * Retorna a versão atual do arquivo de mock
	 * 
	 * @return {String}
	 * A versão no formato de data
	 */
	public getVersion(){
		return Main.getInstance().IO.getFileVersion();
	};
}