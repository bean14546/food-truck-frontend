<template>
  <div>
    <v-card
      class="d-flex rounded-lg color-card-style"
      :class="horizontal || recommend ? (recommend ? 'flex-row rounded-xl elevation-0' : 'flex-row' ) : 'flex-column'"
      :color="!color ? 'white' : ''"
      :style="colorVariable"
      :width="width"
      :height="height"
      :min-width="!recommend ? (!horizontal ? '150px' : '') : '300px'"
      :max-width="!recommend ? (!horizontal ? '250px' : '') : '300px'"
      :min-height="!recommend ? (!horizontal ? '250x' : '') : '160px'"
      :max-height="!recommend ? (!horizontal ? '300px' : '') : '160px'"
      @click="goToSlug"
    >
      <!-- รูปภาพ -->
      <v-responsive
        v-if="horizontal || recommend"
        class="d-flex align-center"
        :class="recommend ? 'pa-6' : 'pa-3 pr-0'"
        width="85px"
        max-width="160px"
        aspect-ratio="1"
      >
        <v-img
          class="rounded-lg"
          :src="food.id ? food.Food_Image : (link ? image : imgSrc(image))"
          aspect-ratio="1"
        />
      </v-responsive>
      <v-img
        v-else
        :src="food.id ? food.Food_Image : (link ? image : imgSrc(image))"
        aspect-ratio="1.54"
      />
      <!-- รายละเอียด -->
      <div :class="horizontal || recommend ? (recommend ? 'd-flex flex-column justify-center' : 'pa-3') : 'pa-0'">
        <v-card-title class="text-subtitle-1 font-weight-medium" :class="!horizontal && !recommend ? 'pa-3 pb-1' : 'pa-0'">
          <p
            class="title mb-0"
            :class="color ?
            (recommend ? 'white--text text-h6 font-weight-light mb-3' : 'white--text text-subtitle-1 font-weight-medium mb-2') :
            (recommend ? 'text-h6 font-weight-light mb-3' : 'text-subtitle-1 font-weight-medium mb-2')"
            :style="numberOfLines"
          >
            {{ food.id ? food.Food_Name : name }}
          </p>
        </v-card-title>
        <v-card-text :class="!horizontal && !recommend ? 'px-3 py-1' : 'pa-0'">
          <p v-if="!recommend" class="description mb-0" :class="color ? 'white--text' : 'grey--text'">
            {{ food.id ? food.Food_Description : description }}
          </p>
          <v-btn v-else class="white--text" color="yellow" elevation="0" rounded @click="goToSlug">
            ซื้อตอนนี้
          </v-btn>
        </v-card-text>
      </div>

      <!-- ราคา -->
      <v-card-actions
        v-if="!recommend"
        :class="horizontal ? 'd-flex flex-column justify-center align-end w-60 pa-3 pl-0' : 'pa-3 pt-1'"
      >
        <div v-if="horizontal && quantity" class="text-caption">
          <span>จำนวน {{ quantity }} ที่</span>
        </div>
        <div class="d-flex">
          <span class="text-subtitle-2 font-weight-regular" :class="color ? 'white--text' : 'green--text'"> {{ horizontal ? 'รวม' : 'เริ่มต้นที่' }} </span>
          <span class="text-subtitle-2 font-weight-regular mx-1" :class="color ? 'white--text' : 'green--text'"> {{ horizontal && totalPrice ? totalPrice : food.Food_Price }} </span>
          <span class="text-subtitle-2 font-weight-regular" :class="color ? 'white--text' : 'green--text'"> บาท </span>
        </div>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'MenuCardComponent',
  props: {
    recommend: {
      type: Boolean,
      default: false
    },
    horizontal: {
      type: Boolean,
      default: false
    },
    color: {
      type: [String, Boolean],
      default: false
    },
    width: {
      type: [String, Number],
      default: '160px'
    },
    height: {
      type: [String, Number],
      default: '250px'
    },
    totalPrice: {
      type: Number,
      default: null
    },
    quantity: {
      type: Number,
      default: null
    },
    nameSlug: {
      type: String,
      default: null
    },
    link: {
      type: Boolean,
      default: false
    },
    to: {
      type: [String, Number],
      default: 'not-found'
    },
    // Food Object Variable
    food: {
      type: Object,
      default: () => {
        return {
          id: null,
          Food_Name: null,
          Food_Price: null,
          Food_Description: null,
          Food_Image: null,
          created_at: null,
          updated_at: null
        }
      }
    },
    // Food Custom Variable
    id: {
      type: Number,
      default: null
    },
    name: {
      type: String,
      default: null
    },
    description: {
      type: [String, Object],
      default: null
    },
    image: {
      type: String,
      default: null
    },
    editMenu: {
      type: Object,
      default: null
    },
    detailMenu: {
      type: Object,
      default: null
    }
  },
  computed: {
    colorVariable () {
      return `--color: ${this.color ? this.color : 'white'}`
    },
    numberOfLines () {
      return this.recommend ? '--line: 2' : '--line: 1'
    }
  },
  methods: {
    goToSlug () {
      this.$router.push(`/food-truck/_${this.nameSlug}_slug/${this.to}`)
      if (this.editMenu) {
        this.$store.commit('menuEdit', this.editMenu)
      } else if (this.detailMenu) {
        this.$store.commit('detailOrder', this.detailMenu)
      }
    },
    imgSrc (image) {
      return require(`../../../style/assets/image/${image}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  @include lineClamp(var(--line), 1.2rem);
}
.description {
  @include lineClamp(2, 1.5rem);
}
.color-card-style {
  @include colorGradient(var(--color));
}
</style>