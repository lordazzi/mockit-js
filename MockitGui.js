/**
 * @author Ricardo Azzi Silva <ricardoazzi91@hotmail.com>
 * @class MockitJs.Gui
 * @singleton
 *
 * @uses MockitJs
 *
 * Interface gráfica para se trabalhar com o mockit
 */
if(!MockitJs) { alert('Impossível rodar MockitJs.Gui, importe o arquivo de MockitJs primeiro!');}
MockitJs.Gui = new function(){
	var root	= document.createElement('div');
	root.setAttribute('style', 'z-index:1000;position:relative;');
	var me		= this;

	//	elementos do dom
	var titleBar;
	var contentBar;

	var recordButton;
	var playButton;

	var saveButton;
	var loadButton;

	var closeButton;
	var minimizeButton;

	//	flags
	var recording	= false;
	var playing		= false;
	var minimized	= false;

	var _constructor = function(){
		var html = String(domContent);
		html = html.split('\n');
		html.shift();
		html.pop();
		html = html.join('\n');

		document.body.appendChild(root);
		root.innerHTML = html;

		titleBar		= document.getElementById('mockit-titlebar');
		contentBar		= document.getElementById('mockit-contentbar');

		recordButton	= document.getElementById('mockit-record');
		playButton		= document.getElementById('mockit-play');

		saveButton		= document.getElementById('mockit-load');
		loadButton		= document.getElementById('mockit-save');

		closeButton		= document.getElementById('mockit-close');
		minimizeButton	= document.getElementById('mockit-minimize');

		titleBar.addEventListener('dblclick', minimizeClick, false);
		minimizeButton.addEventListener('click', minimizeClick, false);
		closeButton.addEventListener('click', closeClick, false);

		recordButton.addEventListener('click', recordClick, false);
		playButton.addEventListener('click', playClick, false);

		loadButton.addEventListener('click', loadClick, false);
		saveButton.addEventListener('click', saveClick, false);

		if (MockitJs.IO.hasFile()) {
			//	implementar configurações de:
			//	mostrar qual arquivo está sendo utilizado
			//	perguntar sempre se deseja apelidar a requisição
			//	
			// if (confirm('Existe um arquivo de mock aberto. Deseja fecha-lo e iniciar um novo do zero?')) {
			// 	MockitJs.clear();
			// }
		}
	};

	var recordClick = function(){
		if (!recording && playing) {
			alert('Impossível começar gravar http enquanto se está rodando um mock!');
			return;
		}

		recordButton.removeAttribute('class');
		if (recording) {
			MockitJs.stopRecording();
			recordButton.setAttribute('class', 'start-record');
			recordButton.setAttribute('title', 'Clique aqui para começar a gravar');
		} else {
			MockitJs.record();
			recordButton.setAttribute('class', 'stop-record');
			recordButton.setAttribute('title', 'Gravando, clique para parar');
		}

		recording = !recording;
		document.body.focus();
	};

	var playClick = function(){
		playButton.removeAttribute('class');

		if (playing) {
			MockitJs.playHttp();
			playButton.setAttribute('class', 'play-mock');
			playButton.setAttribute('title', 'Clique aqui para substituir o http pelo mock');
		}  else {
			MockitJs.stopRecording();
			recordButton.setAttribute('class', 'start-record');
			recordButton.setAttribute('title', 'Clique aqui para começar a gravar');
			
			MockitJs.stopHttp();
			playButton.setAttribute('class', 'pause-mock');
			playButton.setAttribute('title', 'Clique aqui para voltar ao http');
		}

		playing = !playing;
		document.body.focus();
	};

	var saveClick = function(){
		MockitJs.save();
		document.body.focus();
	};

	var loadClick = function(){
		if (!MockitJs.IO.hasFile() || MockitJs.IO.hasFile() && confirm('Existe um arquivo de mock aberto, abrir outro irá descartá-lo!')) {
			MockitJs.loadFromDialog(function(e){
				if (e) alert(e.stack);
			});
		}
		document.body.focus();
	};

	var closeClick = function(){
		MockitJs.playHttp();
		root.remove();

		if (MockitJs.IO.hasFile()) {
			if (confirm('Deseja fechar o arquivo de mock aberto também?')) {
				MockitJs.clear();
			}
		}
		document.body.focus();
	};

	var minimizeClick = function(){
		if (minimized) {
			contentBar.removeAttribute('style');
		} else {
			contentBar.style.display = 'none';
		}

		minimized = !minimized;
		document.body.focus();
	};

	var domContent = function(){
		
	};

	if (document.body)
		_constructor();
	else 
		window.onload = function(){
			_constructor();
		};
};