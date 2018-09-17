module.exports.checkId = function(_id){
    var id = _id.split(/[^0-9a-zA-Z]/);
    if(id.length > 1 || id[0].length != 24){
        return false;
    }
    else{
        return true;
    }
};
