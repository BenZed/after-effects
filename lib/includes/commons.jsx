if (typeof commons  != 'object') {

    $.global.commons =   { 

                convertPath : function(path) {

                    var regexStart = new RegExp(/^([C-Z]):/m);
                    var newPath = path.replace(regexStart, function (match, _1) {
                        return "/" + _1;
                     });
                    return new File(path)
    
                }   , 
                toArray : function (items) {

                    if(! items.hasOwnProperty("count") || items.hasOwnProperty("numProperties") || items.hasOwnProperty("length")){
                        return [items] 
                    
                    }
                    if(items.hasOwnProperty("count")){
                        // should be Query 
                        return items.toArray() 
                    }
                  
                    var array = [];
                    
                    var length = items.hasOwnProperty("numProperties") ? items.numProperties : items.length;
                    for (var i = 1; i != length + 1; i++) {
                         
                        
                        array.push(items[i].name);

                } 
                

            } , 
            hasOwnProperty : function  (obj , key) {

                return obj.hasOwnProperty(key)
            }
              

            
        }


}