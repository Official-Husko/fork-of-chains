setup.SexPermissionClass.None = class None extends setup.SexPermission {
  constructor() {
    super(
      'none',
      [  /* tags */
      ],
      [  /* disallowed tags */
        'endsex',
        'positionself',
        'positionother',
        'poseself',
        'poseother',
        'equipmentself',
        'equipmentother',
        'penetrationstartdom',
        'penetrationstartsub',
        'penetrationenddom',
        'penetrationendsub',
      ],
    )
  }
}

setup.sexpermission.none = new setup.SexPermissionClass.None()
