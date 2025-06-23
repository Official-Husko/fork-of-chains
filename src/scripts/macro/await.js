
// <<await _promise>>
//   awaits for an asynchronous promise to finish, then renders the code inside it

Macro.add('await', {
  //isAsync : true,
  tags: null,

  handler() {
    const contents = this.payload[0].contents
    const promise = this.args[0]

    const $elem = $(document.createElement('span'))

    if (promise.then) {
      promise.then(this.createShadowWrapper(function() {
        $elem.wiki(contents)
      }))
    }

    $elem.appendTo(this.output)
  }
})
