<!-- template for the component -->
<template>
  <div :color="color" ref="wrap" @scroll="scrollEvent">
    <div ref="topEl"></div>
    <slot />
    <div ref="bottomEl"></div>
  </div>
</template>
<script src="./pull-to.js"></script>

