Ext.data.JsonP.MockitJs_IO({"tagname":"class","name":"MockitJs.IO","autodetected":{},"files":[{"filename":"Mockit.js","href":"Mockit.html#MockitJs-IO"}],"private":true,"members":[{"name":"clear","tagname":"method","owner":"MockitJs.IO","id":"method-clear","meta":{}},{"name":"declareFileOpen","tagname":"method","owner":"MockitJs.IO","id":"method-declareFileOpen","meta":{}},{"name":"feedFile","tagname":"method","owner":"MockitJs.IO","id":"method-feedFile","meta":{}},{"name":"generateMockRootKey","tagname":"method","owner":"MockitJs.IO","id":"method-generateMockRootKey","meta":{"private":true}},{"name":"getFile","tagname":"method","owner":"MockitJs.IO","id":"method-getFile","meta":{"private":true}},{"name":"hasFile","tagname":"method","owner":"MockitJs.IO","id":"method-hasFile","meta":{}},{"name":"readFile","tagname":"method","owner":"MockitJs.IO","id":"method-readFile","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-MockitJs.IO","classIcon":"icon-class","superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/Mockit.html#MockitJs-IO' target='_blank'>Mockit.js</a></div></pre><div class='doc-contents'><div class='rounded-box private-box'><p><strong>NOTE:</strong> This is a private utility class for internal use by the framework. Don't rely on its existence.</p></div><p>Classe responsável pela manipulação do arquivo de mock</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-clear' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MockitJs.IO'>MockitJs.IO</span><br/><a href='source/Mockit.html#MockitJs-IO-method-clear' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MockitJs.IO-method-clear' class='name expandable'>clear</a>( <span class='pre'></span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Limpa o mock no browser ...</div><div class='long'><p>Limpa o mock no browser</p>\n</div></div></div><div id='method-declareFileOpen' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MockitJs.IO'>MockitJs.IO</span><br/><a href='source/Mockit.html#MockitJs-IO-method-declareFileOpen' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MockitJs.IO-method-declareFileOpen' class='name expandable'>declareFileOpen</a>( <span class='pre'>name, content</span> ) : Error|Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Método responsável por definir o arquivo como aberto ...</div><div class='long'><p>Método responsável por definir o arquivo como aberto</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>name</span> : String<div class='sub-desc'><p>Nome do arquivo que será definido como aberto</p>\n</div></li><li><span class='pre'>content</span> : String<div class='sub-desc'><p>Conteúdo do arquivo</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Error|Boolean</span><div class='sub-desc'><p>Se o conteúdo do arquivo conter erros, então o objeto de\nerro é devolvido, caso contrário se retorna false</p>\n</div></li></ul></div></div></div><div id='method-feedFile' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MockitJs.IO'>MockitJs.IO</span><br/><a href='source/Mockit.html#MockitJs-IO-method-feedFile' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MockitJs.IO-method-feedFile' class='name expandable'>feedFile</a>( <span class='pre'>url, method, json</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Alimenta o arquivo aberto com mais informações de mock ...</div><div class='long'><p>Alimenta o arquivo aberto com mais informações de mock</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>Url para qual a requisição http foi direcionada</p>\n</div></li><li><span class='pre'>method</span> : String<div class='sub-desc'><p>Método http que a requisição foi chamada (GET, POST, PUT, DELETE)</p>\n</div></li><li><span class='pre'>json</span> : Object<div class='sub-desc'><p>Objeto cujo os atributos devem ser os parâmetros enviados\npara o servidor e os valores dos atributos devem ser os\nresultados obtidos pela requisição</p>\n</div></li></ul></div></div></div><div id='method-generateMockRootKey' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MockitJs.IO'>MockitJs.IO</span><br/><a href='source/Mockit.html#MockitJs-IO-method-generateMockRootKey' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MockitJs.IO-method-generateMockRootKey' class='name expandable'>generateMockRootKey</a>( <span class='pre'>url, method</span> ) : String<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Gera a chave que irá vincular o json no root do mock,\nesta chave é baseada na url da requisição http e no\nmétodo da r...</div><div class='long'><p>Gera a chave que irá vincular o json no root do mock,\nesta chave é baseada na url da requisição http e no\nmétodo da requisição</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>Url da requisição de http</p>\n</div></li><li><span class='pre'>method</span> : String<div class='sub-desc'><p>Método da requisição http</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Chave indicando em qual json as informações da\nrequisição devem ser vinculadas</p>\n</div></li></ul></div></div></div><div id='method-getFile' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MockitJs.IO'>MockitJs.IO</span><br/><a href='source/Mockit.html#MockitJs-IO-method-getFile' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MockitJs.IO-method-getFile' class='name expandable'>getFile</a>( <span class='pre'></span> ) : Object<span class=\"signature\"><span class='private' >private</span></span></div><div class='description'><div class='short'>Retorna um objeto com o nome do arquivo e o seu conteúdo ...</div><div class='long'><p>Retorna um objeto com o nome do arquivo e o seu conteúdo</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Object</span><div class='sub-desc'><p>Objeto com o nome do arquivo e seu conteúdo</p>\n\n<h1>name</h1>\n\n<p>Nome do arquivo</p>\n\n<h1>content</h1>\n\n<p>Conteúdo do arquivo</p>\n</div></li></ul></div></div></div><div id='method-hasFile' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MockitJs.IO'>MockitJs.IO</span><br/><a href='source/Mockit.html#MockitJs-IO-method-hasFile' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MockitJs.IO-method-hasFile' class='name expandable'>hasFile</a>( <span class='pre'></span> ) : Boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Verifica se há um arquivo aberto ...</div><div class='long'><p>Verifica se há um arquivo aberto</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-readFile' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='MockitJs.IO'>MockitJs.IO</span><br/><a href='source/Mockit.html#MockitJs-IO-method-readFile' target='_blank' class='view-source'>view source</a></div><a href='#!/api/MockitJs.IO-method-readFile' class='name expandable'>readFile</a>( <span class='pre'>url, method, [params]</span> ) : String<span class=\"signature\"></span></div><div class='description'><div class='short'>Retorna o conteúdo do arquivo se baseando na url, no método http\ne nos parâmetros que foram enviados, se a url unida ...</div><div class='long'><p>Retorna o conteúdo do arquivo se baseando na url, no método http\ne nos parâmetros que foram enviados, se a url unida com o método\nhttp não forem encontrados no mock, o método gera um warning, se\nos parâmetros para aquela url não forem encontrados, ele irá retornar\nos registros do primeiro indice dentro da chave formada pela url e\npelo método http.</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>url</span> : String<div class='sub-desc'><p>Url da requisição http</p>\n</div></li><li><span class='pre'>method</span> : String<div class='sub-desc'><p>Método http da requisição</p>\n</div></li><li><span class='pre'>params</span> : String (optional)<div class='sub-desc'><p>Dados que foram enviados para o servidor</p>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>String</span><div class='sub-desc'><p>Dados de retorno da requisição que estão guardados no mock</p>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{"private":true}});