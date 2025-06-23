
Mousetrap.unbind('space').bind('space', function () {
  const elem = $('.press_on_space > a').get(0)
  if (elem) elem.click()
  // $('#continuebtn > a').click();
  return false
});
