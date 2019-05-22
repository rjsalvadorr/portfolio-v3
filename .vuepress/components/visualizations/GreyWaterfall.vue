<template>
  <div class="grey-waterfall">
    <table class="grey-waterfall-table">
      <tr v-for="row in gridLength" :class="`waterfall-row row-${row}`">
        <td v-for="column in gridWidth" :class="`waterfall-col row-${row}-col-${column}`">
          <div class="inner"></div>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import sample from "lodash/sample";
import chroma from 'chroma-js';
import GridQueue from '../../utils/grid-queue';
import utils from '../../utils/three-utils';

export default {
  name: 'GreyWaterfall',
  props: {
    lightestCol: String,
    darkestCol: String,
  },
  data: function () {
    return {
      gridLength: 13,
      gridWidth: 13,
      intervalId: null,
    }
  },
  mounted() {
    const colorScale = chroma.scale([this.darkestCol, this.lightestCol]);
    const scaleVals = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const modValues = scaleVals.map(x => {
      return colorScale(x).hex();
    });
    const updatesPerSecond = 9;

    const gridQueue = new GridQueue(this.gridWidth, this.gridLength, modValues);
    const data = {
      width: this.gridWidth,
      length: this. gridLength,
    }

    const updateGrid = () => {
      for(let k = 1; k <= data.width; k++) {
        for(let j = 1; j <= data.length; j++) {
          const selector = `row-${k}-col-${j}`
          const element = document.getElementsByClassName(selector)[0];
          const newCol = chroma(gridQueue.toArray()[k - 1][j - 1]);
          const hueAdj = utils.periodicFunction(
            new Date().getTime() / 1000,
            4,
            newCol.get('hsl.h') - 15,
            newCol.get('hsl.h') + 15,
          );
          element.style.backgroundColor = newCol.set('hsl.h', hueAdj);
        }
      }
    }

    updateGrid();
    this.intervalId = window.setInterval(() => {
      gridQueue.update();
      updateGrid();
    }, 1000 / updatesPerSecond);
  },
  beforeDestroy() {
    window.clearInterval(this.intervalId);
  }
}
</script>

<style scoped lang="scss">
  @import "../../styles/vars.scss";
  $table-gutter: 10px;
  $waterfall-unit-w: 100vw / 13;
  $waterfall-unit-h: 100vh / 13;

  .grey-waterfall {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #222;
  }

  .grey-waterfall-table {
    border-collapse: collapse;
  }

  .grey-waterfall-table td {
    height: $waterfall-unit-w;
    width: $waterfall-unit-w;
    background-color: #222;
  }

  @media (orientation: portrait) {
    .grey-waterfall-table {
      width: 100vh;

      td {
        height: $waterfall-unit-h;
        width: $waterfall-unit-h;
      }
    }
  }

  @media (orientation: landscape) {
    .grey-waterfall-table {
      width: 100vw;

      td {
        height: $waterfall-unit-w;
        width: $waterfall-unit-w;
      }
    }
  }
</style>
