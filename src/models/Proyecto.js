const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema

const proyectoSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es requerido']
    },
    creador: {
        type: Schema.ObjectId, 
        ref: 'usuarios',
    }
},{
    timestamps: true
})

proyectoSchema.methods.toJSON = function(){
    var obj = this.toObject();
    // delete obj.empresa;
    delete obj.__v;
    return obj;
}

proyectoSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'})


module.exports = mongoose.model('proyectos', proyectoSchema);