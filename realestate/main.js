"use strict";

var language = 'en'
var BASE_ENDPOINT = window.location.href + '/api/';

// Instrucciones
(function() {
  $('.descripcion-endpoint').text(BASE_ENDPOINT);
}());

// Altura <pre>
(function() {
  var altura = $('#formulario-controles').height();
  var paddingTop = $('#resultados').css('padding-top').replace('px', '');
  var paddingBottom = $('#resultados').css('padding-bottom').replace('px', '');
  $('#resultados').height(Math.min(altura - paddingTop - paddingBottom, 700));
}());

// Funcionalidad barra de busqueda
(function() {
  // ### Resultados
  var resultados = (function() {
    var resultados = $('#resultados');

    function escribirResultados(data) {
      resultados.text(data);
    }

    return {
      escribirResultados: escribirResultados
    }
  }());

  // ### La barra - Almacena los parametros en clausura
  var barra = (function() {
    $('#prefijo-endpoint').html(BASE_ENDPOINT);

    var mensajeNoEncontrado

    if (language === 'es') {
      mensajeNoEncontrado = 'No encontrado'
    } else {
      mensajeNoEncontrado = 'Not found'
    }

    var barra = $('#barra');
    var botonEnviar = $('#boton-enviar');

    // Inicializa la lista de parametros vacios de antemano por razones esteticas
    var parametrosActivos = new function() {
      var input = $('#formulario-controles').find('input'),
        select = $('#formulario-controles').find('select'),
        todo = input.add(select);


      todo.toArray().forEach(function(inp) {
        Object.defineProperty(this, inp.dataset.key, {value: null, enumerable: true, writable: true});
      }, this);
    }();
    
    // Asigna event listener para enviar solicitud
    botonEnviar.on('click', function() {
      var ruta = barra.val() || 'props/1';

      var xhr = new XMLHttpRequest();
      xhr.open('GET', BASE_ENDPOINT + ruta);
      xhr.onreadystatechange = function() {
        if (this.readyState === 4) {
          if (this.status === 200) {
            resultados.escribirResultados(JSON.stringify(JSON.parse(this.response), undefined, 4));
          } else {
            resultados.escribirResultados(this.status + ' - ' + mensajeNoEncontrado);
          }
        }
      };
      xhr.send();
    });

    // Envia una solicitud al iniciar
    setTimeout(function() {
      botonEnviar.trigger('click');
    }, 0);

    function esNulo(val) {
      if (val === null) return true;
      else if (val.length === 0) return true;
      else return val.split(',').every(function(ch) {return parseInt(ch) <= 0 || ch.length === 0});
    }

    function componerSolicitud() {
      var params = Object.entries(parametrosActivos),
        paramsStr = params.reduce(function(a, b) {
          if (esNulo(b[1])) return a;
          return a + b[0] + '=' + b[1] + '&';
        }, 'props?').slice(0, -1);
      barra.val(paramsStr);
    }

    function agregarParametro(param) {
      try{
        Object.assign(parametrosActivos, param);
        componerSolicitud();
      } catch(err) {
        alert('Funcionalidad no disponible para Internet Explorer');
      }
    }

    return {
      agregarParametro: agregarParametro
    }
  }());

  // ### Controles - Se manejan a traves de un event listener
  (function() {
    // Metodos para manejar cada tipo de input
    var metodo = {
      minMax: function(ele) {
        var key = $(ele).data().key;
    
        var minimo, maximo;

        $(ele)
          .parent()
          .parent()
          .children()
          .each(function(_, val) {
            var medidor = $(val).find('[data-key=' + key + ']')[0];
            if (!minimo && typeof medidor !== 'undefined') minimo = medidor;
            else if (!maximo && typeof medidor !== 'undefined') maximo = medidor;
          });
        
        return Object.defineProperty(
          {},
          key,
          {
            value: Math.ceil(minimo.value) + (maximo && parseInt(maximo.value) >= parseInt(minimo.value) ? ',' + Math.ceil(maximo.value) : ''),
            enumerable: true
          }
        );
      },
      check: function(ele) {
        var key = $(ele).data().key;
        var elementos = [];

        $(ele)
          .parent()
          .parent()
          .parent()
          .find('[data-key=' + key + ']')
          .addBack()
          .filter(':checked')
          .each(function(_, el) {
            elementos.push(el.name)
          });

        return Object.defineProperty(
          {},
          key,
          {
            value: elementos.join(),
            enumerable: true
          }
        );
      },
      radio: function(ele) {
        var key = ele.name;

        return Object.defineProperty(
          {},
          key,
          {
            value: ele.id,
            enumerable: true
          }
        );
      },
      drop: function(ele) {
        var key = $(ele).data().key;

        return Object.defineProperty(
          {},
          key,
          {
            value: $(ele).val(),
            enumerable: true
          }
        );
      }
  };
  
  // El handler
  $('#formulario-controles').on('change', function(e) {
    var param;

    switch(e.target.type) {
        case 'number':
        case 'range':
          param = metodo.minMax(e.target);
          break;
        case 'checkbox':
          param = metodo.check(e.target);
          break;
        case 'radio':
          param = metodo.radio(e.target);
          break;
        case 'select-one':
        default:
          param = metodo.drop(e.target);
      }

      barra.agregarParametro(param);
    });
  }());
})();

// Cambiar el funcionamiento default de apretar enter en la barra
(function() {
  $('#barra').on('keypress', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      $('#boton-enviar').trigger('click');
    }
  })
}());

// Valores de los sliders
(function() {
  // Operaciones particulares
  var particular = {
    usd: function(val) {
      return Math.floor(val / 60);
    }
  }

  function pasarValor(ele, valor, partc) {
    ele.firstChild.textContent = partc && valor !== '-' ? partc(valor) : valor;
  }

  // Preparar event
  $('input[type="range"]').on('change', function(e) {
    var visores = $(e.target).siblings('.visor-range');
    visores.each(function(_, ele) {
      var valor = e.target.value > 0 ? e.target.value : '-';
      var partc = particular[$(ele).data('particular')];
      pasarValor(ele, valor, partc);
    });
  });
}());

// Grey-out de los sliders
(function() {
  // Devuelve checkboxes sin repetir
  function getCheck(v) {
      try{
          var IDs = Array.from(new Set(v.map(function(_, vis) {
              return vis.dataset.greycheck;
          })));
      } catch(err) {
          console.log('WARNING: Array.from no soportado');

          var set = new Set(v.map(function(_, vis) {
              return vis.dataset.greycheck;
          }));

          var IDs = [];
          
          for (var i = 0; i < set.length; i++) {
              IDs.push(set[i]);
          }
      }

      return IDs.map(function(v) {
          return document.getElementById(v);
      });
  }

  function getRange(v) {
    try{
      var IDs = Array.from(new Set(v.map(function(_, vis) {
        var d = [];
        $(vis).siblings('input[type="range"]').each(function(_, rang) {
          d.push($(rang).attr('id'));
        });
        return d;
      })));
    } catch(err) {
      var set = new Set(v.map(function(_, vis) {
        var d = [];
        $(vis).siblings('input[type="range"]').each(function(_, rang) {
          d.push($(rang).attr('id'));
        });
        return d;
      }));

      var IDs = [];
      
      for (var i = 0; i < set.length; i++) {
        IDs.push(set[i]);
      }
    }
    
    return IDs.map(function(v) {
      return document.getElementById(v);
    });
  }

  function handle() {
    this.visores.each(function(_, visor) {
      var check = getCheck($(visor));
      var range = getRange($(visor));

      var isAllUnchecked = !($(check).parent().parent().find('input[type="checkbox"]').is(':checked'));

      var isValue = $(range).val() > 0;
      var isChecked = check.length > 0 ? $(check).is(':checked') : true;
      var isDefaultUncheck = visor.dataset.defaultuncheck ? isAllUnchecked : false;

      visor.classList[isValue && (isChecked || isDefaultUncheck) ? 'remove' : 'add']('greyed');
    })
  }

  var grupos = [];
  $('.row-input').each(function(_, row) {
    var grupo = $(row).find('.visor-range');
    if (grupo.length > 0) grupos.push(grupo);
  });

  grupos.forEach(function(grupo) {
    var checks = getCheck(grupo);
    var ranges = getRange(grupo);
    var merge = $.merge(checks, ranges);
    $(merge).on('change', handle.bind({visores: grupo}));
  });
}());

// Acordeon
(function() {
  $('.acordeon-titulo').on('click', function(e) {
    var contenido = $(e.target).next('.acordeon-contenido');
    contenido.slideToggle();
    e.target.classList[contenido.height() < 10 ? 'add' : 'remove']('flecha-arriba');
  });
  
  $('.acordeon-init').each(function(_, v){
    $(v).next('.acordeon-contenido').hide();
    v.classList.remove('acordeon-init');
  });
}());

// Año actual
(function() {
  var year = new Date().getFullYear()
  $('.current-year').text(year)
})();

// Localizacion
(function() {
  // $('[data-toggle="lang"]').click(function(event) {
  //   event.preventDefault();
  //   $('html').attr('lang', $(this).attr('data-lang'));
  // });
  var langs = ['en', 'es'];
  var params = new URLSearchParams(window.location.search);
  var lang = 0;
  
  if (params.has('lang')) {
    lang = langs.indexOf(params.get('lang'));
    $('html').attr('lang', langs[lang]);
  } else if (navigator.language.match(/^(en|es)/)) {
    lang = langs.indexOf(navigator.language.substring(0, 2));

    if (lang < 0) {
      lang = 0;
    }

    $('html').attr('lang', langs[lang]);
  }

  language = langs[lang]
})();
