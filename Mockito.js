/**
 * @author Ricardo Azzi <ricardoazzi91@hotmail.com.br>
 *
 * This guy copy all params, path and respose from every
 * http request in your system and save that in localStorage,
 * when you want to download all mocked data, execute 'download()'
 * in console
 *
 * Esse cara copia todos os parâmetros, caminho e resposta de
 * cada requisição http em seu sistema e salva isso no localStorage,
 * quando você quiser baixar o conteúdo mocado, execute 'download()'
 * no console
 */
function save(name, json) {
	if (!localStorage.mock) { localStorage.mock = '{}'; }
	var mock = JSON.parse(localStorage.mock);

	if (!mock[name]) { mock[name] = {}; }
	for (var key in json) {
		mock[name][key] = json[key];
	}

	localStorage.mock = JSON.stringify(mock);
}

/**
 * If you need to set the mock manually, you can use this 
 * function, it will open an openfile dialog that allows
 */
function upload() {
	(function(){
		setTimeout(function(){
			var i = document.createElement('input');
			i.setAttribute('type', 'file');

			i.addEventListener('change', function(){
				var file = this.files[0];
				var fr = new FileReader;
				fr.onload = function(){
					localStorage.mock = fr.result;
					alert('Mock!');
				};
				fr.readAsText(file);
			}, false);
			
			var div = document.createElement('div');
			div.setAttribute('style', [
					'position:absolute;',
					'top:0px;',
					'left:0px;',
					'right:0px;',
					'bottom:0px;',
					'background-color:rgba(255,255,255,.3);',
					'text-align:center',
					'vertical-align:middle',
					'cursor:pointer'
				].join(''));
			div.textContent = ' Click here to open dialog ';
			div.addEventListener('click', function(){
				i.click();
				document.body.removeChild(i);
				document.body.removeChild(div);
			}, false);

			document.body.appendChild(i);
			document.body.appendChild(div);
		}, 0);
	})();
}

function clearMock() {
	localStorage.mock = '{}';
}

function download(){
	setTimeout(function(){
		var blob = new Blob(
				[ localStorage.mock ], { type: 'text/plain' }
			);

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

		var fileName = "mock - "+d+"-"+m+"-"+Y+" "+H+"-"+i+".json";

		var a = document.createElement('a');
		a.setAttribute('href', URL.createObjectURL(blob));
		a.setAttribute('target', '_blank');
		a.setAttribute('download', fileName);
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		delete a;
	}, 0);
}

(function(){
	var http = window.XMLHttpRequest;
	window.XMLHttpRequest = function(){
		var me = new http;
		me.addEventListener("readystatechange", function() { 
			if (me.readyState == 4 && me.status == 200) {

				var json = {};
				json[me.data] = me.responseText;

				//	tirando o parâmetro adicional para remoção de cache
				var url	= me.responseURL.replace(/(_dc=)\d+(&|)/g, '');
				url		= url.replace(/[?]$/, '');
				save(url, json);

			}
		}, false);

		var send = me.send;
		me.send = function(data){
			me.data = data;
			send.apply(this, arguments);
		};

		return me;
	};
})();