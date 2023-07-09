<template>
    <dialog id="dialog" class="absolute auto" style="pointer-events: auto;">
        <slot></slot>
        <button onclick="window.dialog.close();" aria-label="close" class="x">
          ❌
        </button>
      </dialog>
</template>
<style lang="scss" src="~/assets/css/interactive/checkbox.scss" scoped></style>

<script>

export default{
    el: '#dialog'
}
</script>