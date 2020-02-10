
(function(){
    
        function getLayer(compName , layername){ 
                var comp = null 
                 for(var i in app.project.items){ 
                     
                            var  item = app.project.items[i]
                             if(item.name = compName) { 
                                  comp = item 
                                        break 
                                 }
                     }
                    
                    if(comp != null){ 
                        
                           for( var i in comp.layers){
                                    var layer = comp.layers[i]  
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
    
    var layer1  = getLayer ("Comp1", "testlayer")
     var description= itemRef.description 
var a=1
        
    })()

