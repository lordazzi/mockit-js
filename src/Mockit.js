/**
 * @author Ricardo Azzi Silva <ricardoazzi91@hotmail.com>
 * @version  v2.0.6
 * @class MockitJs
 * @singleton
 *
 * @uses MockitJs.IO
 * @uses MockitJs.XMLHttpRequest
 * @uses MockitJs.httpReader
 * @uses MockitJs.mockReader
 * @uses MockitJs.FormDataReader
 * @uses MockitJs.FormData
 *
 * Um protótipo genérico javascript, criado com o objetivo de mockar as
 * requisições http e controlar o uso deste mock
 */
window.MockitJs = new function(){

	//	garantindo que não seja evocado como função, mas somente como instância
	if (this === window) return new (arguments.callee)();

	//	singlentando...
	if (arguments.callee._singletonInstance)
    	return arguments.callee._singletonInstance;
    var me		= arguments.callee._singletonInstance = this;

    //	versão
    me.version = 'v2.1.7';

	/**
	 * Gera um nome para o arquivo que será salvo, caso ele seja um novo
	 * arquivo
	 *
	 * @private
	 * 
	 * @return {String}
	 * Nome gerado dinâmicamente
	 */
	var generateFileName = function(){
		var date = new Date();
		var d = date.getDate();
		d = (d < 9)? "0"+d : String(d);

		var m = date.getMonth() + 1;
		m = (m < 9)? "0"+m : String(m);

		var Y = date.getFullYear();

		var H = date.getHours();
		H = (H < 9)? "0"+H : String(H);

		var i = date.getMinutes();
		i = (i < 9)? "0"+i : String(i);

		var fileName = "mockitjs - "+d+"-"+m+"-"+Y+" "+H+"-"+i+".json";

		return fileName;
	};

	/**
	 * @method record
	 * Inicia a captura das requisições http
	 */
	me.record = function(){
		window.XMLHttpRequest	= MockitJs.httpReader;
		window.FormData			= MockitJs.FormDataReader;
	};

	/**
	 * @method stopRecording
	 * Para a captura das requisições http
	 */
	me.stopRecording = function(){
		window.XMLHttpRequest	= MockitJs.XMLHttpRequest;
		window.FormData			= MockitJs.FormData;
	};

	/**
	 * @method stopHttp
	 * Faz com que a página pare de ler as requisições
	 * http e leia somente as informações do mock, é importante
	 * lembrar que nada dentro da página será capaz de efetuar
	 * requisições http enquanto a leitura por mock estiver
	 * habilitada
	 */
	me.stopHttp = function(){
		window.XMLHttpRequest	= MockitJs.mockReader;
	};

	/**
	 * @method playHttp
	 * Para de ler as informações do mock e volta a fazer
	 * as requisições http normalmente
	 */
	me.playHttp = function(){
		window.XMLHttpRequest = MockitJs.XMLHttpRequest;
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
	me.loadFromHttp = function(path, calle){
		var xhr = new MockitJs.XMLHttpRequest;
		xhr.open('GET', path, true);
		xhr.onreadystatechange = function(){
			if (xhr.readyState == 4 && xhr.status == 200) {
				var name = path.match(/[^\/]+$/);
				var isOpen = MockitJs.IO.declareFileOpen(
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
	me.loadFromDialog = function(calle){
		setTimeout(function(){
			var i = document.createElement('input');
			i.setAttribute('type', 'file');

			i.addEventListener('change', function(){
				var file = this.files[0];
				var fr = new FileReader();
				fr.onload = function(){
					var isOpen = MockitJs.IO.declareFileOpen(
						file.name, fr.result
					);

					if (calle && calle.constructor == Function) { calle(isOpen); }
					delete i;
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
	me.save = function(){
		setTimeout(function(){
			MockitJs.IO.setVersion();
			var file = MockitJs.IO.getFile();
			if (!file.name) { file.name = generateFileName(); }

			//	cria o blob
			var blob = new Blob(
					[ file.content ], { type: 'text/plain' }
				);
			//	cria um link virtual
			var a = document.createElement('a');
			a.setAttribute('href', URL.createObjectURL(blob));
			a.setAttribute('target', '_blank');
			a.setAttribute('download', file.name);
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			delete a;
		}, 0);
	};

	/**
	 * @method clear
	 * Limpa o mock no browser
	 */
	me.clear = function(){
		MockitJs.IO.createNewFile();
	};

	/**
	 * @method getVersion
	 * Retorna a versão atual do arquivo de mock
	 * 
	 * @return {String}
	 * A versão no formato de data
	 */
	me.getVersion = function(){
		return MockitJs.IO.getVersion();
	};
};

/**
 * @property {String} cacheVarName
 *
 * Algumas aplicações enviam um parâmetro para requisições http
 * para quebrar cache de arquivo, isso atrapalha o MockitJs (:
 *
 * Se sua aplicação fizer isso, você precisa definir nesta
 * propriedade o nome do parâmetro get de remoção de cache
 */
MockitJs.cacheVarName = '';

/**
 * @property {Boolean} syncronizeApp
 *
 * Força toda a aplicação trabalhar de forma sincrona (pelo menos
 * ao que se refere a requisições http)
 */
MockitJs.syncronizeApp = false;

/**
 * @property {Boolean} turnAllRequestTimesIntoZero
 *
 * Semelhante ao {#syncronizeApp} mas não deixa as requisições sincronas,
 * mas deixa elas com um tempo muito próximo a 0 milisegundos, para evitar
 * ficar esperando o tempo de cada requisição quando os testes unitários
 * forem executados
 */
MockitJs.turnAllRequestTimesIntoZero = false;

/**
 * @property {String[]|Boolean} ignoreRequestHeaders
 *
 * Conjunto de nomes de headers de requisição que não devem ser
 * interpretados pela ferramenta de mock como um parâmetro enviado
 * para o servidor.
 *
 * Se o valor estiver com 'true' atribuido ele ignora todos os headers
 */
MockitJs.ignoreRequestHeaders = [
	'Accept-Encoding', 'Accept-Language',
	'Host', 'Referer', 'User-Agent'
];




/**
 * @method hasNetworkConnection
 * 
 * Verifica se existe conectividade com a rede ficticia.
 * 
 * Esta funcionalidade serve para mocar situações onde um problema na rede
 * ou no servidor possa lançar um problema em uma situação onde um conjunto
 * de serviços que se interdependem estão sendo consumidos pelo front end e
 * um deles falha.
 */
MockitJs.hasNetworkConnection = function(){
	return (arguments.callee.networkCableStatus === undefined || arguments.callee.networkCableStatus === true);
};

/**
 * @class MockitJs.IO
 * Classe responsável pela manipulação do arquivo de mock
 *
 * @private
 */
MockitJs.IO = new function(){
	
	//	garantindo que não seja evocado como função, mas somente como instância
	if (this === window) return new (arguments.callee)();

	//	singlentando...
	if (arguments.callee._singletonInstance)
    	return arguments.callee._singletonInstance;
    var me = arguments.callee._singletonInstance = this;

	/**
	 * Método responsável por definir o arquivo como aberto
	 * 
	 * @param  {String} name
	 * Nome do arquivo que será definido como aberto
	 * 
	 * @param  {String} content
	 * Conteúdo do arquivo
	 * 
	 * @return {Error|Boolean}
	 * Se o conteúdo do arquivo conter erros, então o objeto de
	 * erro é devolvido, caso contrário se retorna false
	 */
	me.declareFileOpen = function(name, content){
		try {
			JSON.parse(content);
		} catch (e) {
			return e;
		}

		me.validOpeningFile(content);

		localStorage.mockitjs_filecontent	= content;
		localStorage.mockitjs_filename		= name;

		return false;
	};

	me.validOpeningFile = function(fileContent){
		return true;
	};

	/**
	 * @method feedOpenedFile
	 * 
	 * Alimenta o arquivo aberto com mais informações de mock
	 *
	 * @param {Object} args
	 * Parâmetros necessários para salvar uma entrada e saída no mock
	 * 
	 * @param  {String} args.url
	 * Url para qual a requisição http foi direcionada
	 *
	 * @param {Number} args.status
	 * Código que representa quando o status que o servidor respondeu
	 * a requisição enviada
	 *
	 * @param {Number} args.requestTime
	 * Quanto tempo a requisição demorou para ser executada
	 *
	 * @param {String} [args.method="GET"]
	 * Método http que a requisição foi chamada (GET, POST, PUT, DELETE, OPTIONS)
	 * 
	 * @param {String} [args.params="null"]
	 * Parâmetro que estão sendo enviados para o servidor
	 *
	 * @param {String} [response='']
	 * Resposta da requisição
	 */
	me.feedOpenedFile = function(args){
		if (!args)				{ args = {}; }
		if (!args.url)			{ throw "Impossível registrar um mock sem a url de envio da requisição."; }
		if (!args.status && args.status !== 0) { throw "Impossível registrar um mock sem o status de resposta"; }
		if (!args.requestTime)	{ args.requestTime = 0; }
		if (!args.method)		{ args.method = 'GET'; }
		if (!args.params)		{ args.params = 'null'; }
		if (!args.response)		{ args.response = ''; }

		//	método da requisição http sempre em uppercase
		args.method = String(args.method).toUpperCase();

		//	local onde deveria estar o arquivo está vazio?
		//	O método clear coloca um objeto
		if (!localStorage.mockitjs_filecontent)
			me.createNewFile();

		//	lê o conteúdo do arquivo aberto
		var mock	= JSON.parse(localStorage.mockitjs_filecontent);
		var content	= mock.content;

		///
		if (!content[args.url])
			content[args.url] = {};

		if (!content[args.url][args.method])
			content[args.url][args.method] = {};

		//	alterando o arquivo
		content[args.url][args.method][args.params] = {
			status:			args.status,
			requestTime:	args.requestTime,
			response:		args.response
		};

		//	salvando o arquivo
		localStorage.mockitjs_filecontent = JSON.stringify(content);
	};

	/**
	 * @method readFile
	 * Retorna o conteúdo do arquivo se baseando na url, no método http
	 * e nos parâmetros que foram enviados, se a url unida com o método
	 * http não forem encontrados no mock, o método gera um warning, se
	 * os parâmetros para aquela url não forem encontrados, ele irá retornar
	 * os registros do primeiro indice dentro da chave formada pela url e
	 * pelo método http.
	 * 
	 * @param  {String} url
	 * Url da requisição http
	 * 
	 * @param  {String} method
	 * Método http da requisição
	 * 
	 * @param  {MockitJs.ArgumentObject} [params]
	 * Dados que foram enviados para o servidor
	 * 
	 * @return {String}
	 * Dados de retorno da requisição que estão guardados no mock
	 */
	me.readFile = function(url, method, params){
		method		= String(method).toUpperCase();
		params		= params || '';

		var vazio	= {
		
			status: 200,

			requestTime: 0,

			response: null

		};

		var mock	= JSON.parse(localStorage.mockitjs_filecontent);
		var data	= mock.content;
		data		= mock[url]		|| {};
		data		= data[method]	|| {};

		//	verificando se existe algo dentro da url[metodo]
		if (!data) {
			console.warn('Tentando ler informações de uma url/método que nunca foram mocados! '+url+' sobre '+method);
			return vazio;
		}

		//	se não existir nada mocado nesta posição,
		//	então retorna o conteúdo da primeir posição
		if (!data[params]) {
			for (var key in data) {
				data = data[key];
				break;
			}
		} else {
			data = data[params];
		}

		//	se não encontrar nada, retorna um json vazio
		return data || vazio;
	};

	/**
	 * Retorna um objeto com o nome do arquivo e o seu conteúdo
	 *
	 * @private
	 * 
	 * @return {Object}
	 * Objeto com o nome do arquivo e seu conteúdo
	 *
	 * #name
	 * Nome do arquivo
	 *
	 * #content
	 * Conteúdo do arquivo
	 */
	me.getFile = function(){
		return {
			name:		localStorage.mockitjs_filename,
			content:	localStorage.mockitjs_filecontent
		};
	};

	/**
	 * @method createNewFile
	 * Cria a estrutura de um novo arquivo para guardar os mocks
	 */
	me.createNewFile = function(){
		var emptyFile = {

			mockerVersion: MockitJs.version,

			fileVersion: (new Date).getTime(),

			readConfigs: {

			},

			configs: {

				cacheVarName:			MockitJs.cacheVarName,

				syncronizeApp:			MockitJs.syncronizeApp,

				ignoreRequestHeaders:	MockitJs.ignoreRequestHeaders

			},

			content: {

			}
		};

		localStorage.mockitjs_filename		= '';
		localStorage.mockitjs_filecontent	= JSON.stringify(emptyFile);
	};

	/**
	 * @method hasFile
	 * Verifica se há um arquivo aberto
	 *
	 * @return {Boolean}
	 */
	me.hasFile = function(){
		return (
			localStorage.mockitjs_filecontent != '{}' &&
			localStorage.mockitjs_filecontent != '' &&
			localStorage.mockitjs_filecontent != undefined
		);
	};

	/**
	 * @method setVersion
	 * Define a versão do arquivo
	 *
	 * @return {Number}
	 * Timestamp de agora é setado ao lado das urls no
	 * arquivo, no atributo '_version'
	 */
	me.setVersion = function(){
		var json = JSON.parse(localStorage.mockitjs_filecontent);
		json.fileVersion = (new Date).getTime();
		localStorage.mockitjs_filecontent = JSON.stringify(json);
		return json.fileVersion;
	};

	/**
	 * @method getVersion
	 * Retorna a versão atual do arquivo de mock
	 * 
	 * @return {String}
	 * A versão no formato de data
	 */
	me.getVersion = function(){
		var json = JSON.parse(localStorage.mockitjs_filecontent);
		return String(new Date(json.fileVersion));
	};
};

/**
 * @class MockitJs.XMLHttpRequest
 * Classe nativa que trata as requisições http do javascript
 *
 * @method send
 * Envia informações para o servidor
 *
 * @param {String|Object|Node|Blob|MockitJs.FormData} json
 * Informações que serão enviadas para o servidor
 *
 * @private
 */
MockitJs.XMLHttpRequest = window.XMLHttpRequest;

/**
 * @class MockitJs.ArgumentObject
 *
 * Representa todos os argumentos que forem enviados para o
 * servidor que forem suportados pela biblioteca, incluindo
 * os headers de requisição
 */
MockitJs.ArgumentObject = function(params){

	//	garantindo que não seja evocado como função, mas somente como instância
	if (this === window) return new (arguments.callee)();

	var me				= this;
	var requestParams	= params;
	var headers			= {};

	var isXml;
	var isValidJson;
	var isMockedFormData;
	var isNull;
	var isLiteral;

	var constructor = function(){
		if (params instanceof File || params instanceof Blob)
			throw "o sistema ainda não suporta mock de arquivos e de objetos blob";

		isXml				= me.isXml(params);
		isValidJson			= me.isValidJson(params);
		isMockedFormData	= me.isMockedFormData(params);
		isNull				= me.isNull(params);
		isLiteral			= me.isLiteral(params);

		if (!isXml && !isValidJson && !isMockedFormData && !isNull && !isLiteral)
			throw "o sistema não suporta dados diferentes dos tipos: string, number, boolean, xml, json, formdata e null";

	};

	/**
	 * @method isXml
	 * 
	 * Verifica se um dado é um objeto XML
	 * 
	 * @param anyData
	 * Qualquer dado
	 * 
	 * @return {Boolean}
	 */
	me.isXml = function(anyData){
		return (params instanceof XMLDocument);
	};

	/**
	 * @method isValidJson
	 * 
	 * Verifica se um dado é um JSON válido não
	 * circular
	 * 
	 * @param anyData
	 * Qualquer dado
	 * 
	 * @return {Boolean}
	 */
	me.isValidJson = function(anyData){
		if (anyData && (anyData.constructor === Object || anyData.constructor === Array)) {
			try {
				JSON.stringify(anyData);
				return true;
			} catch (e) {
				return false;
			}
		} else {
			return false;
		}
	};

	/**
	 * @method isMockedFormData
	 * 
	 * Verifica se o dado enviado é uma instância de
	 * {@link MockitJs.ArgumentObject.FormDataReader}
	 * 
	 * @param anyData
	 * Qualquer dado
	 * 
	 * @return {Boolean}
	 */
	me.isMockedFormData = function(anyData){
		return (params instanceof MockitJs.ArgumentObject.FormDataReader);
	};

	/**
	 * @method isNull
	 * 
	 * Verifica se um dado é nulo ou equivalente a nulo
	 * 
	 * @param anyData
	 * Qualquer dado
	 * 
	 * @return {Boolean}
	 */
	me.isNull = function(anyData){
		return (anyData == null);
	};

	/**
	 * @method isLiteral
	 * 
	 * Verifica se um dado é uma instância de String, Number
	 * ou Boolean
	 * 
	 * @param anyData
	 * Qualquer dado
	 * 
	 * @return {Boolean}
	 */
	me.isLiteral = function(anyData){
		return (
			Object(params) instanceof String ||
			Object(params) instanceof Number ||
			Object(params) instanceof Boolean
		);
	};

	/**
	 * @method setRequestHeader
	 * 
	 * Atribui a esta classe os headers que forem adicionados à requisição
	 * 
	 * @param name
	 * O nome do header
	 *
	 * @param value
	 * O valor que será atribuido ao header
	 */
	me.setRequestHeader = function(name, value){
		name	= String(name).toLowerCase();
		value	= String(value);

		if (MockitJs.ignoreRequestHeaders === true)
			return;

		for (var i = 0; i < MockitJs.ignoreRequestHeaders.length; i++)
			if (MockitJs.ignoreRequestHeaders[i].toLowerCase() == name)
				return;

		headers[name] = value;
	};

	/**
	 * @method toString
	 * 
	 * Transforma este objeto em sua representação como string
	 * 
	 * @return {String}
	 */
	me.toString = function(){
		var asString = {};

		if (isNull) {
			asString.type = 'null'
		} else if (isValidJson) {
			asString.type = 'json';
			asString.data = JSON.stringify(requestParams);
		} else if (isMockedFormData) {
			asString.type = 'form';
			asString.data = String(requestParams);
		} else if (isXml) {
			asString.type = 'xml';
			asString.data = (new XMLSerializer).serializeToString(requestParams);
		} else if (isLiteral) {
			asString.type = 'literal';
			asString.data = requestParams;
		}

		asString.headers = headers;

		return JSON.stringify(asString);
	};

	constructor();
};

/**
 * @class MockitJs.ArgumentObject.FormData
 * Classe nativa de armazenamento de dados do javascript
 *
 * @method append
 * Vincula um novo valor à instância de FormData
 *
 * @param {String} name
 * Nome do atributo
 *
 * @param {Boolean|String|Number|null|undefined|Blob} value
 * Valor vinculado ao atributo
 *
 * @param {String} [filename]
 * Se o valor anterior for do tipo Blob, o terceiro parâmetro
 * será o nome do arquivo contido no Blob
 *
 * @private
 */
MockitJs.ArgumentObject.FormData = window.FormData;

/**
 * @class MockitJs.ArgumentObject.FormDataReader
 * 
 * Enquanto a aplicação está escutando as requisições http,
 * este protótipo deve substituir {@link MockitJs.FormData}
 * enquanto {@link MockitJs.httpReader} estiver substituindo
 * {@link MockitJs.XMLHttpRequest}
 *
 * @extends {MockitJs.FormData}
 * 
 * @private
 */
MockitJs.ArgumentObject.FormDataReader = function FormData(){

	//	garantindo que não seja evocado como função, mas somente como instância
	if (this === window)
		throw "TypeError: Failed to construct 'FormData': Please use the 'new' operator, this DOM object constructor cannot be called as a function.";

	var me = new MockitJs.FormData;
	var append = me.append;
	var json = {};

	me.append = function(name, value){
		json[name] = value;
		append.apply(me, arguments);
	};

	me.toString = function(){
		return JSON.stringify(json);
	};

	return me;
};

/**
 * @class MockitJs.httpReader
 *
 * Classe responsável por sobrescrever o
 * {@link MockitJs.XMLHttpRequest protótipo de operação io http nativo}
 * do javascript, ele mantém todas as funcionalidades do
 * protótipo nativo, mas faz a leitura de cada dado que
 * entra e sai
 *
 * @private
 * 
 * @extends MockitJs.XMLHttpRequest
 */
MockitJs.httpReader = function XMLHttpRequest(){

	//	garantindo que não seja evocado como função, mas somente como instância
	if (this === window)
		throw "TypeError: Failed to construct 'XMLHttpRequest': Please use the 'new' operator, this DOM object constructor cannot be called as a function.";

	var me		= new MockitJs.XMLHttpRequest;
	var headers	= {};
	var data;
	var timeWhenSend;

	me.addEventListener("readystatechange", function(){ 
		if (me.readyState == 4) {

			//	tirando o parâmetro adicional para remoção de cache
			var url = me.responseURL;
			if (MockitJs.cacheVarName) {
				var reg	= new RegExp('('+MockitJs.cacheVarName+'=).+(&|$)');
				url		= url.replace(reg);
				url		= url.replace(/[?]$/, '');
			}

			//	salvando requisição
			MockitJs.IO.feedOpenedFile({
				url:			url,
				method:			me.method,
				params:			String(data),
				response:		me.responseText,
				status:			me.status,
				requestTime:	((new Date).getTime() - timeWhenSend)
			});
		}
	}, false);

	/**
	 * @method send
	 * 
	 * Sobrescreve o método {@link MockitJs.XMLHttpRequest#send send}
	 * de {@link MockitJs.XMLHttpRequest XMLHttpRequest}
	 * para ler os parâmetros que são enviados para o servidor
	 *
	 * @param {String} data
	 * Dados enviados para o servidor
	 */
	var send = me.send;
	me.send = function(data){
		if (timeWhenSend) return send.apply(me, arguments);

		timeWhenSend	= (new Date).getTime();
		data			= new MockitJs.ArgumentObject(data);
		for (var key in headers)
			data.setRequestHeader(key, headers[key]);

		return send.apply(me, arguments);
	};

	/**
	 * @method setRequestHeader 
	 *
	 * Sobrescreve o método {@link MockitJs.XMLHttpRequest#setRequestHeader setRequestHeader}
	 * de {@link MockitJs.XMLHttpRequest XMLHttpRequest} para ler todos os headers
	 * que forem enviados para o servidor
	 */
	var setRequestHeader = me.setRequestHeader;
	me.setRequestHeader = function(name, value){
		headers[name] = value;
		return setRequestHeader.apply(me, arguments);
	};

	/**
	 * @method open
	 * 
	 * Sobrescreve o método {@link MockitJs.XMLHttpRequest#send open}
	 * de {@link MockitJs.XMLHttpRequest XMLHttpRequest}
	 * para ler o método que a requisição irá utilizar
	 */
	var open = me.open;
	me.open = function(method){
		me.method = method;
		return open.apply(me, arguments);
	};

	return me;
};

/**
 * @class MockitJs.mockReader
 *
 * Classe responsável por sobrescrever o
 * {@link MockitJs.XMLHttpRequest protótipo de operação io http nativo}
 * do javascript, ele mantém todas as caracteristicas do objeto nativo,
 * porém todas ocas. Ao invés de efetuar as requisições http ele faz a
 * leitura do mock
 *
 * @private
 */
MockitJs.mockReader = function XMLHttpRequest(){

	//	garantindo que não seja evocado como função, mas somente como instância
	if (this === window) return new (arguments.callee)();
	
	var me = this;

	var async	= true;
	var method	= 'GET';
	var headers	= {};
	var events	= {};

	me.DONE = 4;
	me.LOADING = 3;
	me.HEADERS_RECEIVED = 2;
	me.OPENED = 1;
	me.UNSENT = 0;

	me.readyState = 0;
	me.status = 0;

	me.overrideMimeType = 'text/plain';
	me.responseType = '';
	me.statusText = '';
	me.responseXML = '';
	me.responseURL = '';
	me.withCredentials = false;
	me.timeout = 0;

	me.abort = false;
	me.response = '';
	me.responseText = '';

	me.onabort = function(){ fireEvent('abort', [ me ]); };
	me.onerror = function(){ fireEvent('error', [ me ]); };
	me.onload = function(){ fireEvent('load', [ me ]); };
	me.onloadend = function(){ fireEvent('loadend', [ me ]); };
	me.onloadstart = function(){ fireEvent('loadstart', [ me ]); };
	me.onprogress = function(){ fireEvent('progress', [ me ]); };
	me.ontimeout = function(){ fireEvent('timeout', [ me ]); };
	me.onreadystatechange = function(){ fireEvent('readystatechange', [ me ]); };

	me.upload = function(){};

	var fireEvent = function(eventName){
		if (events[eventName] instanceof Array) {
			for (var i = 0; i < events[eventName].length; i++) {
				var callable = events[eventName][i];
				if (Object(callable) instanceof Function)
					callable();
			}
		}
	};

	me.setRequestHeader = function(header, value) {
		headers[header] = value;
		return value;
	};

	me.getAllResponseHeaders = function(){
		if (!headers['Content-Type']) {
			headers['Content-Type'] = me.overrideMimeType;
		}

		var str = '';
		for (var head in headers) {
			str += head+':'+headers[head]+';\n';
		}

		return str;
	};

	me.getResponseHeader = function(header) {
		return headers[header] || '';
	};

	me.open = function(mtd, url, a){
		async			= a;
		method			= mtd;
		me.responseURL	= url;
	};

	me.addEventListener = function(eventName, call){
		if (!events[eventName]) events[eventName] = [];
		events[eventName].push(call);
	};

	me.send = function(params){
		var me = this;

		var sending = function(){
			if (!MockitJs.hasNetworkConnection()) {
				me.readyState			= 4;
				me.status				= 0;
				me.response				= "";
				me.responseText			= "";
			} else {
				me.response				= data.response;
				me.responseText			= data.response;
				me.readyState			= 4;
				me.status				= data.status;
			}

			var mainResponseCode	= Math.floor(me.status / 100);
			if (me.status === 0 || mainResponseCode === 4 || mainResponseCode === 5)
				me.onerror();

			me.onreadystatechange(me);
		};

		var data = MockitJs.IO.readFile(me.responseURL, method, new MockitJs.ArgumentObject(params));

		// tratar de forma adequada o objeto de argumentos
		if (async || MockitJs.syncronizeApp) {
			sending();
		} else if (MockitJs.turnAllRequestTimesIntoZero) {
			setTimeout(function(){
				sending();
			}, 0);
		} else {
			setTimeout(function(){
				sending();
			}, data.requestTime);
		}
	};
};