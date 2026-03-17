<template>
  <div class="d-flex">
    <button class="btn btn-outline-warning btn-sm me-2 border-0" @click.stop="editar">
      <i class="bi bi-pencil fs-4"></i>
    </button>
    <button class="btn btn-outline-danger btn-sm border-0" @click.stop="eliminar">
      <i class="bi bi-trash fs-4"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: ['params'],
  methods: {
    editar() {
      this.params.context.componentParent.editar(this.params.data)
    },
    eliminar() {
      this.params.context.componentParent.eliminar(this.params.data.id)
    }
  }
}
</script>
