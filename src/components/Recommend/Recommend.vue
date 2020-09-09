<template>
  <div class="recommend">
    <div class="recommend-list cleaxfix" v-for="(item, index) in goodsList" :key="index">
      <div
        class="recommend-item fl"
        v-for="(v, i) in item.goods"
        :key="i"
        @click="goDetail(index, i)"
      >
        <div class="recommend-item-top">
          <img
            class="auto-img recommend-item-img"
            v-if="v.goods_small_logo == ''"
            :src="require('../../assets/images/empty_goods.png')"
            alt
          />
          <img class="auto-img recommend-item-img" v-else v-lazy="v.goods_small_logo" alt />
        </div>
        <div class="recommend-item-bottom">
          <div class="recommend-item-title two-text">{{v.goods_name}}</div>
          <div class="recommend-item-price">
            <span class="recommend-item-price-symbol">￥</span>
            <span v-if="v.goods_price == 0" class="recommend-item-price-num">499</span>
            <span v-else class="recommend-item-price-num">{{v.goods_price}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Recommend",

  data() {
    return {
      // 关键词数据
      keywords: "",
      keywordsData: [],

      goodsData: [],
      goodsList: [],
    };
  },

  created() {
    // 从本地储存中获取关键词数据
    this.keywords = this.getRandomEle(
      localStorage.getItem("keywords").split(","),
      10
    );

    // 生成关键词数据
    this.keywords.forEach((v, i) => {
      this.keywordsData.push({ keywords: v, index: i });
    });

    // 遍历关键词数据 获取商品数据
    for (let i = 0; i < this.keywordsData.length; i++) {
      this.getGoodsList(i);
    }
  },

  methods: {
    // 获取数组内的随机元素
    getRandomEle(arr, count) {
      let shuffled = arr.slice(0), //显示数组内的全部元素
        i = arr.length, //数组长度
        min = i - count, //从哪里开始截取元素
        temp,
        index;
      while (i-- > min) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
      }
      return shuffled.slice(min);
    },

    // 获取商品列表
    getGoodsList(index) {
      // 调用 axios
      this.axios({
        method: "GET",
        url: "/goods/search",
        params: {
          query: this.keywordsData[index].keywords,
        },
      })
        .then((res) => {
          // console.log("getGoodsList => res =>", res);

          // 判断
          if (res.data.meta.status == 200) {
            this.goodsData = res.data.message.goods;

            // 随机抽取两条商品数据
            this.goodsData = this.getRandomEle(this.goodsData, 2);

            // 如果数据不存在则删除该数据
            if (this.goodsData[0] == undefined) {
              this.goodsData.splice(this.goodsData[0], 1);
            }

            // 将商品数据和商品关键词放入数组内
            this.goodsList.push({
              goods: this.goodsData,
              keywords: this.keywordsData[index].keywords,
            });
          }
        })
        .catch((err) => {
          console.log("getGoodsList => err =>", err);
        });
    },

    // 点击跳转到商品详情页面
    goDetail(index, i) {
      this.$router.push({
        name: "Detail",
        query: {
          keywords: this.goodsList[index].keywords,
          goods_id: this.goodsList[index].goods[i].goods_id
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.recommend {
  position: relative;
  overflow: hidden;
  background-color: #fff;
  .recommend-list {
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;
    flex-wrap: wrap;
    background-color: #f7f7f7;
    .recommend-item {
      background-color: #fff;
      position: relative;
      width: calc(~"(100% - 1px) / 2");
      margin-bottom: 1px;
      padding: 15px 15px 0;
      box-sizing: border-box;
      border-radius: 10px;
      &:nth-of-type(2n-1) {
        margin-right: 1px;
      }
      .recommend-item-top {
        position: relative;
        overflow: hidden;
        padding-top: 100%;
        height: 0;
        .recommend-item-img {
          position: absolute;
          max-width: 100%;
          max-height: 100%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .recommend-item-bottom {
        margin-bottom: 10px;
        .recommend-item-title {
          margin: 12px 0 4px;
          font-size: 12px;
          color: #333;
          line-height: 18px;
          height: 36px;
        }
        .recommend-item-price {
          display: inline-block;
          font-size: 12px;
          color: #f2373b;
          margin-right: 3px;
          line-height: 20px;
          .recommend-item-price-symbol {
            font-size: 12px;
          }
          .recommend-item-price-num {
            font-size: 16px;
          }
        }
      }
    }
  }
}
</style>