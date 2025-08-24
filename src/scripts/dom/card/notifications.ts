export default {
  /**
   * @param notifications - if left empty, will pop from `$notifications`
   */
  notifications(notifications?: string[]): DOM.Node | null {
    const fragments: DOM.Attachable[] = [];
    let parsed_notifications;
    if (notifications) {
      parsed_notifications = notifications;
    } else {
      parsed_notifications = State.variables.notification.popAll();
    }

    for (const notification of parsed_notifications) {
      fragments.push(
        setup.DOM.create("div", {}, setup.DOM.Util.twee(notification)),
      );
    }
    if (fragments.length) {
      return setup.DOM.create(
        "div",
        { class: "notification-container" },
        setup.DOM.create("div", { class: "notificationcard" }, fragments),
      );
    } else {
      return null;
    }
  },
};
