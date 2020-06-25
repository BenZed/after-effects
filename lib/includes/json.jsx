const { isGetAccessor } = require("typescript")

 

(function (global){

    var propsToJson=  function (  object , fnEach ) {
        var properties = object.reflection.properties  
        
     
        for( var i = 0 ; i != properties.length ; i++){

            var propertyKey  = properties[i]

            fnEach.call(propertyKey , object[property]) 
            if(property == "layers"){
                layers = layersToJson(comp)
            }
            jsonObject[property] = property.toString()
        }        
         
        return jsonObject

    }

     
    global.comp_to_json = function (jsonObject , compItem){


    
        propsToJson (object,function(key,value){

            if(key == "layers"){

                jsonObject.layers = layerToJson(compItem.layers())

            }else {
                jsonObject[key] = value
            }


        }) 
      //  methodsToJson(jsonObject,object) 
        return jsonObject
    }   


})($.global)