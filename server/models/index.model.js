import Log from './log.model.js';
import Usuario from './usuario.model.js';
import Rol from './rol.model.js';
import Departamento from './departamento.model.js';
import Localidad from './localidad.model.js';
import Ubicacion from './ubicacion.model.js';
import Comisaria from './comisaria.model.js';
import UnidadRegional from './unidadRegional.model.js';
import TipoDelito from './tipoDelito.model.js';
import Submodalidad from './submodalidad.model.js';
import Modalidad from './modalidad.model.js';
import TipoArma from './tipoArma.model.js';
import Autor from './autor.model.js';
import Movilidad from './movilidad.model.js';
import Especializacion from './especializacion.model.js';
import Denuncia from './denuncia.model.js'

//Un rol puede tener muchos usuarios
Rol.hasMany(Usuario, {
    foreignKey: 'rolId',
    sourceKey: 'idRol'
});
Usuario.belongsTo(Rol, {
    foreignKey: 'rolId',
    targetKey: 'idRol'
});

//Un usuario puede tener muchos logs
Usuario.hasMany(Log, {
    foreignKey: 'dniId',
    sourceKey: 'dni'
});
Log.belongsTo(Usuario, {
    foreignKey: 'dniId',
    targetKey: 'dni'
});

//Un departamento puede tener muchas localidades
Departamento.hasMany(Localidad, {
    foreignKey: 'departamentoId',
    sourceKey: 'idDepartamento'
})
Localidad.belongsTo(Departamento, {
    foreignKey: 'departamentoId',
    targetKey: 'idDepartamento'
})

//Una comisaria puede tener una ubicacion
Ubicacion.hasOne(Comisaria, {
    foreignKey: 'ubicacionId',
    sourceKey: 'idUbicacion'
});
Comisaria.belongsTo(Ubicacion, {
    foreignKey: 'ubicacionId',
    targetKey: 'idUbicacion'
});

//Una localidad puede tener muchas ubicaciones
Localidad.hasMany(Ubicacion, {
    foreignKey: 'localidadId',
    sourceKey: 'idLocalidad'
})
Ubicacion.belongsTo(Localidad, {
    foreignKey: 'localidadId',
    targetKey: 'idLocalidad'
})

//Una unidad regional puede tener muchas comisarias
UnidadRegional.hasMany(Comisaria, {
    foreignKey: 'unidadRegionalId',
    sourceKey: 'idUnidadRegional'
})
Comisaria.belongsTo(UnidadRegional, {
    foreignKey: 'unidadRegionalId',
    targetKey: 'idUnidadRegional'
})

//Una unidad regional puede tener una ubicacion
Ubicacion.hasOne(UnidadRegional, {
    foreignKey: 'ubicacionId',
    sourceKey: 'idUbicacion'
});
UnidadRegional.belongsTo(Ubicacion, {
    foreignKey: 'ubicacionId',
    targetKey: 'idUbicacion'
});

//Una modalidad puede tener muchas submodalidades
Modalidad.hasMany(Submodalidad, {
    foreignKey: 'modalidadId',
    sourceKey: 'idModalidad'
})
Submodalidad.belongsTo(Modalidad, {
    foreignKey: 'modalidadId',
    targetKey: 'idModalidad'
})

//Una comisaria puede tener muchas denuncias
Comisaria.hasMany(Denuncia, {
    foreignKey: 'comisariaId',
    sourceKey: 'idComisaria'
})
Denuncia.belongsTo(Comisaria, {
    foreignKey: 'comisariaId',
    targetKey: 'idComisaria'
})

//Una ubicacion puede tener muchas denuncias
Ubicacion.hasMany(Denuncia, {
    foreignKey: 'ubicacionId',
    sourceKey: 'idUbicacion'
})
Denuncia.belongsTo(Ubicacion, {
    foreignKey: 'ubicacionId',
    targetKey: 'idUbicacion'
})

//Una submodalidad puede tener muchas denuncias
Submodalidad.hasMany(Denuncia, {
    foreignKey: 'submodalidadId',
    sourceKey: 'idSubmodalidad'
})
Denuncia.belongsTo(Submodalidad, {
    foreignKey: 'submodalidadId',
    targetKey: 'idSubmodalidad'
})

//Un tipo de arma puede tener muchas denuncias
TipoArma.hasMany(Denuncia, {
    foreignKey: 'tipoArmaId',
    sourceKey: 'idTipoArma'
})
Denuncia.belongsTo(TipoArma, {
    foreignKey: 'tipoArmaId',
    targetKey: 'idTipoArma'
})

//Un autor puede tener muchas denuncias
Autor.hasMany(Denuncia, {
    foreignKey: 'autorId',
    sourceKey: 'idAutor'
})
Denuncia.belongsTo(Autor, {
    foreignKey: 'autorId',
    targetKey: 'idAutor'
})

//Una movilidad puede tener muchas denuncias
Movilidad.hasMany(Denuncia, {
    foreignKey: 'movilidadId',
    sourceKey: 'idMovilidad'
})
Denuncia.belongsTo(Movilidad, {
    foreignKey: 'movilidadId',
    targetKey: 'idMovilidad'
})

//Una especializacion puede tener muchas denuncias
Especializacion.hasMany(Denuncia, {
    foreignKey: 'especializacionId',
    sourceKey: 'idEspecializacion'
})
Denuncia.belongsTo(Especializacion, {
    foreignKey: 'especializacionId',
    targetKey: 'idEspecializacion'
})

TipoDelito.hasMany(Denuncia, {
    foreignKey: 'tipoDelitoId',
    sourceKey: 'idTipoDelito'
})
Denuncia.belongsTo(TipoDelito, {
    foreignKey: 'tipoDelitoId',
    targetKey: 'idTipoDelito'
})

TipoDelito.hasMany(Modalidad, {
    foreignKey: 'tipoDelitoId',
    sourceKey: 'idTipoDelito'
})
Modalidad.belongsTo(TipoDelito, {
    foreignKey: 'tipoDelitoId',
    targetKey: 'idTipoDelito'
})

export { Log, Usuario, Rol, Departamento, Localidad, Ubicacion, Comisaria, UnidadRegional, TipoDelito, Submodalidad, Modalidad, TipoArma, Autor, Movilidad, Especializacion, Denuncia };

