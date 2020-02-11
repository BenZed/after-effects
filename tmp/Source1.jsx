
(function(){
    
        function getLayer(compName , layername){ 
                var comp = null 
                 for(var i =  1 ; i != app.project.items.length + 1   ;  i++){ 
                     
                            var  item = app.project.item(i)
                            var name =  item.name 
                            var is = (name == compName)
                             if(item.name == compName) { 
                                  comp = item 
                                        break 
                                 }
                     }
                    
                    if(comp != null){ 
                        
                        for(var i =  1 ; i != comp.layers.length + 1   ;  i++){ 
                                    var layer = comp.layer(i)  
                                    if(layer.name == layername){
                                            return layer 
                                        }
                               }
                        }
                    
                    
            }
    
var itemRef = app.project.items.reflect
    var methods = itemRef.methods 
    var name = itemRef.name 
    var properties = itemRef.properties 
    var description = itemRef.description 
    var help = itemRef.help 
    
    for(var i in itemRef){
            $.println(i) 
        }
    
    var layer1  = getLayer ("Comp 1", "testlayer")
     var methods = layer1.reflect.methods  
     
     var props = layer1.reflect.properties
     $.writeln(layer1.reflect.toXML())
var a=1
        
    })()

