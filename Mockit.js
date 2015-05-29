/**
 * @author Ricardo Azzi Silva <ricardoazzi91@hotmail.com>
 * @class MockitJs
 * @singleton
 *
 * @uses MockitJs.IO
 * @uses MockitJs.XMLHttpRequest
 * @uses MockitJs.httpReader
 * @uses MockitJs.mockReader
 *
 * Um protótipo genérico javascript, criado com o objetivo de mockar as
 * requisições http e controlar o uso deste mock
 */
window.MockitJs = new function(){

	//	singlentando...
	if (arguments.callee._singletonInstance)
    	return arguments.callee._singletonInstance;
    var me = arguments.callee._singletonInstance = this;

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
		d = d < 9 ? "0"+d : String(d);

		var m = date.getMonth() + 1;
		m = m < 9 ? "0"+m : String(m);

		var Y = date.getFullYear();

		var H = date.getHours();
		H = H < 9 ? "0"+H : String(H);

		var i = date.getMinutes();
		i = i < 9 ? "0"+i : String(i);

		var fileName = "mockitjs - "+d+"-"+m+"-"+Y+" "+H+"-"+i+".json";

		return fileName;
	};

	/**
	 * @method record
	 * Inicia a captura das requisições http
	 */
	me.record = function(){
		window.XMLHttpRequest = MockitJs.httpReader;
	};

	/**
	 * @method stopRecording
	 * Para a captura das requisições http
	 */
	me.stopRecording = function(){
		window.XMLHttpRequest = MockitJs.XMLHttpRequest;
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
		window.XMLHttpRequest = MockitJs.mockReader;
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
	 * @method load
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
		MockitJs.IO.clear();
	};
};

/**
 * @property
 * @type {String}
 *
 * Algumas aplicações enviam um parâmetro para requisições http
 * para quebrar cache de arquivo, isso atrapalha o MockitJs (:
 *
 * Se sua aplicação fizer isso, você precisa definir nesta
 * propriedade o nome do parâmetro get de remoção de cache
 */
MockitJs.cacheVarName = '';

/**
 * @property
 * @type {Boolean}
 *
 * Força toda a aplicação trabalhar de forma sincrona (pelo menos
 * ao que se refere a requisições http)
 */
MockitJs.syncronizeApp = false;

/**
 * @class MockitJs.IO
 * Classe responsável pela manipulação do arquivo de mock
 *
 * @private
 */
MockitJs.IO = new function(){
	//	singlentando...
	if (arguments.callee._singletonInstance)
    	return arguments.callee._singletonInstance;
    var me = arguments.callee._singletonInstance = this;

    /**
     * @method  generateMockRootKey
     * Gera a chave que irá vincular o json no root do mock,
     * esta chave é baseada na url da requisição http e no
     * método da requisição
     * 
     * @param  {String} url
     * Url da requisição de http
     * 
     * @param  {String} method
     * Método da requisição http
     * 
     * @return {String}
     * Chave indicando em qual json as informações da
     * requisição devem ser vinculadas
     *
     * @private 
     */
    var generateMockRootKey = function(url, method){
    	method		= String(method).toUpperCase();
		var name	= url+'-'+method;

		return name;
    };

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

		localStorage.mockitjs_filecontent	= content;
		localStorage.mockitjs_filename		= name;

		return false;
	};

	/**
	 * Alimenta o arquivo aberto com mais informações de mock
	 * 
	 * @param  {String} url
	 * Url para qual a requisição http foi direcionada
	 *
	 * @param {String} method
	 * Método http que a requisição foi chamada (GET, POST, PUT, DELETE)
	 * 
	 * @param  {Object} json
	 * Objeto cujo os atributos devem ser os parâmetros enviados
	 * para o servidor e os valores dos atributos devem ser os 
	 * resultados obtidos pela requisição
	 */
	me.feedFile = function(url, method, json){
		if (!localStorage.mockitjs_filecontent) { me.clear(); }

		var mock	= JSON.parse(localStorage.mockitjs_filecontent);
		var name	= generateMockRootKey(url, method);

		if (!mock[name]) { mock[name] = {}; }
		for (var key in json) {
			mock[name][key] = json[key];
		}

		localStorage.mockitjs_filecontent = JSON.stringify(mock);
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
	 * @param  {String} [params]
	 * Dados que foram enviados para o servidor
	 * 
	 * @return {String}
	 * Dados de retorno da requisição que estão guardados no mock
	 */
	me.readFile = function(url, method, params){
		var data	= JSON.parse(localStorage.mockitjs_filecontent);
		var key		= generateMockRootKey(url, method);
		data		= data[key];
		var vazio	= '{}';

		if (!data) {
			console.warn('Tentando ler informações de uma url/método que nunca foram mocados! '+url+' sobre '+method);
			return vazio;
		}

		if (!data[params]) {
			for (var key in data) {
				data = data[key];
				break;
			}
		} else {
			data = data[params];
		}

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
	 * @method clear
	 * Limpa o mock no browser
	 */
	me.clear = function(){
		localStorage.mockitjs_filecontent = '{}';
		localStorage.mockitjs_filename = '';
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
};

/**
 * @class MockitJs.XMLHttpRequest
 *
 * @private
 */
MockitJs.XMLHttpRequest = window.XMLHttpRequest;

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
	var me = new MockitJs.XMLHttpRequest;
	me.addEventListener("readystatechange", function() { 
		if (me.readyState == 4 && me.status == 200) {

			var json = {};
			json[me.data] = me.responseText;

			//	tirando o parâmetro adicional para remoção de cache
			var url = me.responseURL;
			if (MockitJs.cacheVarName) {
				var reg	= new RegExp('('+MockitJs.cacheVarName+'=).+(&|$)');
				url		= url.replace(reg);
				url		= url.replace(/[?]$/, '');
			}

			MockitJs.IO.feedFile(url, me.method, json);
		}
	}, false);

	/**
	 * @method send
	 * Sobrescreve o método {@link MockitJs.XMLHttpRequest#send send}
	 * de {@link MockitJs.XMLHttpRequest XMLHttpRequest}
	 * para ler os parâmetros que são enviados para o servidor
	 *
	 * @param {String} data
	 * Dados enviados para o servidor
	 */
	var send = me.send;
	me.send = function(data){
		me.data = data;
		send.apply(this, arguments);
	};

	/**
	 * @method open
	 * Sobrescreve o método {@link MockitJs.XMLHttpRequest#send open}
	 * de {@link MockitJs.XMLHttpRequest XMLHttpRequest}
	 * para ler o método que a requisição irá utilizar
	 */
	var open = me.open;
	me.open = function(method){
		me.method = method;
		open.apply(this, arguments);
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
	var me = this;

	var async = true;
	var method = 'GET';
	var headers = {};

	me.DONE = 4;
	me.HEADERS_RECEIVED = 2;
	me.LOADING = 3;
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

	me.onabort = function(){};
	me.onerror = function(){};
	me.onload = function(){};
	me.onloadend = function(){};
	me.onloadstart = function(){};
	me.onprogress = function(){};
	me.onreadystatechange = function(){};
	me.ontimeout = function(){};

	/**
	 * @method simularIO
	 * Faz a leitura do mock se baseando nas informações
	 * passadas para o objeto esperando que ele efetuasse
	 * a operação http
	 * 
	 * @param  {String} params
	 * Valores que serão enviados para o servidor
	 *
	 * @private
	 */
	var simularIO = function(params){
		var data = MockitJs.IO.readFile(me.responseURL, method, params);

		me.response		= data;
		me.responseText	= data;
		me.readyState	= 4;
		me.status		= 200;

		me.onreadystatechange(me);
	};

	me.upload = function(){};

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

	me.addEventListener = function(event, call){
		me['on'+event] = call;
	};

	me.send = function(params){
		if (async && !MockitJs.syncronizeApp) {
			setTimeout(function(){
				simularIO(params);
			}, 0);
		} else {
			simularIO(params);
		}
	};
};