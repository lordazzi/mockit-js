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
			if (confirm('Existe um arquivo de mock aberto. Deseja fecha-lo e iniciar um novo do zero?')) {
				MockitJs.clear();
			}
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
				if (e)
					alert(e.stack);
			});
		}
		document.body.focus();
	};

	var closeClick = function(){
		if (!MockitJs.IO.hasFile() || MockitJs.IO.hasFile()) {
			MockitJs.playHttp();
			root.remove();

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

	var domContent = function(){/*
		<style id="mockit-style">
			#mockit-taskbar {
				position: fixed;
				bottom: 5px;
				right: 5px;
				border: 1px solid;
				border-top-color: #EDEBEB;
				border-left-color: #EDEBEB;
				border-bottom-color: #B0B0B0;
				border-right-color: #B0B0B0;
				user-select: none;
				-webkit-user-select: none;
				-moz-user-select: none;
				-ms-user-select: none;
			}

			#mockit-taskbar button {
				cursor: pointer;
			}

			#mockit-taskbar button,
			#mockit-taskbar button:active,
			#mockit-taskbar button:focus {
				outline: none;
			}

			#mockit-taskbar #mockit-titlebar {
				background-color: #4D4D4D;
				font-family: arial;
				height: 19px;
				padding: 3px;
				cursor: default;
			}

		  	#mockit-taskbar #mockit-titlebar span {
			  	cursor: default;
				position: relative;
				top: -4px;
		  	}

			#mockit-taskbar #mockit-titlebar .mockit-title {
		 		font-size: 12px;
				color: #ccc;
			}

			#mockit-taskbar #mockit-titlebar .mockit-about {
				font-size: 8px;
				color: #666;
				margin: 0 10px 0 5px;
			}

			#mockit-taskbar #mockit-titlebar > button {
				width: 13px;
				height: 13px;
				float: right;
				font-size: 8px;
				background-color: #4D4D4D;
				border: 1px solid white;
				color: white;
				margin-left: 2px;
				padding: 0px;
			}

			#mockit-taskbar #mockit-titlebar > button:active {
				background-color: #292929;
				color: #ccc;
			}

			#mockit-taskbar #mockit-contentbar {
				background-color: #D9D9D9;
				padding: 0 5px;
			}

			#mockit-taskbar #mockit-contentbar button {
				background-color: #D9D9D9;
				border: 1px solid;
				border-top-color: #EDEBEB;
				border-left-color: #EDEBEB;
				border-bottom-color: #B0B0B0;
				border-right-color: #B0B0B0;
				height: 35px;
				width: 35px;
				margin: 5px 0;
				background-size: 20px;
				background-repeat: no-repeat;
				background-position: 50%;
			}

			#mockit-taskbar #mockit-contentbar button:active {
				background-color: #CFCFCF;
				border-top-color: #B0B0B0;
				border-left-color: #B0B0B0;
				border-bottom-color: #EDEBEB;
				border-right-color: #EDEBEB;
			}

			#mockit-taskbar #mockit-contentbar button.start-record {
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB5klEQVR42u2VPYtaURCGVwxbRljQeluLYJNiq2Qh+NEofltF0MqgCIooiuIXCCqoINhoo/9gMf0F2cJmi/yiyX0OJ5DAYnVuEbgDLw4zz9wZzzn3nrs711xzzbX/zDzxePwpk8lY2WxW7F8l7VvkYJxq7k2lUvtSqST7/V4sy5Lr9aqET4wcDKzp5h+SyeRLpVKRy+Uip9NJWq2WlMtlJXxi5GDS6fTB5BCecDj8lUb809FopJpUq1Wp1WpK+MTIwcBGIpEvprbj3l7W1+PxKMvlUur1ujQaDWk2m/+IGDkYWGqoNTGAL5/Py/l8Vo1Y7na7/a7IwcBSQ62JAfw87HA4SKfTkW63K71e712Rg4HVA/hNDBDgYev1Wvr9vgwGg5uCgdUDBIwMUCgUZDKZyHQ6lfF4fFMwsNSYGsCfSCTeWNr5fC6z2eymYGCpMbUFvlAo9N02dcLRYrFQjf4WsT95WGpMHUJepcdYLPbCl261Wslms1H7jI/wieHDwFJj6jXkY/LR1qdoNPqzWCzKcDiU7XYru91OCZ8YORhYXWPsXuCz+sCDg8HgD/vS+cUpz+VySvjEyOnmD07cB179r1jaz7aebX3TetaxR814nboRPXpfffqEB7T8Onbv5HXsmmuuOWK/AUawlKBwEqawAAAAAElFTkSuQmCC');
			}

			#mockit-taskbar #mockit-contentbar button.stop-record {
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAq1JREFUeNrsVs9rE1EQnvf2R5K2qTVNI6Gl7aFYIlXRS5CKFZF6KMSzF+lBtCj+Af0DtFdBKkUsiBdPHgz0UkQiFTSXgFoIqSU0tRqMMcb0V2h285zZbGuitCnNSkDy4CPZed9kvjczbzZMCAH1XBzqvBoCGgIaAuouQK5GYIxVPD73+/wtHCYkIc5vDzHi6IyF1oowfjkcDaOpYrrtNexYtUlYJkCaPeObcra2Xuu6cBFcvgGQmhzGhr6xCZnoPKy8fAGrudyj4TfRMTJbKUDG4M/aPJ7AwPVbUIh9gHz4FWjfkqU0dnjB7h8Cpf84zD+chOzX1PTw2+iNbRG1CmDTp/rOHTvSETp58zbkg0+hsLKE+cDqcbOFikUMpYHS1Qv2wBV49+A+xFLpodHIx7lSfFFTEyqdqnyn59IIbIVmQMdT86Zm4A4HcJutBPqONtojDnG9qnSXfK24BQ67xAcPt7eBnohjQAymYlBZqQTZcI84xLVxPki+Nd8CXColkH+Kg6zaQVDaK29GebsDw9IQ10y6aoUABoyDyP4wTil2C/67qQwu+Ri+FggwTlzEH5VsdihWaVpucoExyyahyGl6JLuRxxLYQMZ6S7uA9ohDXPL5cyAdVMDWbCp7L5FMAcf6UgBJUf5qQrLRHnGISz7ka4WAzcn4l7nF3HowEl3AAIrRjCUhqgEjM2ijPeIQl3zIt2p19zOI8MOJ6Hl8+uhEv8s50tfbDW63GzvIbCFNg3Q6DYtLyxDLrM6MRhbG0ZpArFYbRPsdxRLiEKLzarfnbMDrGmuXpRNi55oAfNf098FkZurJcuo1Pn5G/LRqFO+8jBDNCBcCjw8tpg3MQGuINCKDWLf6ZQRlh1XMCaeW3XNhNhzVvPCvXscHXnvFkGtxbvwnbAj4LwT8EmAAk+oUbw9u+WUAAAAASUVORK5CYII=');
			}

			#mockit-taskbar #mockit-contentbar button.play-mock {
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAK3RFWHRDcmVhdGlvbiBUaW1lAERpIDE4IEZlYiAyMDAzIDIyOjI5OjU3ICswMTAwxAi8mAAAAAd0SU1FB9MCGhU2KcxZSDgAAAAJcEhZcwAACvAAAArwAUKsNJgAAAAEZ0FNQQAAsY8L/GEFAAAB90lEQVR42q2Ty2tTQRTGv3ndV3qpqMUW6SrU6EIRcSFkI9iKqxbElbYoSOtCEIoPXIiiQkHElSAYEEEEodA/oLjxUbpqUaL0gRIXoQ2lsZrbtMlN7r3jaaBZGKsROvAxB2a+3znDOQNs2zqPK4k7+woYxBQuIfnf/tbhHUvp3LR+9eG5PvzgYEiQFG5g5798fDNQXFpfvs8jV1zA2WQfv9hzZtAJrBncRH9TgFCHWK2s4KefJ0gWVgwYOHViz6G9nS9wDa9xH11/BTCmeTEooBR5pAIKQR758iLicZf1Hk907+JOmqq5jXsw/wiIpGblsAgfa/BZERW+iqpYg5AarqtwuueAdfJY/C6q+EiYI40VCI2AlUhlBJx2uQ7HVrBJliXB6TwR343r55L7JecvN32yXotgiFgALapEq8IUvGZUSkJKQZIwFMEMiZCxqAHAxIbCWiYhIgi6bJqyZrQME26LjU+ZHMYm07Pa1v2NAANsI5NSHJJoXGmKFVzHgR9GSI1Pri8seyM0GQ8xhErjEzh5pKqVaTMT2mBobXHwdu6bfj+TGUcbLlMXMr+3sQ4QBocjbcRUDDFb4+uPLJ69mVosmcEwrmJ0q0GqA0qR73W47ZbPPTydfhd+Xso+oY7fopH2mvsMI7jQmepYxiNM4DGONmfahvULnDOiYk+U79AAAAAASUVORK5CYII=');
			}

			#mockit-taskbar #mockit-contentbar button.pause-mock {
				background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAB3RJTUUH1wkbDAEGsIVZyAAAAAlwSFlzAAAewQAAHsEBw2lUUwAAAARnQU1BAACxjwv8YQUAAADfSURBVHjazZKxbcMwEEW/ZINwExjpPIGbIH1KF94pC3gAb5ApUhmIN0kbIzBgyJBOJI+UolOl4OBcGf+OD+Tj54HAf6eYLl73n8cQ06YNHWLIeNs9FX9xSTkVNMR4Xj9i+7IC+Wxyyfy3IIHaDOdKXGs2uWogdh8zpKocsrhqIHZqExZuhprY5KrBvGQsH9x4WzPZeIurBqfvCvVwWzHMmIhMrhpcyRVf5xaBMzg2JtdDJOrlrYF7pHgxuRKIffws3IF9ZXIlELuPCSl3SNyYXA1R7B+Hd+Tk0fedye8jP8Ji9Egu+ocHAAAAAElFTkSuQmCC');
			}

			#mockit-taskbar #mockit-contentbar button.save-mock {
				background-image: url('data:image/gif;base64,R0lGODlhHAAcALMAAAAAAJmZAMzMzP///////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAQALAAAAAAcABwAAARzEMhJq7046xmCFGAojsJXch5ArqFJdSZLYrAqz1d947Wk7yJfShgDnnqAn/E4TKaWICKqCJRKoczXcDlFNTdeLRLcQZbP6HRarG6vvV+wky2vmMvg4Byeb+2FYxd6d4EWg01nfVF/gIpZAAR1cgSRkhoRAAA7');
			}

			#mockit-taskbar #mockit-contentbar button.load-mock {
				background-image: url('data:image/gif;base64,R0lGODlhIAAaALMAAAAAAJmZAP//AP///////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAAQALAAAAAAgABoAAASGkMhJ6wQ4281p/kAnehgZSudYlWvJqjAIz8RnanRto+Cr9jzAQDDsGVMczHApOAI7GKKUSZXiksKptlpEWqLc7dT3zYbD5JZ44GyDuO44eIwJ2O/4vF2jpAP0gHg4c2x1gYFXfYV/h4BXOkQZjY5kSpKTeY9Bhph3mpudgmmbck8bpUciEQAAOw==');
			}
		</style>

		<div id="mockit-taskbar">
			<div id="mockit-titlebar">
				<span class="mockit-title">Let mock it!</span>
				<span class="mockit-about">dev by Azzi</span>
				<button id="mockit-close">x</button>
				<button id="mockit-minimize">-</button>
			</div>
			<div id="mockit-contentbar">
				<button class="start-record" id="mockit-record"></button>
				<button class="play-mock" id="mockit-play"></button>
				<button class="save-mock" id="mockit-load" title="Abre um arquivo de mock"></button>
				<button class="load-mock" id="mockit-save" title="Salva um arquivo de mock"></button>
			</div>
		</div>
	*/};

	_constructor();
};