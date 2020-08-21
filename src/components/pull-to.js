export default {
  name: "v-pull-to",
  props: {
    top: Boolean,
    bottom: Boolean,
    offset: String,
    color: String
  },
  data: () => ({
    topState: "initial",
    bottomState: "initial"
  }),
  computed: {},
  methods: {
    // grow: function(self) {},
    ungrow: function(el, state) {
      console.log("loadData");
      state = "loading";
      el.style.webkitTransitionDuration = "0.4s";
      el.style.height = 0;
      state = "complete";
      console.log(state);
    },
    scrollEvent(e) {
      this.$emit("scroll", e);
    },
    touchStart(ev) {
      const self = this;
      const touch = ev.touches[0];
      const { scrollObj } = self;
      self.pullFlag = 0;
      if (self.top) {
        this.topEl.style.webkitTransitionDuration = "0s";
        this.topState = "initial";
      }
      if (self.bottom && this.bottom) {
        this.bottomEl.style.webkitTransitionDuration = "0s";
      }
      self.startY = touch.screenY;
      self.startPageY = scrollObj.scrollTop;
      self.maxY = scrollObj.scrollHeight - scrollObj.clientHeight;
    },
    touchMove(ev) {
      const self = this;
      const len = this.offset || 80;
      const offsetDefault = this.offset || 20;
      let offsetY;
      let touch;
      touch = ev.touches[0];
      offsetY = (touch.screenY - self.startY) / 2;
      // console.log("pull", self.down, offsetY, len);

      // PullDown
      if (self.top && self.startPageY == 0 && offsetY > 0 && document.body.scrollTop == 0) {
        window.onscroll = function() {
          ev.preventDefault();
        };
        if (Math.abs(offsetY) > len) {
          offsetY = len;
          self.topState = "suspend";
          self.pullFlag = 1;
        }
        self.topEl.style.height = `${offsetY}px`;
      }
      // PullUp
      else if (
        self.bottom &&
        self.startPageY >= self.maxY - offsetDefault &&
        offsetY < 0
        // window.innerHeight + window.scrollY >= document.body.offsetHeight
      ) {
        window.onscroll = function() {
          ev.preventDefault();
        };
        if (Math.abs(offsetY) > len) {
          offsetY = len;
          self.bottomState = "suspend";
          self.pullFlag = 2;
        }
        self.bottomEl.style.height = `${offsetY}px`;
      }
    },
    touchEnd() {
      const self = this;
      if (self.top && self.pullFlag == 1) {
        console.log("loadData");
        self.topState = "loading";
        self.topEl.style.webkitTransitionDuration = "0.4s";
        self.topEl.style.height = 0;
        self.pullDownState = "complete";
      } else if (self.bottom && self.pullFlag == 2) {
        console.log("loadData");
        self.bottomState = "loading";
        self.bottomEl.style.webkitTransitionDuration = "0.4s";
        self.bottomEl.style.height = 0;
        self.bottomState = "complete";
      }
    }
  },
  mounted() {
    this.scrollObj = this.$refs.wrap;
    this.topEl = this.$refs.topEl;
    this.bottomEl = this.$refs.bottomEl;
    this.scrollObj.addEventListener("touchstart", this.touchStart.bind(this));
    this.scrollObj.addEventListener("touchmove", this.touchMove.bind(this));
    this.scrollObj.addEventListener("touchend", this.touchEnd.bind(this));
  }
};
