
// Type for State.variables (SugarCube.State.variables)

// Types declared by State.variables "constructor"
declare type StateVariablesBase = InstanceType<typeof setup.initState>

// Declare additional stuff that is defined in the .twee files (hence not detected)
// It's basically stuff used in devtool
declare interface StateVariables extends StateVariablesBase {
  /** Set to true when state is initialized */
  gInitDone: boolean

  mods?: string[]

  args?: any[] & { raw?: string, full?: string, payload?: string, } // $args as used in widgets
  a?: string
  b?: string
  devqueue?: Record<string, [string, any][]>
  devtooltype: string
  g: Record<string, InstanceType<typeof setup.Unit>>
  gDebug: boolean
  gMenuVisible: boolean
  gNextpassage: string
  gOldPassage: string
  gOutcome: 'crit' | 'success' | 'failure' | 'disaster'
  gPassage: string
  gPassageName: string
  gQuest: InstanceType<typeof setup.QuestTemplate>
  gTeam: InstanceType<typeof setup.Team>
  gUnit_key: string | number
  gVersion: [number, number, number, number]
  qauthor: string
  qcosts: InstanceType<typeof setup.Cost>[]
  qcustomcriteria: InstanceType<typeof setup.UnitCriteria>[]
  qcustomslaveorder: InstanceType<typeof setup.SlaveOrderFlex>[]
  qcustomtitle: InstanceType<typeof setup.Title>[]
  qcustomunitgroup: InstanceType<typeof setup.UnitGroup>[]
  qdesc: string
  qDevTool: boolean
  qdiff: InstanceType<typeof setup.QuestDifficulty> | null
  qexpires: number
  qname: string
  qoutcomedesc: string[]
  qoutcomes: InstanceType<typeof setup.Cost>[][]
  qPassageName: string
  qpool: InstanceType<typeof setup.QuestPool>
  qrarity: number
  qrestrictions: InstanceType<typeof setup.Restriction>[]
  qrolename: string
  qscrolly: number | undefined
  qtags: string[]
  qunfulfilled: InstanceType<typeof setup.Cost>[]
  qweeks: number
}
