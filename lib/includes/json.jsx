 

 

(function (global){

    var layerToJson = function (layer    ){
        var jsonObject = {}
        propsToJson(layer, function (key,value){

            jsonObject[key] = value 
        })
        return jsonObject 
        //layerProperties = layer.reflection.properties 

    }
    var methodsToJson = function (object , callback ) {


        var methods = object.reflects.methods 
        for(var i =0 ; i != methods.length ; i++){
            var method = methods[i]
            callback(object,method) 
        }
    }
    var propsToJson=  function (  object , fnEach ) {
        var properties = object.reflect.properties  
        
     
        for( var i = 0 ; i != properties.length ; i++){

            var propertyKey  = properties[i]

            fnEach.call(propertyKey , object[property]) 
            
            
        }        
         
        return jsonObject

    }

     
    global.comp_to_json = function (  compItem){


        var jsonObject = {}
        propsToJson (object,function(key,value){

            if(key == "layers"){

                jsonObject.layers = []
                if(key == "layers"){ 
                    for(var j = 1 ; j != compItem.layers.length+1  ; j++){
                     var    layer = layerToJson(comp)
                            jsonObject.push(layer)
                    }
                   
                }
               
            }else {
                jsonObject[key] = value 
            }
                     


        }) 
      
        return jsonObject
    }   


})($.global)