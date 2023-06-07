<template>
  <div v-if="items">
    <v-card
      class="mx-auto"
      elevation="0"
      rounded="lg"
      outlined
    >
      <v-img
        class="align-end"
        height="100%"
        max-height="220px"
        :src="image ? image : items.Food.Food_Image"
      >
        <v-card-title class="primary--text font-weight-regular color-title-style">
          {{ name ? name : items.Food.Food_Name }}
        </v-card-title>
      </v-img>

      <v-card-title class="primary--text font-weight-regular">
        รายละเอียดคำสั่งซื้อ
      </v-card-title>

      <v-card-text class="primary--text text-subtitle-1">
        <div class="d-flex justify-space-between">
          <p>ตัวเลือก</p>
          <p v-if="items.Options && items.Options.length > 0" class="darkGrey--text">
            <span v-for="(option, index) in items.Options" :key="`option-${index}`">
              {{ option.Option_Name }}
              {{ option.Option_Details.Option_Detail_Name }}
              <span v-if="items.Options && !(items.Options.length === index + 1)">,</span>
            </span>
          </p>
          <p v-else class="darkGrey--text">ไม่มี</p>
        </div>
        <div class="d-flex justify-space-between">
          <p>เครื่องเคียง</p>
          <p v-if="items.Topping && items.Topping.length > 0" class="darkGrey--text">
            <span v-for="(topping, index) in items.Topping" :key="`topping-${index}`">
              {{ topping.Topping_Name }}
              <span v-if="items.Topping && !(items.Topping.length === index + 1)">,</span>
            </span>
          </p>
          <p v-else class="darkGrey--text">ไม่มี</p>
        </div>
        <div class="d-flex justify-space-between">
          <p>โน๊ต</p>
          <p v-if="items.Note" class="darkGrey--text">{{ items.Note }}</p>
          <p v-else class="darkGrey--text">ไม่มี</p>
        </div>
        <div class="d-flex justify-space-between">
          <p>จำนวน</p>
          <p class="darkGrey--text">{{ items.Amount }}</p>
        </div>
        <div class="d-flex justify-space-between">
          <p>ราคารวม</p>
          <p class="darkGrey--text">{{ items.Price }}</p>
        </div>
        <div v-if="items && items.Chef_Note" class="d-flex justify-space-between">
          <p>โน๊ตจากร้านค้า</p>
          <p class="darkGrey--text">{{ items.Chef_Note }}</p>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'DetailCardComponent',
  props: {
    items: {
      type: Object,
      default: () => {
        return {}
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
    }
  }
}
</script>

<style lang="scss" scoped>
.color-title-style {
  background: rgba(254, 235, 237, 0.8)
}
</style>