setup.SexPermissionClass.Full = class Full extends setup.SexPermission {
  constructor() {
    super(
      'full',
      [  /* tags */
      ],
      [  /* disallowed tags */
      ],
    )
  }
}

setup.sexpermission.full = new setup.SexPermissionClass.Full()
