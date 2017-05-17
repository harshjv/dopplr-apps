/* global Vue, WebTorrent, DragDrop */

// file b45b80a30978d5b59068b1ab398ba9890acb3b42

// 0x357a7b09e45e9744ca0f12c9e8358d9c4aa2caa5 // @harshjv

var app = new Vue({
  data: {
    inputProducerAddress: null,
    producerAddress: null,
    infoHash: null
  },
  methods: {
    init: function () {
      var ref = this
      ref.producerAddress = ref.inputProducerAddress

      var client = new WebTorrent()

      setTimeout(function () {
        console.log('Drag now')

        DragDrop('#dropTarget', function (files, pos) {
          console.log('Here are the dropped files', files)

          client.seed(files, function (torrent) {
            console.log(torrent.files)
            console.log(torrent.infoHash)
            console.log(torrent.magnetURI)

            app.infoHash = torrent.infoHash

            torrent.on('wire', function (wire) {
              console.log(wire)
            })

            torrent.on('upload', function (bytes) {
              console.log(`${bytes}b uploaded`)
            })
          })
        })
      }, 1500)
    }
  }
})

app.$mount('#app')
