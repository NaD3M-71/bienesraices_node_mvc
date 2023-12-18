import Propiedad from "./Propiedad.js";
import Precio from "./Precio.js";
import Categoria from "./Categorias.js";
import Usuario from "./Usuario.js";
import Mensaje from "./Mensaje.js";

// Precio.hasOne(Propiedad); // hasOne se lee como de derecha a izq, en este caso la relacion es Propiedad tiene un Precio pero se lee como Precio corresponde a una Propiedad. belongsTo se lee mas natural pero en escencia es lo mismo

Propiedad.belongsTo(Precio, { foreignKey: "precioId" });
Propiedad.belongsTo(Categoria, { foreignKey: "categoriaId" });
Propiedad.belongsTo(Usuario, { foreignKey: "usuarioId" });
Propiedad.hasMany(Mensaje, {foreignKey: 'propiedadId'})

Mensaje.belongsTo(Propiedad,{ foreignKey:'propiedadId'})
Mensaje.belongsTo(Usuario,{ foreignKey:'usuarioId'})

export { Propiedad, Precio, Categoria, Usuario, Mensaje };
