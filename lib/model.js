module.exports.Category = function(body){
    this.name = 'name' in body ? body.name : 'undefined';
}
module.exports.Product = function(body){
    this.name = 'name' in body ? body.name : 'undefined';
    this.price = 'price' in body ? body.price : 'undefined';
    this.category = 'category' in body ? body.category : 'undefined';
}