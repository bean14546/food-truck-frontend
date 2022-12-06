<template>
  <div>
    <v-card
      class="d-flex rounded-lg color-card-style"
      :class="horizontal || recommend ? (recommend ? 'flex-row rounded-xl elevation-0' : 'flex-row' ) : 'flex-column'"
      :color="!color ? 'white' : ''"
      :style="colorVariable"
      :width="width"
      :height="height"
      :min-width="!recommend ? (!horizontal ? '180px' : '') : '300px'"
      :max-width="!recommend ? (!horizontal ? '250px' : '') : '300px'"
      :min-height="!recommend ? (!horizontal ? '250px' : '') : '160px'"
      :max-height="!recommend ? (!horizontal ? '300px' : '') : '160px'"
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
          :src="food.Food_Image"
          aspect-ratio="1"
        />
      </v-responsive>
      <v-img
        v-else
        :src="food.Food_Image"
        aspect-ratio="1.54"
      />

      <!-- รายละเอียด -->
      <div :class="horizontal || recommend ? (recommend ? 'd-flex flex-column justify-center' : 'pa-3') : 'pa-0'">
        <v-card-title class="text-subtitle-1 font-weight-medium" :class="!horizontal && !recommend ? 'pa-3 pb-1' : 'pa-0'">
          <p
            class="title mb-0"
            :class="color ?
            (recommend ? 'white--text text-h6 font-weight-light mb-3' : 'white--text text-subtitle-1 font-weight-medium') :
            (recommend ? 'text-h6 font-weight-light mb-3' : 'text-subtitle-1 font-weight-medium')"
            :style="numberOfLines"
          >
            {{ food.Food_Name }}
          </p>
        </v-card-title>
        <v-card-text :class="!horizontal && !recommend ? 'px-3 py-1' : 'pa-0'">
          <p v-if="!recommend" class="description mb-0" :class="color ? 'white--text' : 'grey--text'">
            {{ food.Food_Description }}
          </p>
          <v-btn v-else class="white--text" color="yellow" elevation="0" rounded>
            ซื้อตอนนี้
          </v-btn>
        </v-card-text>
      </div>

      <!-- ราคา -->
      <v-card-actions
        v-if="!recommend"
        :class="horizontal ? 'pa-3 pl-0' : 'pa-3 pt-1'"
      >
        <span v-if="!horizontal" :class="color ? 'white--text' : 'green--text'"> เริ่มต้นที่ </span>
        <span class="mx-1" :class="color ? 'white--text' : 'green--text'"> {{ food.Food_Price }} </span>
        <span :class="color ? 'white--text' : 'green--text'"> บาท </span>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'MenuCardComponent',
  computed: {
    colorVariable () {
      return `--color: ${this.color}`
    },
    numberOfLines () {
      return this.recommend ? '--line: 2' : '--line: 1'
    }
  },
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
      default: '190px'
    },
    height: {
      type: [String, Number],
      default: '250px'
    },
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