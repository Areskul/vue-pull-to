<!-- template for the component -->
<template>
  <div :color="color" ref="wrap" @scroll="scrollEvent">
    <div ref="pullDownEl"></div>
    <slot/>
    <div ref="pullUpEl"></div>
  </div>
</template>
<script>
const pullDownCls = "pullDown";
const pullDownLabelCls = "pullDownLabel";
const pullUpCls = "pullUp";
const pullUpLabelCls = "pullUpLabel";
const lableUp = {
  initial: "initial",
  suspend: "suspend",
  loading: "loading",
  complete: "complete",
};
const lableDown = {
  initial: "initial",
  suspend: "suspend",
  loading: "loading",
  complete: "complete",
};
export default {
  name: "v-pull-to",
  props: ["down", "up", "pullupOffset", "pulldownOffset", "addNew", "addMore", "hasMore", "color"],
  data: () => ({
    pullDownState: lableDown.initial,
    pullUpState: lableUp.initial,
    pullDownCls,
    pullDownLabelCls,
    pullUpCls,
    pullUpLabelCls,
  }),
  computed: {},
  methods: {
    scrollEvent(e) {
      this.$emit("scroll", e);
    },
    touchStart(ev) {
      const self = this;
      const touch = ev.touches[0];
      const { scrollObj } = self;
      self.pullFlag = 0;
      if (self.down) {
        this.pullDownEl.style.webkitTransitionDuration = "0s";
        this.pullDownCls = pullDownCls;
        this.pullDownState = lableDown.initial;
      }
      if (self.up && this.pullUpEl) {
        this.pullUpEl.style.webkitTransitionDuration = "0s";
      }
      self.startY = touch.screenY;
      self.startPageY = scrollObj.scrollTop;
      self.maxY = scrollObj.scrollHeight - scrollObj.clientHeight;
    },
    touchMove(ev) {
      const self = this;
      const len = this.pulldownOffset || 80;
      const offsetDefault = this.pullupOffset || 20;
      let offsetY;
      let touch;
      touch = ev.touches[0];
      offsetY = (touch.screenY - self.startY) / 2;
      // console.log("pull", self.down, offsetY, len);

      // PullDown
      if (self.down && self.startPageY == 0 && offsetY > 0 && document.body.scrollTop == 0) {
        window.onscroll = function () {
          ev.preventDefault();
        };
        if (Math.abs(offsetY) > len) {
          offsetY = len;
          self.pullDownState = lableDown.suspend;
          self.pullFlag = 1;
        }
        self.pullDownEl.style.height = `${offsetY}px`;
      }
      // PullUp
      else if (
        self.up &&
        self.startPageY >= self.maxY - offsetDefault &&
        offsetY < 0
        // window.innerHeight + window.scrollY >= document.body.offsetHeight
      ) {
        window.onscroll = function () {
          ev.preventDefault();
        };
        if (Math.abs(offsetY) > len) {
          offsetY = len;
          self.pullUpState = lableUp.suspend;
          self.pullFlag = 2;
        }
        self.pullUpEl.style.height = `${offsetY}px`;
      }
    },
    touchEnd() {
      const self = this;
      if (self.down && self.pullFlag == 1) {
        console.log("loadData");
        self.pullDownState = lableDown.loading;
        self.pullDownEl.style.webkitTransitionDuration = "0.4s";
        self.pullDownEl.style.height = 0;
        self.pullDownState = lableDown.complete;
      } else if (self.up && self.pullFlag == 2) {
        console.log("loadData");
        self.pullUpState = lableUp.loading;
        self.pullUpEl.style.webkitTransitionDuration = "0.4s";
        self.pullUpEl.style.height = 0;
        self.pullUpState = lableUp.complete;
      }
    },
  },
  mounted() {
    this.scrollObj = this.$refs.wrap;
    this.pullDownEl = this.$refs.pullDownEl;
    this.pullUpEl = this.$refs.pullUpEl;
    this.scrollObj.addEventListener("touchstart", this.touchStart.bind(this));
    this.scrollObj.addEventListener("touchmove", this.touchMove.bind(this));
    this.scrollObj.addEventListener("touchend", this.touchEnd.bind(this));
    // this.scrollObj.addEventListener("mousedown", this.touchStart.bind(this));
    // this.scrollObj.addEventListener("mousemove", this.touchMove.bind(this));
    // this.scrollObj.addEventListener("mouseup", this.touchEnd.bind(this));
  },
};
</script>
<style scoped></style>
