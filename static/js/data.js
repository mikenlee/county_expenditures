//Declare variable
var fairfax_data;

var fairfax_url = 'http://127.0.0.1:5000/api/v1.0/fairfax'

//synchronous API call 
$.ajax({
    url: fairfax_url,
    async: false,
    dataType: 'json',
    success: function(data){
        fairfax_data = data;
    }
});

console.log(fairfax_data);
