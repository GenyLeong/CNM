var MainContent = newFunction();

function newFunction() {
    // name_selector()
    return (function () {
      // $("#search").on("keyup", buscar);
        var height_size = window.innerHeight;
        var width_size = window.innerWidth, margin = { top: 20, right: 10, bottom: 50, left: 10 }, width = width_size - margin.right - margin.left, height = height_size - margin.top - margin.bottom;

        var posX = d3.scale.linear()
                    .range([0,width/2])
                    .domain([0,width]);

        var posY = d3.scale.linear()
                    .range([0,height/2])
                    .domain([0,100]);

        var change_distance = d3.select('#linkDistance')
                                .append('input')
                                .classed('change_distance', true)
                                .attr('type', 'number')
                                .attr("pattern", "\\d*")

        var change_gravity = d3.select("#gravity")
                                .append('input')
                                .attr("type", "range")
                                .classed("change_gravity", true)
                                .attr("value","0.2")
                                .attr("min", "0")
                                .attr("max", "1")
                                .attr("step", ".01")

        var change_charge = d3.select("#charge")
                                .append('input')
                                .attr("type", "range")
                                .classed("change_charge", true)
                                .attr("value","500")
                                .attr("min", "0")
                                .attr("max", "1000")
                                .attr("step", "100")

        var param =  width/4;
        var links = json.start();
        var jsond3 = json.start();
        var nodes = {};
        name_selector()
        function name_selector(){

          var data = []
          for (var i = 0; i < jsond3.length; i++) {
            data.push(jsond3[i].id)
            data = data.filter(function (el) {
              return el != null;
            });
          }
          console.log(data)
          initSelect2(data)
        }

        $(".change_distance").keypress(function(e){

            if (e.which == 13 && $(".change_distance").val()!== "") {
                var param = $(".change_distance").val()
            }

            else {
                var param =  width/4
            }

            force
            .linkDistance(param)
            .start()
        })

      // $("#search").keyup(function(e){
      //   var tarjetas = $(".node");
      //   var texto    = $("#search").val();
      //   texto        = texto.toLowerCase();
      //   // tarjetas.show();
      //   for(var i=0; i<= tarjetas.length; i++){
      //     var contenido = tarjetas[i].textContent;
      //     contenido     = contenido.toLowerCase();
      //     var index     = contenido.indexOf(texto);
      //     if(index != -1){
      //       // $(".node").removeClass("text-click")
      //       var this_click = tarjetas.eq(i).find(".image")
      //       // tarjetas.eq(i).find(".image").click()
      //       d3.selectAll(this_click).each(function(d, i) {
      //         var onClickFunc = d3.select(this).on("click");
      //         onClickFunc.apply(this, [d, i]);
      //       });
      //     }
      //   }
      // })

      function initSelect2 (data) {
        // console.log(data)
        personaje_list = $(".MyBankSearchSelect_personaje .MyBankSearchSelect__list");
        personaje_list.select2({
          dropdownParent: $(".MyBankSearchSelect_personaje"),
          placeholder : "Busca a una persona",
          multiple: true,
          maximumSelectionLength: 1,
          minimumInputLength: 1,
          data: data,
          language: {
            noResults: function(term) {
              return "No hay resultados";
            },
            inputTooShort: function () {
              dispatch.unhighlightAll();
              // d3.selectAll("svg").each(function(d, i) {
              //   var onClickFunc = d3.select("svg").on("click");
              //   onClickFunc.apply(this, [d, i]);
              // })
              return "Busca a una persona";
            },
            maximumSelected: function() {
              return "Haz otra busqueda";
            }
          }
        });

        personaje_list.on('select2:open', function (e) {
          // events.createNiceScroll();
          // dom.municipio_list.html('')
          // document.getElementById("Municipio-search").disabled = true;
          // $("#Municipio-search").addClass("h-overlay-disabled")
          $("svg").click()
        });

        personaje_list.on("select2:select", function (e) {
          //accion que se ejecuta al buscar

          var data_select = e.params.data;
          console.log(data_select)
          var tarjetas = $(".node");
            // var texto    = $("#search").val();
            // texto        = texto.toLowerCase();
            // tarjetas.show();
            for(var i=0; i<= tarjetas.length; i++){
              var contenido = tarjetas[i].textContent;
              // contenido     = contenido.toLowerCase();
              var index     = contenido.indexOf(data_select.id);
              if(index != -1){
                // $(".node").removeClass("text-click")
                var this_click = tarjetas.eq(i).find(".image")
                // tarjetas.eq(i).find(".image").click()
                d3.selectAll(this_click).each(function(d, i) {
                  var onClickFunc = d3.select(this).on("click");
                  onClickFunc.apply(this, [d, i]);
                });
              }
            }

          // $('.personaje-item[data-nom-personaje="'+data_select.id+'"]').click()
          // events.seleccionEntidad()
        });
      }

      $(".change_gravity").on("change input", function(e){
          var val = $(".change_gravity").val();
          d3.select("#gravityLabel").text(val)
              force.gravity(val);
              force.start()
      })

      $(".change_charge").on("change input", function(e){
          var val = $(".change_charge").val();
          d3.select("#chargeLabel").text(val)
              force.charge("-"+val);
              force.start()
      })

        // Compute the distinct nodes from the links.
        links.forEach(function (link) {
            link.source = nodes[link.source] || (nodes[link.source] = { name: link.source, image: link.image, image_click: link.image_click, type: link.type, x: link.x, y: link.y });
            link.target = nodes[link.target] || (nodes[link.target] = { name: link.target, image: link.image, image_click: link.image_click, type: link.type, x: link.x, y: link.y });
        });
        // console.log(links);
        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
            .size([width/2, height])
            .linkDistance(param)
            // .linkStrength(0.1)
            .charge(-300)
            .gravity(0.2)
            .on("tick", tick)
            .start();

        var drag = force.drag()
                    .on("dragstart", dragstart);

        force.on("start", function() {
            node
            .data(force.nodes())
            .attr("cx", function(d) {
                //To show this event is not triggered
                    // d3.select("body")
                    //             .append("text")
                    //     .text(d.x);


                    return posX(d.x);
                })
                .attr("cy", function(d) {
                    return posY(d.y);
                })
        });

        console.log(d3.values(nodes));
        var svg = d3.select("#area2").append("svg")
            .attr("width", width)
            .attr("height", height);
        var tip = d3.select("#area2")
            .append("div")
            .attr("class", "tip");
        tip.show = function (d) {
            var posX = d3.event.pageX, posY = d3.event.pageY - 20; // right: -10
            for (var i = 0; i < jsond3.length; i++) {
                if (d.index == i) {
                    var html = d.name + ":<br>" + jsond3[i].type;
                    tip.html(html);
                    // Tooltip to the left if it gets out of the window
                    var tipBox = tip.node().getBoundingClientRect();
                    if (posX + tipBox.width > window.innerWidth) {
                        posX -= tipBox.width + 20;
                    }
                    else {
                        posX += 20;
                    }
                    tip.attr('style', `visibility: visible; left: ${posX}px; top: ${posY}px`);
                };
            }
            force.stop();
        };
        tip.hide = function () {
            tip.style("visibility", "hidden");
            force.start();
        };

        var linkedByIndex = {};
        links.forEach(function (d) {
            linkedByIndex[d.source.index + "," + d.target.index] = 1;
        });
        function isConnected(a, b) {
            return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
        }
        var link = svg.selectAll(".link")
            .data(force.links())
            .enter().append("line")
            .attr("class", "link");
        // add the links and the arrows
        // var path = svg.append("svg:g").selectAll("path")
        //     .data(force.links())
        //     .enter().append("svg:path")
        //     .attr("class", function(d) { return "link " + d.id.parent})
        console.log(force.links());
        // define the nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter()
            .append("g")
            .attr("class", "node")
            .on("dblclick", dblclick)
            .call(drag);

            if(width_size <= 767){
                node.append("image")
                    .attr("xlink:href", function (d) { return d.image; })
                    .attr("x", -7)
                    .attr("y", -10)
                    .attr("class", "image")
                    .attr("width", 20)
                    .attr("height", 20)
                    .on("mouseover", tip.show)
                    .on("mouseout", tip.hide)
                    .on("dblclick", tip.show)
                    .on('click', function (d) {
                        dispatch.toggleSingle(this, d);

                    });
            }
            else{
                node.append("image")
                .attr("xlink:href", function (d) { return d.image; })
                .attr("x",-7)
                .attr("y", -10)
                .attr("class", "image")
                .attr("width", 18)
                .attr("height", 18)
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide)
                .on('click', function (d) {
                    dispatch.toggleSingle(this, d);
                });
            }
        //   .on("click", click(0.6))
        // add the text
        node.append("text")
            .attr("x", 10)
            .attr("y", function(d, i) { if (i>0) { return 5 }    else { return 8 } })
            // .attr("dy", ".35em")
            .text(function (d) {
                return d.name;
            });
        // add the curvy lines
        function tick() {
            // path.attr("d", function(d) {
            //     var dx =  d.id.x - d.target.x,
            //         dy = d.id.y - d.target.y,
            //         dr = Math.sqrt(dx * dx + dy * dy);
            //     return "M" +
            //         d.id.x + "," +
            //         d.id.y + "A" +
            //         dr + "," + dr + " 0 0,1 " +
            //         d.target.x + "," +
            //         d.target.y;
            // })
            link
                .attr("x1", function (d) { return d.source.x; })
                .attr("y1", function (d) { return d.source.y; })
                .attr("x2", function (d) { return d.target.x; })
                .attr("y2", function (d) { return d.target.y; });

            node
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .call(force.drag);
        }

        function dblclick(d) {
            d3.select(this).classed("fixed", d.fixed = false);
        }

        function dragstart(d) {
            d3.select(this).classed("fixed", d.fixed = true);
        }

        var dispatch = d3.dispatch('unhighlightAll', 'toggleSingle')
            // remove the `highlighted` class on all circles
            .on('unhighlightAll', function (d) {
                // console.log(d)
                d3.selectAll('.link')
                    .classed('link-click', false)
                    .style("stroke-opacity", 1);

                d3.selectAll('.image')
                    .attr("xlink:href", function (d) {
                        return d.image;
                    })

                node
                .style("opacity", 1)
                .classed("text-click", false)
                .style('fill-opacity', 1)
                // .on('click', tip.hide)

                tip.style("visibility", "hidden");
                force.start();

            })
            // toggle the `highlighted` class on element `el`
            .on('toggleSingle', function (el, d) {
                //   return function(d) {
                // console.log("toggleSingle");
                var opacity = 0.5;
                node
                    .style("opacity", function (o) {
                        thisOpacity = isConnected(d, o) ? 1 : opacity;
                        this.setAttribute('fill-opacity', thisOpacity);
                        return thisOpacity;
                    })
                    .classed("text-click", function (o) {
                        return isConnected(d, o) ? true : false;
                        // return o.id === d || o.target === d ? true : false;
                    })
                    // .on('click', tip.show)


                d3.selectAll(".link")
                    .style("stroke-opacity", function (o) {
                        return o.source === d || o.target === d ? 1 : opacity;
                    })
                    // .style("stroke-width", function(o) {
                    //     return o.id === d || o.target === d ? 2 : 1;
                    // })
                    .classed("link-click", function (o) {
                        return o.source === d || o.target === d ? true : false;
                    });

                    d3.selectAll('.image')
                    .attr("xlink:href", function (o) {
                        return isConnected(d, o) ? o.image_click : d.image;
                    })

                    tip.style("visibility", "hidden");

                    // dispatch.unhighlightAll();
                // };
            });

        svg.on('click', function () {
            // do nothing if a clickable circle is clicked
            if (d3.select(d3.event.target).classed('image')) {
                console.log("entró");

                return;
            }
            else {
                // otherwise unhighlight all circles
                dispatch.unhighlightAll();
            }
        });

    })();
}
