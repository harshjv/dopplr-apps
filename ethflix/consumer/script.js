/* global Vue, WebTorrent, DragDrop, lightwallet, qrcodelib, BigNumber */

var client
var producerAddress = '0x357a7b09e45e9744ca0f12c9e8358d9c4aa2caa5'
var password = 'my-secret-password-i-love-my-family'

// b45b80a30978d5b59068b1ab398ba9890acb3b42

var toWei = new BigNumber('1000000000000000000')

var calculateAmount = function (rawBytes) {
  var bytes = new BigNumber(rawBytes)
  var weiPerByte = new BigNumber('61035156')

  var wei = weiPerByte.mul(bytes)

  return wei.div(toWei).toString()
}

var app = new Vue({
  data: {
    consumerAddress: null,
    consumerAddressQrCodeUri: null,
    deposit: true,
    rawVideoId: null,
    videoId: null,
    dataTransfer: []
  },
  methods: {
    setVideoId: function () {
      var ref = this
      ref.videoId = ref.rawVideoId

      client.add('magnet:?xt=urn:btih:' + ref.videoId + '&dn=video.mp4&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com', function (torrent) {
        console.log(torrent)

        var file = torrent.files[0]

        file.appendTo('#video', function (err, elem) {
          if (err) throw err // file failed to download or display in the DOM

          console.log('New DOM node with the content', elem)
        })

        torrent.on('wire', function (wire) {
          console.log(wire)
        })

        torrent.on('ready', function () {
          console.log('ready')
        })

        torrent.on('download', function (bytes) {
          console.log(bytes)

          app.dataTransfer.unshift({
            bytes: bytes,
            amount: calculateAmount(bytes)
          })
        })
      })
    }
  }
})

app.$mount('#app')

lightwallet.keystore.createVault({
  password: password
}, function (err, ks) {
  if (err) throw err

  ks.keyFromPassword(password, function (err, pwDerivedKey) {
    if (err) throw err

    ks.generateNewAddress(pwDerivedKey, 5)
    var addr = ks.getAddresses()

    var address = '0x' + addr[0]

    qrcodelib.toDataURL(address, { errorCorrectionLevel: 'H' }, function (error, uri) {
      if (error) throw error

      app.consumerAddress = address
      app.consumerAddressQrCodeUri = uri
    })

    client = new WebTorrent()

    // var privateKey = ks.exportPrivateKey(address, pwDerivedKey)
    //
    // lightwallet.signing.signTx(ks, pwDerivedKey, txutils.valueTx({
    //   to:
    // }), address)
  })
})
