<template>
  <v-form ref="uploadForm">
    <v-card
      class="card-upload d-flex flex-column justify-center"
      elevation="0"
      :height="height"
      outlined
      @click="selectFile()"
      @drop.prevent="onDrop"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
    >
      <input
        ref="inputFiles"
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        hidden
        @change="onFileChanged($event)"
      >
      <v-card-text :class="`${dragover ? 'primary--text' : 'greyDark--text' }`" class="text-caption text-capitalize">
        <div v-if="!imgPreview" class="d-flex flex-column justify-center align-center">
          <v-icon
            :color="dragover ? 'primary' : 'greyDark--text'"
            :class="dragover ? 'mt-0 mb-1' : 'mt-0'"
            size="70"
          >
            mdi-cloud-upload
          </v-icon>
          <strong class="text-subtitle-2 font-weight-bold" :class="`${dragover ? 'primary--text':'greyDark--text' }`">
            <span>{{ title }}</span>
          </strong>
          <span class="text-caption">Upload JPG, PNG file</span>
        </div>
        <v-img
          v-else
          :src="imgPreview"
          :max-height="height"
          height="auto"
          width="100%"
          contain
          aspect-ratio="1"
        />
        <v-card-actions v-if="!noneBtn && !imgPreview" class="d-flex justify-center pb-3">
          <!-- ปุ่มหลอก เอามาเพื่อให้ตรง UI แต่ action จริงๆ อยู่ที่ @click="selectFile()" ใน v-card บรรทัดที่ 7 -->
          <v-btn
            class="rounded-lg"
            depressed
            outlined
            color="primary"
          >
            Browse files
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
    <v-input v-if="file || imgPreview" v-model="file" height="1px" hide-details :rules="rules.image" />
    <div class="text-end">
      <v-btn v-if="file || imgPreview" class="mt-1" color="primary" x-small outlined @click="clearData"> ลบไฟล์รูปภาพ </v-btn>
    </div>
  </v-form>
</template>

<script>
export default {
  name: 'UploaderImageComponent',
  props: {
    title: {
      type: String,
      default: 'Select a file or drag and drop here'
    },
    height: {
      type: String,
      default: 'auto'
    },
    noneBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dragover: false,
      imgPreview: null,
      file: null,
      rules: {
        image: [
          (v) => {
            const mimetypeImages = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp']
            return !v || mimetypeImages.includes(v.type) || 'กรุณาเลือกประเภทของไฟล์ให้ถูกต้ง'
          }
        ]
      }
    }
  },
  methods: {
    selectFile () {
      const fileInputElement = this.$refs.inputFiles
      fileInputElement.value = null
      fileInputElement.click()
    },
    onDrop (e) {
      this.dragover = false
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        this.keepData(e.dataTransfer.files[0])
      }
    },
    onFileChanged (e) {
      if (e.target.files && e.target.files.length > 0) {
        this.keepData(e.target.files[0])
      }
    },
    keepData (file) {
      if (['image/jpg', 'image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        this.imgPreview = URL.createObjectURL(file)
        this.file = file
        this.$emit('file', this.file)
      } else {
        this.$refs.uploadForm.validate()
        this.imgPreview = null
      }
    },
    imgForEdit (linkImg) {
      this.imgPreview = linkImg
    },
    clearData () {
      const fileInputElement = this.$refs.inputFiles
      fileInputElement.value = null
      this.file = null
      this.imgPreview = null
      this.$refs.uploadForm.resetValidation()
    }
  }
}
</script>
