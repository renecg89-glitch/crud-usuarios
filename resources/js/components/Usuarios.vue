<template>
<div>

<h2>CRUD Usuarios</h2>

<div>
<input type="text" v-model="nombre" placeholder="Nombre">
<input type="email" v-model="email" placeholder="Email">

<button v-if="!editando" @click="guardar">Guardar</button>
<button v-if="editando" @click="actualizar">Actualizar</button>
<button v-if="editando" @click="cancelar">Cancelar</button>
</div>

<br>

<table border="1">
<thead>
<tr>
<th>ID</th>
<th>Nombre</th>
<th>Email</th>
<th>Acciones</th>
</tr>
</thead>

<tbody>
<tr v-for="usuario in usuarios" :key="usuario.id">
<td>{{ usuario.id }}</td>
<td>{{ usuario.nombre }}</td>
<td>{{ usuario.email }}</td>
<td>

<button @click="editar(usuario)">Editar</button>

<button @click="eliminar(usuario.id)">
Eliminar
</button>

</td>
</tr>
</tbody>
</table>

</div>
</template>

<script>

import axios from 'axios'
import Swal from 'sweetalert2'

export default {

data(){

return{

usuarios:[],
nombre:'',
email:'',
id:null,
editando:false

}

},

mounted(){

this.cargar()

},

methods:{

cargar(){

axios.get('/api/usuarios')
.then(response=>{

this.usuarios=response.data

})

},

guardar(){

axios.post('/api/usuarios',{
nombre:this.nombre,
email:this.email
})
.then(()=>{

this.nombre=''
this.email=''

this.cargar()

Swal.fire({
icon:'success',
title:'Usuario guardado',
text:'Registro creado correctamente'
})

})

},

editar(usuario){

this.id=usuario.id
this.nombre=usuario.nombre
this.email=usuario.email

this.editando=true

},

actualizar(){

axios.put('/api/usuarios/'+this.id,{
nombre:this.nombre,
email:this.email
})
.then(()=>{

this.nombre=''
this.email=''
this.id=null
this.editando=false

this.cargar()

Swal.fire({
icon:'success',
title:'Usuario actualizado'
})

})

},

eliminar(id){

Swal.fire({
title:'¿Eliminar usuario?',
text:'No podrás revertir esto',
icon:'warning',
showCancelButton:true,
confirmButtonText:'Sí eliminar',
cancelButtonText:'Cancelar'
}).then((result)=>{

if(result.isConfirmed){

axios.delete('/api/usuarios/'+id)
.then(()=>{

this.cargar()

Swal.fire(
'Eliminado',
'Usuario eliminado correctamente',
'success'
)

})

}

})

},

cancelar(){

this.nombre=''
this.email=''
this.id=null
this.editando=false

}

}

}

</script>

<style>

table{
border-collapse: collapse;
width: 500px;
}

th,td{
padding:8px;
text-align:left;
}

button{
margin-right:5px;
}

</style>
