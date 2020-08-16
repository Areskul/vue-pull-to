<!-- template for the component -->
<template>
  <div :color="color" ref="wrap" @scroll="scrollEvent">
    <div ref="pullDownEl"></div>
    <slot />
    <div ref="pullUpEl"></div>
  </div>
</template>
<script src="./pull-to.ts"></script>

