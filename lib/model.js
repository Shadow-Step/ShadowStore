const bcrypt = require('bcryptjs');

module.exports.Category = function(body){
    this.name = 'name' in body ? body.name : 'undefined';
}
module.exports.Product = function(body){
    this.name = 'name' in body ? body.name : 'undefined';
    this.price = 'price' in body ? body.price : 'undefined';
    this.category = 'category' in body ? body.category : 'undefined';
}
module.exports.SafeProfile = function(profile){
    this.email = profile.email;
}
module.exports.Profile = function(body){
    this.email = body.email;
    this.password = bcrypt.hashSync(body.password,10);
}