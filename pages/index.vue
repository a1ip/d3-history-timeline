<template>
  <section class="container">
    <b-modal id="myModal" size="lg">
      <b-tabs>
        <b-tab title="People" active>
          <table class="table">
            <tbody>
              <tr v-for="people in peoples" v-bind:key="people.title">
                <td><input type="checkbox" v-on:change="onPeopleSelect(people)" v-bind:value="people.title"></td>
                <td><b-img rounded width="45" height="45" blank-color="#777" alt="img" v-bind:src="people.imageUrl" /></td>
                <td>{{people.title}}</td>
              </tr>
            </tbody>
          </table>
        </b-tab>
        <b-tab title="Organization" >
          <table class="table">
            <tbody>
              <tr v-for="organization in organizations" v-bind:key="organization.title">
                <td><input type="checkbox" v-on:change="onOrganizationSelect(organization)" v-bind:value="organization.title"></td>
                <td><b-img rounded width="45" height="45" blank-color="#777" alt="img" v-bind:src="organization.imageUrl" /></td>
                <td>{{organization.title}}</td>
              </tr>
            </tbody>
          </table>
        </b-tab>
        <b-tab title="Sample">
          <table class="table">
            <thead class="thead-light">
              <tr>
                <th scope="col"></th>
                <th scope="col">Title</th>
                <th scope="col">Peoples</th>
                <th scope="col">Organizations</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sample in sampleData" v-bind:key="sample.name">
                <td><input type="checkbox" v-on:change="onSampleSelect(sample)" v-model="sample.selected"></td>
                <td>{{sample.title}}</td>
                <td>{{sample.peoples.join(", ")}}</td>
                <td>{{sample.organizations.join(", ")}}</td>
              </tr>
            </tbody>
          </table>
        </b-tab>
      </b-tabs>
    </b-modal>

    <b-modal id="newHistoryForm" size="lg">
      <history-form></history-form>
    </b-modal>

    <!-- error message -->
    <div v-if="error">
      <b-container fluid>
        <b-alert show variant="danger" dismissible>
          <h4 class="alert-heading">{{error.message}}</h4>
          <hr>
          <p>{{error.stack}}</p>
        </b-alert>
      </b-container>
    </div>

    <!-- loading message -->
    <div v-if="loading">
      <b-container fluid>
        <b-alert show variant="info">
          <h4 class="alert-heading">Loading... <i class="fa fa-spinner fa-spin"></i> </h4>
        </b-alert>
      </b-container>
    </div>

    <!-- contents -->
    <div v-if="!loading">
      <b-container fluid>
        <div v-if="dataSelected">
          <h2>{{ timelineTitle }} {{ historyRange }}</h2>
          <span><b-button v-b-modal.myModal variant="outline-success">Select Data</b-button></span>
          <div id="svgArea" class=""></div>
        </div>
        <div v-else>
          <b-alert show variant="light">
            <h4 class="alert-heading">No data selected.</h4>
            <p>
              タイムラインに表示するデータを選択してください。
            </p>
            <p>
              select Timeline data.
            </p>
            <hr>
            <p class="mb-0">
              <b-button v-b-modal.myModal variant="outline-success">SELECT</b-button>
            </p>
            <p class="mb-0">
              <b-button v-b-modal.newHistoryForm variant="outline-info">New Record</b-button>
            </p>
          </b-alert>
        </div>
      </b-container>
    </div>
  </section>
</template>

<script>
import * as d3 from "d3";
import { mapGetters, mapActions, mapMutations } from "vuex";
import HistoryForm from "~/components/HistoryForm";

export default {
  name: "timeline",
  data: function() {
    return {
      colorMapping: {
        // people: "blue",
        // organization: "lightseagreen"
        people: "#364f6b",
        organization: "#364f6b"
      },
      selectedSample: null,
      timelineTitle: "",
      loading: false
    };
  },
  computed: {
    width: function() {
      return window.innerWidth - 40;
    },
    height: function() {
      return window.innerHeight - 40;
    },
    historyRange: function() {
      return "A.D. " + this.areaStartYear + " ~ " + this.areaEndYear;
    },
    dataSelected: function() {
      return this.chartData.length > 0;
    },
    hasError: () => {
      return this.error === null;
    },
    ...mapGetters([
      "chartData",
      "sampleData",
      "error",
      "peoples",
      "organizations",
      "eventData",
      "areaStartYear",
      "areaEndYear",
      "areaPeriod"
    ])
  },
  components: {
    HistoryForm
  },
  mounted: async function() {
    this.loading = true;
    await this.onInitialize();
    this.loading = false;
  },
  methods: {
    onPeopleSelect: function(people) {
      this.onSelectStateChangedAsync(people).then(() => {
        this.renderChart();
      });
    },
    onOrganizationSelect: function(organization) {
      this.onSelectStateChangedAsync(organization).then(() => {
        this.renderChart();
      });
    },
    onSampleSelect: function(sample) {
      this.onSampleSelectAsync(sample).then(() => {
        this.renderChart();
      });
    },
    renderChart: function() {
      var $_this = this;
      var width = window.innerWidth - 40;
      var height = this.chartData.length * 50 + 250;

      // 以前のは消す
      d3.select(".svg").remove();

      var svg = d3
        .select("#svgArea")
        .append("svg")
        .attr("class", "svg")
        .attr("width", width)
        .attr("height", height);

      // line
      svg
        .selectAll("line")
        .data(this.chartData)
        .enter()
        .append("line")
        .attr(
          "x1",
          function(d) {
            return this.calcStartX(d);
          }.bind(this)
        )
        .attr(
          "y1",
          function(d, i) {
            return this.calcTopY(i);
          }.bind(this)
        )
        .attr(
          "x2",
          function(d) {
            return this.calcStartX(d);
          }.bind(this)
        )
        .attr(
          "y2",
          function(d, i) {
            return this.calcTopY(i);
          }.bind(this)
        )
        .transition()
        .duration(1000)
        .attr(
          "x1",
          function(d) {
            return this.calcStartX(d);
          }.bind(this)
        )
        .attr(
          "y1",
          function(d, i) {
            return this.calcTopY(i);
          }.bind(this)
        )
        .attr(
          "x2",
          function(d) {
            return this.calcEndX(d);
          }.bind(this)
        )
        .attr(
          "y2",
          function(d, i) {
            return this.calcTopY(i);
          }.bind(this)
        )
        .attr("stroke-width", 3)
        .attr(
          "stroke",
          function(d) {
            return this.colorMapping[d.category];
          }.bind(this)
        );

      // circle start
      svg
        .selectAll("startYear")
        .data(this.chartData)
        .enter()
        .append("circle")
        .attr("class", "startYear")
        .attr("r", 0)
        .attr(
          "cx",
          function(d) {
            return this.calcStartX(d);
          }.bind(this)
        )
        .attr(
          "cy",
          function(d, i) {
            return this.calcTopY(i);
          }.bind(this)
        )
        .transition()
        .duration(1500)
        .attr("r", 5)
        .attr(
          "fill",
          function(d) {
            return this.colorMapping[d.category];
          }.bind(this)
        )
        .attr(
          "cx",
          function(d) {
            return this.calcStartX(d);
          }.bind(this)
        )
        .attr(
          "cy",
          function(d, i) {
            return this.calcTopY(i);
          }.bind(this)
        );

      // circle end
      svg
        .selectAll("endYear")
        .data(this.chartData)
        .enter()
        .append("circle")
        .attr("class", "endYear")
        .attr("r", 0)
        .attr(
          "cx",
          function(d) {
            return this.calcEndX(d);
          }.bind(this)
        )
        .attr(
          "cy",
          function(d, i) {
            return this.calcTopY(i);
          }.bind(this)
        )
        .transition()
        .duration(1500)
        .attr("r", 5)
        .attr(
          "fill",
          function(d) {
            return this.colorMapping[d.category];
          }.bind(this)
        )
        .attr(
          "cx",
          function(d) {
            return this.calcEndX(d);
          }.bind(this)
        )
        .attr(
          "cy",
          function(d, i) {
            return this.calcTopY(i);
          }.bind(this)
        );

      // 誕生年にマウスオーバー
      svg
        .selectAll(".startYear")
        .on("mouseover", function(d, i) {
          var coordinates = d3.mouse(this);
          svg
            .append("text")
            .text(d.birth)
            .attr("id", "startPoint")
            .attr("fill", "gray")
            .attr("x", coordinates[0])
            .attr("y", _calcTopY(i) + 20)
            .attr("font-size", 14);
        })
        .on("mouseout", function() {
          svg.select("#startPoint").remove();
        });

      // 没年にマウスオーバー
      svg
        .selectAll(".endYear")
        .on("mouseover", function(d, i) {
          var coordinates = d3.mouse(this);
          svg
            .append("text")
            .text(d.dead)
            .attr("id", "endPoint")
            .attr("fill", "gray")
            .attr("x", coordinates[0])
            .attr("y", _calcTopY(i) + 20)
            .attr("font-size", 14);
        })
        .on("mouseout", function() {
          svg.select("#endPoint").remove();
        });

      // text
      svg
        .selectAll("text")
        .data(this.chartData)
        .enter()
        .append("text")
        .attr(
          "x",
          function(d) {
            return this.calcStartX(d) - 30;
          }.bind(this)
        )
        .attr(
          "y",
          function(d, i) {
            return this.calcTopY(i) - 12;
          }.bind(this)
        )
        .transition()
        .duration(1500)
        .text(function(d) {
          return d.title + " (" + d.start + " ~ " + d.end + ")";
        })
        .attr("fill", "black")
        .attr(
          "x",
          function(d) {
            return this.calcStartX(d);
          }.bind(this)
        )
        .attr(
          "y",
          function(d, i) {
            return this.calcTopY(i) - 12;
          }.bind(this)
        )
        .attr("font-size", 14);

      // thumbnail
      svg
        .selectAll("thumb")
        .data(this.chartData)
        .enter()
        .append("image")
        .attr("class", "thumb")
        .attr("xlink:href", function(d) {
          return d.imageUrl;
        })
        .attr(
          "x",
          function(d) {
            return this.calcStartX(d) - 50;
          }.bind(this)
        )
        .attr(
          "y",
          function(d, i) {
            return this.calcTopY(i) - 20;
          }.bind(this)
        )
        .attr("width", "40")
        .attr("height", "40");

      // サムネイルにマウスオーバーしたら拡大画像を表示する
      svg
        .selectAll(".thumb")
        .on("mouseover", function(d, i) {
          var coordinates = d3.mouse(this);
          var baseIndex = d.baseIndex;
          svg.select("#focusedImage").remove();
          svg
            .append("image")
            .attr("id", "focusedImage")
            .attr("xlink:href", d.imageUrl)
            .attr("x", coordinates[0] - 20)
            .attr("y", coordinates[1])
            .attr("width", 220)
            .attr("height", 220);
        })
        .on("mouseout", function() {
          svg.select("#focusedImage").remove();
        });

      // イベントポイントを描画する
      svg
        .selectAll("eventPoint")
        .data(this.eventData)
        .enter()
        .append("circle")
        .attr("class", "eventPoint")
        .attr("r", 0)
        .attr(
          "cx",
          function(d) {
            return this.calcStartX(d);
          }.bind(this)
        )
        .attr(
          "cy",
          function(d, i) {
            return this.calcTopY(d.baseIndex);
          }.bind(this)
        )
        .transition()
        .duration(2500)
        .attr("r", 5)
        .attr("fill", function(d) {
          return "#fc5185";
        })
        .attr(
          "cx",
          function(d) {
            return this.calcStartX(d);
          }.bind(this)
        )
        .attr(
          "cy",
          function(d, i) {
            return this.calcTopY(d.baseIndex);
          }.bind(this)
        );

      // イベントポイントへのマウスオーバーイベント
      svg
        .selectAll(".eventPoint")
        .on("mouseover", function(d, i) {
          var coordinates = d3.mouse(this);
          var baseIndex = d.baseIndex;
          svg
            .append("text")
            .text(d.start + " : " + d.content)
            .attr("id", "eventContent")
            .attr("fill", "gray")
            .attr("x", coordinates[0])
            .attr("y", _calcTopY(baseIndex) - 10)
            .attr("font-size", 14);
        })
        .on("mouseout", function() {
          svg.select("#eventContent").remove();
        });

      // クリックイベント
      d3.select("svg").on("click", function(p) {
        svg.select(".latitudeLine").remove();
        var coordinates = d3.mouse(this);
        svg
          .append("line")
          .attr("class", "latitudeLine")
          .attr("x1", coordinates[0])
          .attr("y1", 0)
          .attr("x2", coordinates[0])
          .attr("y2", height)
          .style("stroke-opacity", 0.2)
          .attr("stroke-width", 0.3)
          .attr("stroke", "black");

        svg.selectAll(".circle2").remove();
        svg
          .selectAll("circle2")
          .data($_this.chartData)
          .enter()
          .append("circle")
          .attr("class", "circle2")
          .attr("r", 2.5)
          .attr("fill", "black")
          .attr("cx", coordinates[0])
          .attr(
            "cy",
            function(d, i) {
              return _calcTopY(i);
            }.bind(this)
          );

        svg.selectAll(".text2").remove();
        svg
          .selectAll("text2")
          .data($_this.chartData)
          .enter()
          .append("text")
          .attr("x", coordinates[0] - 30)
          .attr(
            "y",
            function(d, i) {
              return _calcTopY(i) + 17;
            }.bind(this)
          )
          .attr("fill", "white")
          .transition()
          .duration(150)
          .attr("class", "text2")
          .attr("fill", "grey")
          .text(function(d) {
            if (d.category == "people") {
              var age = _calcAgeLineX(coordinates[0], d);
              return "Age : " + age;
              // return "Age : ";
            } else {
              return "";
            }
          })
          .attr("x", coordinates[0] + 5)
          .attr(
            "y",
            function(d, i) {
              return _calcTopY(i) + 17;
            }.bind(this)
          )
          .attr("font-size", 14);
      });

      function _calcTopY(index) {
        return (index + 1) * 60;
      }

      function _chartData() {
        return this.chartData;
      }

      // X座標とhistoryラインの交点におけるターゲットの年齢を算出する
      function _calcAgeLineX(latitude, d) {
        // 描画開始点のX座標を求める
        var startX =
          Math.abs(
            width *
              (d.start - $nuxt.$store.getters.areaStartYear) /
              $nuxt.$store.getters.areaPeriod
          ) + 5;
        var v = latitude - startX;
        var scale = $nuxt.$store.getters.areaPeriod / width;
        return Math.round(v * scale);
      }
    },
    // 描画開始点の座標を求める
    calcStartX: function(d) {
      return (
        Math.abs(
          this.width * (d.start - this.areaStartYear) / this.areaPeriod
        ) + 5
      );
    },
    // 描画終了点の座標を求める
    calcEndX: function(d) {
      return (
        Math.abs(this.width * (d.end - this.areaStartYear) / this.areaPeriod) -
        10
      );
    },
    // 各レコードを描画するY座標を算出する
    calcTopY: function(index) {
      return (index + 1) * 60;
    },
    ...mapMutations(["getStartX"]),
    ...mapActions([
      "onInitialize",
      "onSelectStateChangedAsync",
      "onSampleSelectAsync"
    ])
  }
};
</script>

<style>
</style>
