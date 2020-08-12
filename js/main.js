
// create an array with nodes

var nodecount = 1;
var id = [];
var nodes = [];
var edges = [];
// create a network
var network;
var key_collection = [];
var data_node = {};
var idGlobal = 0;
var ativosGlobal = 0;

var options = {layout:{randomSeed:2}};
id.push(0);
nodes.push({
    id: 0,
    label: String(0)

});
data_node[id[0]] = {};

document.getElementById('file').onchange = function(){

    var file = this.files[0];
  
    var reader = new FileReader();
    reader.onload = function(progressEvent){  
  
      // By lines
      var lines = this.result.split('\n');
      for(var line = 0; line < lines.length; line++){
        addnode(lines[line]);
      }
    };
    reader.readAsText(file);
  };

draw(nodes, edges, options);

function draw(nodes, nodecount, options) {
    var edges = [];
    if(nodecount>1){
        for (var i = 0; i < nodecount; i++) {
            if (i === (nodecount - 1)) {
                edges.push({
                    id: String(id[nodecount-1])+String(id[0]),
                    from: id[nodecount - 1],
                    to: id[0],
                    color: "yellow"
                });
            } else {
                edges.push({
                    id: String(id[i])+String(id[i+1]),
                    from: id[i],
                    to: id[i + 1],
                    color: "yellow"
                });
            }
        }
    }
    var container = document.getElementById('mynetwork');
    var data = {nodes: nodes, edges: edges};
    network = new vis.Network(container, data, options);
    

}
function draw1(nodes,edges,options){
    var container = document.getElementById('mynetwork');
    var data = {nodes: nodes, edges: edges};
    network = new vis.Network(container, data, options);
}



function addnode(value) {
    var new_id = idGlobal++;
    while (id.includes(new_id)) {
        new_id = idGlobal;
    }
    id.push(new_id);
    id.sort(function(a,b) { return  a-b; });
    
    nodecount++;
    edges = [];
    nodes.push({
            id: new_id,
            label: String(new_id),
        });
    data_node
    nodes.sort(function(a,b) { return  a.id-b.id; });   
    var index = id.indexOf(new_id);
    console.log(data_node);
    if (index==nodecount-1){
        var tipo = "desligado"
        if(ativosGlobal < 8){
            var randomTipe = Math.floor(Math.random() * 10);
            tipo = randomTipe % 2 == 0 ? "ativo" : "desligado"
            if(tipo == "ativo"){
                ativosGlobal++;
            }
        }
        var item = [value, tipo]

        data_node[new_id] = item;
    }else{
        data_node[new_id] = {};
        
        for (var key in data_node[id[index+1]]){
            if(key<=new_id){
                data_node[new_id][key] = data_node[id[index+1]][key];
                delete data_node[id[index+1]][key];
            }
        }
    }
    console.log(data_node);
    draw(nodes, nodecount, options);

}

function delnode(){
    
    var n_id = document.getElementById('to_delete').value;
    
    if (isNumeric(n_id)){
    var check_pre = 0;
    for(var i = 0; i <nodecount; i++) {
        if(id[i] == n_id) {
           if(i==nodecount-1){
               for (var key in data_node[id[i]]){
                   console.log(key);
//                   delete key in key_collection;
                   var s = key_collection.indexOf(key);
                   key_collection.splice(s,1);
               }
               delete data_node[id[nodecount-1]];
           }else{
               for(var key in data_node[id[i]]){
                data_node[id[i+1]][key] = data_node[id[i]][key];
               }
               delete data_node[id[i]];
           }  
           id.splice(i, 1);
           nodes.splice(i,1);
           check_pre = 1;
           break;
        }
    }
    if (check_pre==1){
        nodecount--;
        draw(nodes,nodecount,options);
    }else{
        window.alert("The node does not exist");
    }}else{
        window.alert("Give a proper id");
    }
    


} 

function lookupdataName(){
    var valueName = document.getElementById('to_lookupName').value;
    if(idGlobal>0){

        var edges = [];
        if(nodecount>1){
            for (var i = 0; i < nodecount; i++) {
                if (i === (nodecount - 1)) {
                    edges.push({
                        id: String(id[nodecount-1])+String(id[0]),
                        from: id[nodecount - 1],
                        to: id[0],
                        
                    });
                } else {
                    edges.push({
                        id: String(id[i])+String(id[i+1]),
                        from: id[i],
                        to: id[i + 1],
                        
                    });
                }
            }
        }

        for (var i = 0; i < nodecount-1; i++){
            edges[i].color = "red";
            edges[i].arrows = "to";
            draw1(nodes,edges,options);
                if (data_node[id[i+1]][0] == valueName){
                    if(data_node[id[i+1]][1] == "desligado"){
                        for (var i2 = i + 1; i2 < nodecount-1; i2++){
                            edges[i2].color = "red";
                            edges[i2].arrows = "to";
                            draw1(nodes,edges,options);
                            if (data_node[id[i2+1]][1] == "ativo"){
                                document.getElementById('output').innerHTML = "key = "+i2+" valor encontrado no node = "+ id[i2+1]+" com valor = " +  data_node[id[i2 + 1]][0] + " e tipo: " +  data_node[id[i2 + 1]][1];
                                break;
                            }
                        }
                        break;
                    }else{
                        document.getElementById('output').innerHTML = "key = "+i+" valor encontrado no node = "+ id[i+1]+" com valor = " +  data_node[id[i + 1]][0] + " e tipo: " +  data_node[id[i + 1]][1];
                        break;
                    }
                }
        }
    }
}

function lookupdata(){
    var sum = document.getElementById('to_lookup').value;
    if(sum.length>0){
        
        var edges = [];
        if(nodecount>1){
            for (var i = 0; i < nodecount; i++) {
                if (i === (nodecount - 1)) {
                    edges.push({
                        id: String(id[nodecount-1])+String(id[0]),
                        from: id[nodecount - 1],
                        to: id[0],
                        
                    });
                } else {
                    edges.push({
                        id: String(id[i])+String(id[i+1]),
                        from: id[i],
                        to: id[i + 1],
                        
                    });
                }
            }
        }
        var check = 0;
        if (data_node[id[0]][0] != undefined){
            console.log("entrei1")
                    document.getElementById('output').innerHTML = "key = "+sum+" valor encontrado no node = "+ id[0]+" com valor = " + data_node[id[0]][0] + " e tipo: " +  data_node[id[0]][1];
                    check = 1;
                    
        }
        if(check==0){
            for (var i = 0; i < nodecount-1; i++){
                edges[i].color = "red";
                edges[i].arrows = "to";
                draw1(nodes,edges,options);
                if(id[i]<sum && id[i+1]>=sum ){

                    if (data_node[id[i+1]][0] != undefined){
                        console.log("entrei2")
                        document.getElementById('output').innerHTML = "key = "+sum+" valor encontrado no node = "+ id[i+1]+" com valor = " +  data_node[id[i + 1]][0] + " e tipo: " +  data_node[id[i + 1]][1];
                        check = 1;
                        break;
                    }else{
                        
                        check = 1;
                        break;
                    }

                }            
            }
        }
        if (check==0 && sum <= id[nodecount-1] ){
            if (data_node[id[nodecount-1]][0] != undefined){
                console.log("entrei3")
                    document.getElementById('output').innerHTML = "key = "+sum+" valor encontrado no node = "+ id[nodecount-1]+" com valor = " + data_node[id[nodecount-1]][0] + " e tipo: " + data_node[id[nodecount-1]][1];
                    check=1;
                    }else{
//                    edges[nodecount-1].color = "red";
//                    edges[nodecount-1].arrows = "to";
                   
                    
                }
        }
        if(check==0){
            window.alert("Data does not exist for this key");
        }
    
     
          
    }else{
        window.alert("you have not entered anything");
    }
    
}


function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}




function binarySearch(data, val){
    var highIndex = data.length -1;
    var lowIndex = 0;
    var index = 0;
    var sub = 0;
    while (highIndex > lowIndex){
            index = parseInt((highIndex + lowIndex) / 2);
            sub = data[index];
            if (data[lowIndex] == val)
                    return [lowIndex, lowIndex];
            else if (sub == val)
                    return [index, index];
            else if (data[highIndex] == val)
                    return [highIndex, highIndex];
            else if (sub > val){
                    if (highIndex == index){
                            return [highIndex, lowIndex].sort(function(a,b) { return  a-b; });
                        }
                    highIndex = index;
                }
            else{
                    if (lowIndex == index)
                            return [highIndex, lowIndex].sort(function(a,b) { return  a-b; });
                    lowIndex = index;
                }
    }
    return [highIndex, lowIndex].sort(function(a,b) { return  a-b; });
}


function sleep(miliseconds) {
   var currentTime = new Date().getTime();

   while (currentTime + miliseconds >= new Date().getTime()) {
   }
}

