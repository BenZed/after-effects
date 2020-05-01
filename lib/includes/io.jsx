if (typeof io != 'object') {

    $.global.io  = (function(){


            return { 

                convertPath : function(path) {

                    var regexStart = new RegExp(/^([C-Z]):/m);
                    var newPath = path.replace(regexStart, function (match, _1) {
                        return "/" + _1;
                     });
                    return new File(path)
    
                }   
                

            }
              

            
        })()


}