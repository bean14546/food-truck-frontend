import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#F53B50',
        secondary: '#FEEBED',

        // custom color
        background: '#FAFAFA',
        lightGray: '#f4f4f4',
        grey: '#A0A0A0',
        green: '#2F9200',
        yellow: '#FBB806'
      }
    }
  }
})
