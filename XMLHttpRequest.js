/**
 * @author Ricardo Azzi <ricardoazzi91@hotmail.com.br>
 *
 * This one overrides the 'XMLHttpRequest' prototype native
 * from javascript, making the application do not send http
 * request, but get the data from your mock (you should
 * set the mock data into localStorage.mock)
 *
 * Esse cara sobrescreve o protótipo 'XMLHttpRequest' nativo
 * do javascript, fazendo com que sua aplicação não envie
 * requisições http, mas use os dados de dentro de seu mock
 * (você deve colocar os dados mockados em localStorage.mock )
 */
window.XMLHttpRequest = function(){
	var me = this;

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

	var async = true;
	var headers = {

	};
	
	me.onabort = function(){};
	me.onerror = function(){};
	me.onload = function(){};
	me.onloadend = function(){};
	me.onloadstart = function(){};
	me.onprogress = function(){};
	me.onreadystatechange = function(){};
	me.ontimeout = function(){};

	me.upload = function() {
		'[native code]'
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

	me.open = function(x, url, a){
		async = a;
		me.responseURL = url;
	};

	me.addEventListener = function(event, call){
		me['on'+event] = call;
	};

	me.send = function(params){
		if (async) {
			setTimeout(function(){
				simular_io(params);
			}, 0);
		} else {
			simular_io(params);
		}
	};

	var simular_io = function(params){
		var data	= JSON.parse(localStorage.mock);
		data		= data[me.responseURL];

		if (!data[params]) {
			for (var key in data) {
				data = data[key];
				break;
			}
		} else {
			data = data[params];
		}

		me.response		= data || '{}';
		me.responseText	= data || '{}';
		me.readyState	= 4;
		me.status		= 200;

		me.onreadystatechange(me);
	};
};