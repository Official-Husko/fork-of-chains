// @ts-nocheck

setup.SexPermissionClass.Alpha = class Alpha extends setup.SexPermission {
  constructor() {
    super(
      'alpha',
      [  /* tags */
      ],
      [  /* disallowed tags */
        'endsex',
        'positionother',
        'poseother',
        'equipmentother',
        'penetrationendsub',
      ],
    )
  }
}

setup.sexpermission.alpha = new setup.SexPermissionClass.Alpha()
