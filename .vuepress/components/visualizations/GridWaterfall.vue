<template>
  <div class="grid-waterfall">
    <table class="grid-waterfall-table">
      <tr v-for="row in getRowNumbers" :class="`waterfall-row row-${row}`">
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
  name: 'GridWaterfall',
  props: {
    lightestCol: String,
    darkestCol: String,
    reversed: Boolean,
  },
  data: function () {
    return {
      gridLength: 13,
      gridWidth: 13,
      updatesPerSecond: 8,
      intervalId: null,
    }
  },
  computed: {
    getRowNumbers: function() {
      if(this.reversed) {
        return Array(this.gridLength).fill().map((_,i) => i + 1);
      } else {
        return Array(this.gridLength).fill().map((_,i) => this.gridLength - i);
      }
    },
  },
  mounted() {
    const colorScale = chroma.scale([this.darkestCol, this.lightestCol]);
    const scaleVals = [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    const modValues = scaleVals.map(x => {
      return {
        color: colorScale(x).hex(),
        zIndex: sample([30, 31, 32, 33, 34]),
      };
    });

    const gridQueue = new GridQueue(this.gridWidth, this.gridLength, modValues);
    const data = {
      width: this.gridWidth,
      length: this. gridLength,
    }

    const updateGrid = () => {
      for(let k = 1; k <= data.width; k++) {
        for(let j = 1; j <= data.length; j++) {
          const currentUnit = gridQueue.toArray()[k - 1][j - 1];
          const selector = `row-${k}-col-${j}`
          const element = document.getElementsByClassName(selector)[0];
          const newCol = chroma(currentUnit.color);
          const hueAdj = utils.periodicFunction(
            new Date().getTime() / 1000,
            4,
            newCol.get('hsl.h') - 15,
            newCol.get('hsl.h') + 15,
          );
          element.style.backgroundColor = newCol.set('hsl.h', hueAdj);
          element.style.zIndex = currentUnit.zIndex;
        }
      }
    }

    updateGrid();
    this.intervalId = window.setInterval(() => {
      gridQueue.update();
      updateGrid();
    }, 1000 / this.updatesPerSecond);
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

  .grid-waterfall {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #222;
  }

  .grid-waterfall-table {
    border-collapse: collapse;
  }

  .grid-waterfall-table td {
    height: $waterfall-unit-w;
    width: $waterfall-unit-w;
    background-color: #222;
    box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.8);
    border-radius: 5px;
    position: relative;
  }

  @media (orientation: portrait) {
    .grid-waterfall-table {
      width: 100vh;

      td {
        height: $waterfall-unit-h;
        width: $waterfall-unit-h;
      }
    }
  }

  @media (orientation: landscape) {
    .grid-waterfall-table {
      width: 100vw;

      td {
        height: $waterfall-unit-w;
        width: $waterfall-unit-w;
      }
    }
  }
</style>
