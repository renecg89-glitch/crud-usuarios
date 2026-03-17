<template>
  <div class="container mt-4">
    <h2>CRUD Usuarios</h2>

    <!-- Botón Agregar -->
    <button class="btn btn-success btn-sm mb-3" @click="abrirModalAgregar">
      <i class="bi bi-plus-lg"></i> Agregar Usuario
    </button>

    <!-- Botón Exportar Excel -->
    <button class="btn btn-success btn-sm mb-3 ms-2" @click="exportarExcel">
      <i class="bi bi-file-earmark-excel"></i> Exportar Excel
    </button>

    <!-- Tabla Ag-Grid -->
    <div class="ag-theme-alpine" style="height:400px; width:100%">
      <AgGridVue
        :rowData="usuarios"
        :columnDefs="columnDefs"
        :defaultColDef="defaultColDef"
        :pagination="true"
        :paginationPageSize="10"
        :paginationPageSizeSelector="[10,20,50,100]"
        :context="{ componentParent: this }"
        domLayout="autoHeight"
        @grid-ready="onGridReady"
      />
    </div>

    <!-- Modal -->
    <div class="modal fade" id="usuarioModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editando ? 'Editar Usuario' : 'Agregar Usuario' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input v-model="nombre" class="form-control" placeholder="Nombre">
            </div>
            <div class="mb-3">
              <label class="form-label">Email</label>
              <input v-model="email" class="form-control" placeholder="Email">
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="cancelar"
            ><i class="bi bi-x-lg"></i> Cancelar</button>

            <button
              type="button"
              class="btn btn-primary"
              v-if="!editando"
              @click="guardar"
              data-bs-dismiss="modal"
            ><i class="bi bi-save"></i> Guardar</button>

            <button
              type="button"
              class="btn btn-primary"
              v-if="editando"
              @click="actualizar"
              data-bs-dismiss="modal"
            ><i class="bi bi-arrow-repeat"></i> Actualizar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import * as bootstrap from 'bootstrap';
import axios from 'axios'
import Swal from 'sweetalert2'
import { AgGridVue } from 'ag-grid-vue3'
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community'
import 'ag-grid-community/styles/ag-theme-alpine.css'
import BotonesUsuarios from './BotonesUsuarios.vue'

ModuleRegistry.registerModules([AllCommunityModule])

export default {
  components: { AgGridVue, BotonesUsuarios },

  data() {
    return {
      usuarios: [],
      nombre: '',
      email: '',
      id: null,
      editando: false,
      gridApi: null,

      columnDefs: [
        {
          headerName: '#',
          width: 90,
        //   valueGetter: params => {
        //     const rowIndex = params.node.rowIndex; // índice relativo a la página
        //     const pageSize = params.api.paginationGetPageSize() || 5; // tamaño actual de página
        //     const currentPage = params.api.paginationGetCurrentPage() || 0; // página actual
        //     // calculamos número absoluto
        //     return rowIndex + 1 + currentPage * pageSize;
        // }
            valueGetter: params => params.api.getDisplayedRowAtIndex(params.node.rowIndex).rowIndex + 1
        },
        { field: 'nombre', headerName: 'Nombre', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 1 },
        {
          headerName: 'Acciones',
          cellRenderer: 'BotonesUsuarios',
          suppressCellSelection: true
        }
      ],

      defaultColDef: {
        sortable: true,
        filter: true,
        resizable: true
      }
    }
  },

  mounted() {
    this.cargar()
  },

  methods: {
    // Inicialización del grid
    onGridReady(params) {
      this.gridApi = params.api
    },

    // Abrir modal para agregar
    abrirModalAgregar() {
        this.editando = false
        this.nombre = ''
        this.email = ''
        const modalEl = document.getElementById('usuarioModal')
        const modal = new bootstrap.Modal(modalEl, {
            backdrop: 'static', // no cerrar al click fuera
            keyboard: false     // no cerrar con Esc
        })
        modal.show()
    },

    // Abrir modal para editar y cargar datos
    editar(usuario) {
        this.id = usuario.id
        this.nombre = usuario.nombre
        this.email = usuario.email
        this.editando = true
        const modalEl = document.getElementById('usuarioModal')
        const modal = new bootstrap.Modal(modalEl, {
            backdrop: 'static', // no cerrar al click fuera
            keyboard: false     // no cerrar con Esc
        })
        modal.show()
    },

    // Exportar Excel sin columna Acciones
    exportarExcel() {
      if (this.gridApi) {
        this.gridApi.exportDataAsCsv({
          fileName: 'usuarios.csv',
          processCellCallback: params => {
            if (params.column.getColDef().headerName === 'Acciones') return ''
            return params.value
          }
        })
      }
    },

    // CRUD
    cargar() {
      axios.get('/api/usuarios').then(response => {
        this.usuarios = response.data
      })
    },

    guardar() {
      axios
        .post('/api/usuarios', { nombre: this.nombre, email: this.email })
        .then(() => {
          this.nombre = ''
          this.email = ''
          this.cargar()
          Swal.fire({
            icon: 'success',
            title: 'Usuario guardado',
            text: 'Registro creado correctamente'
          })
        })
    },

    actualizar() {
      axios
        .put('/api/usuarios/' + this.id, { nombre: this.nombre, email: this.email })
        .then(() => {
          this.nombre = ''
          this.email = ''
          this.id = null
          this.editando = false
          this.cargar()
          Swal.fire({ icon: 'success', title: 'Usuario actualizado' })
        })
    },

    eliminar(id) {
      Swal.fire({
        title: '¿Eliminar usuario?',
        text: 'No podrás revertir esto',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí eliminar',
        cancelButtonText: 'Cancelar'
      }).then(result => {
        if (result.isConfirmed) {
          axios.delete('/api/usuarios/' + id).then(() => {
            this.cargar()
            Swal.fire('Eliminado', 'Usuario eliminado correctamente', 'success')
          })
        }
      })
    },

    cancelar() {
      this.nombre = ''
      this.email = ''
      this.id = null
      this.editando = false
    }
  }
}
</script>
