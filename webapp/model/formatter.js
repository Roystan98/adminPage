sap.ui.define([
    
], function() {
    'use strict';
    return {
      dateFormatter: function(s){
          if(s!==""){
              var out = [
                new Date(s).getFullYear().toString(),
                new Date(s).getMonth().toString(),
                new Date(s).getDate().toString(),
                "00",
                "00",
              ];
              return new Date(out[0], out[1], out[2], out[3], out[4]);
          }
      }
    };
});