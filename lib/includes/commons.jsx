
 
if (typeof commons  != 'object') {

    $.global.commons = (function (){
        function checkReflectionInfo(array,key){

            var size = array.length
            for(var i = 0 ; i <  array.length ; i++){
                if(array[i].name == key){
                    return true 
                }
            }
            return false 
        }
    
        function hasProperty(ref  , key) {
    
            var  props =  ref.properties 
           return  checkReflectionInfo(props,key)
        
    
        } 
        function hasMethod(ref ,key) {
            var  methods =  ref.methods 
            return checkReflectionInfo(methods,key)
        }
        return  { 

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
            

        }  , 
        has:function (obj,key){
            if  ( hasProperty(obj.reflect,key)  ){
                    return true 
            }
            else if (hasMethod(obj.reflect,key)){
                return true 
            } 

            return false 
        } ,
        reflect(obj) {
            return obj.reflect 
        }
          

    }
    
})() 

     


}

 