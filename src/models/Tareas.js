const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let Schema = mongoose.Schema

const tareaSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es requerido']
    },
    estado: {
        type: Boolean,
        required: true
    },
    proyecto: {
        type: Schema.ObjectId, 
        ref: 'proyectos',
    },
},{
    timestamps: true
})

tareaSchema.methods.toJSON = function(){
    var obj = this.toObject();
    // delete obj.empresa;
    delete obj.__v;
    return obj;
}

tareaSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'})


module.exports = mongoose.model('tareas', tareaSchema);