<template>
	<div class="info-box">
  	<!-- Apply any bg-* class to to the icon to color it -->
    <span class="info-box-icon" :class="cssClass"><i :class="iconClass"></i></span>
    <div class="info-box-content">
      <span class="info-box-text">{{perf}}</span>
      <span class="info-box-number">{{value}}</span>
      <div class="progress">
        <div class="progress-bar" style="width:100%;background-color: #d1d1d1;"></div>
      </div>
      <span class="progress-description" v-html="firstMsg"></span>
      <span class="progress-description" v-html="secondMsg"></span>
    </div>
    <!-- /.info-box-content -->
  </div>
  <!-- /.info-box -->
</template>

<script>
export default {
  name: 'infoBox',
  props: {
    cssClass: {
      type: String,
      required: true
    },
    iconClass: {
      type: String,
      required: true
    },
    value: {
      type: String
    },
    perf: {
      type: String,
      required: true
    },
    firstMsg: {
      type: String
    },
    secondMsg: {
      type: String
    }
  }
}
</script>

<style scoped>
.bg-aqua {
    background-color: #00c0ef !important;
    opacity: .65
}

.info-box {
    display: block;
    min-height: 90px;
    background: #fff;
    width: 100%;
    box-shadow: 0 1px 1px rgba(0,0,0,0.1);
    border-radius: 2px;
    margin-bottom: 15px;
    border: 1px solid #dfe6ec;
}

.info-box small {
    font-size: 14px
}

.info-box .progress {
    background: rgba(0,0,0,0.2);
    margin: 5px -10px 5px -10px;
    height: 2px
}

.info-box .progress,.info-box .progress .progress-bar {
    border-radius: 0
}

.info-box .progress .progress-bar {
    background: #fff
}

.info-box-icon {
    border-top-left-radius: 2px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 2px;
    display: block;
    float: left;
    height: 90px;
    width: 90px;
    text-align: center;
    font-size: 45px;
    line-height: 90px;
    background: rgba(0,0,0,0.2)
}

.info-box-icon>img {
    max-width: 100%
}

.info-box-content {
    padding: 5px 10px;
    margin-left: 90px
}

.info-box-number {
    display: block;
    font-weight: bold;
    font-size: 18px
}

.progress-description,.info-box-text {
    display: block;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
}

.info-box-text {
    text-transform: uppercase
}

.info-box-more {
    display: block
}
</style>
