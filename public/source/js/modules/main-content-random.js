var MainContent = (function(){

    // ************** Generate the tree diagram	 *****************
    var height_size = window.innerHeight;
    var width_size = window.innerWidth,
        margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = width_size - margin.right - margin.left,
        height = height_size - margin.top - margin.bottom,
        root;

    var force = d3.layout.force()
        .size([width, height])
        .linkDistance(height /2)
        .on("tick", tick);

    var svg = d3.select("#area2").append("svg")
        .attr("width", width)
        .attr("height", height);

    var link = svg.selectAll(".link"),
        node = svg.selectAll(".node");

    d3.json("data/entidades.json", function(error, json) {
      if (error) throw error;

      root = json;
      update();
    });

    function update() {
      var nodes = flatten(root),
          links = d3.layout.tree().links(nodes);

      var tip = d3.select("#area2")
        .append("div")
        .attr("class", "tip");

        tip.show = function(d){
          var posX = d3.event.pageX,
              posY = d3.event.pageY; // right: -10

          var html = "",
              type = d.type;

          html += d.name;

          if(type) {
            html += ": <p>" + type[0].toUpperCase() + type.substr(1).replace(/_/g, ' ') + "</p>";
          }
          tip.html(html);

          // Tooltip to the left if it gets out of the window
          var tipBox = tip.node().getBoundingClientRect();
          if(posX + tipBox.width > window.innerWidth) {
            posX -= tipBox.width + 10;
          } else {
            posX += 10;
          }
          tip.attr('style', `visibility: visible; left: ${posX}px; top: ${posY}px`);
        };
        tip.hide = function(){
          tip.style("visibility", "hidden");
        }

      // Restart the force layout.

      force
          .nodes(nodes)
          .links(links)
          .linkDistance(200)
          .charge(-500)
          .theta(1)
          .gravity(0.03)
          .start();


      // Update the links…
      link = link.data(links, function(d) { return d.target.id + 100; });

      // Exit any old links.
      link.exit().remove();

      // Enter any new links.
      link.enter().insert("line", ".node")
          .attr("class", "link")
          .attr("x1", function(d) { return d.source.x ; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      // Update the nodes…
      // node = node.data(nodes, function(d) { return d.id; }).style("fill", color);

      // // Exit any old nodes.
      // node.exit().remove();

      // // Enter any new nodes.
      // node.enter().append("circle")
      //     .attr("class", "node")
      //     .attr("cx", function(d) { return d.x; })
      //     .attr("cy", function(d) { return d.y; })
      //     .attr("r", function(d) { return Math.sqrt(d.x1) / 2 || 4.5; })
      //     .style("fill", color)
      //     .on("click", click)
      //     .call(force.drag);

        node = node
                .data(nodes, function(d) { return d.id; }).style("fill", color)

        node.exit().remove();

        node.enter().append("g")
            .attr("class", "node")
            .call(force.drag);

      node.append("image")
          .attr("xlink:href", function(d){
            return d.image
          })
          .attr("x", -8)
          .attr("y", -8)
          .attr("width", 16)
          .attr("height", 16)
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide)
          .on("click", click)

      node.append("text")
          .attr("dx", 12)
          .attr("dy", ".35em")
          .text(function(d) { return d.name });
    }

    function tick() {
      link.attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });

      node.attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    }

    // Color leaf nodes orange, and packages white or blue.
    function color(d) {
      return d._children ? "#B92B27" : d.children ? "#B92B27" : "#fd8d3c";
    }

    // Toggle children on click.
    function click(d) {
      if (!d3.event.defaultPrevented) {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        update();
      }
    }

    // Returns a list of all nodes under the root.
    function flatten(root) {
      var nodes = [], i = 0;

      function recurse(node) {
        if (node.children) node.children.forEach(recurse);
        if (!node.id) node.id = ++i;
        nodes.push(node);
      }

      recurse(root);
      return nodes;
    }

    })();
