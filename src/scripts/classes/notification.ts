// @ts-nocheck

// will be set to $notification
setup.Notification = class Notification extends setup.TwineClass {
  constructor() {
    super()
    this.notifications = []
    this.to_be_deleted = []
    this.delete_next = []
    this.disabled_semaphore = 0
  }

  disable() {
    this.disabled_semaphore += 1
  }

  enable() {
    this.disabled_semaphore -= 1
    if (this.disabled_semaphore < 0) throw new Error('Disabled semaphore cannot be negative!')
  }

  isDisabled() {
    return this.disabled_semaphore > 0
  }

  popAll() {
    if (this.isDisabled()) return []
    let res = this.notifications
    this.notifications = []
    return res
  }

  addNotification(text) {
    if (!this.isDisabled()) {
      this.notifications.push(text)
    }
  }

  deleteAll() {
    for (let i = 0; i < this.delete_next.length; ++i) {
      let to_delete_info = this.delete_next[i]
      let obj = State.variables[to_delete_info.container_name][to_delete_info.key]
      // can already be deleted
      if (obj) {
        obj.delete()
      }
    }
    this.delete_next = this.to_be_deleted
    this.to_be_deleted = []
  }
}

/**
 * @param {string} text 
 * @param {Object<string, setup.Unit>} [actor_mapping]  BE CAREFUL WITH THIS! Don't include large things like image glob.
 */
setup.notify = function(text, actor_mapping) {
  let parsed
  if (actor_mapping) {
    parsed = setup.Text.replaceUnitMacros(text, actor_mapping)
  } else {
    parsed = text
  }
  State.variables.notification.addNotification(parsed)
}

setup.queueDelete = function(obj, container_name) {
  // Queue delete obj at the start of 2nd next passage.
  if (!(container_name in State.variables)) throw new Error(`Unknown ${container_name} for queueDelete`)
  State.variables.notification.to_be_deleted.push({
    key: obj.key,
    container_name: container_name,
  })
}
