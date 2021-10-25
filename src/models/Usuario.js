const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es requerido']
    },
    correo: {
        type: String,
        trim: true,
        required: [true, 'El correo es requerido'],
        unique: true
    },
    clave: {
        type: String,
        trim: true,
        required: [true, 'La clave es requerida']
    },
},{
    timestamps: true
})

usuarioSchema.methods.toJSON = function(){
    var obj = this.toObject();
    // delete obj.empresa;
    delete obj.__v;
    return obj;
}

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'})


module.exports = mongoose.model('usuarios', usuarioSchema);