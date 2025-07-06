// @ts-nocheck

// TODO: Generalize this to enable tracking arbitrary quests across NG+
setup.qresImpl.NoRegalixir = class NoRegalixir extends setup.Restriction {
    constructor() {
        super()
    }

    text() {
        return `setup.qres.NoRegalixir()`
    }

    explain() {
        return `Player must not have used Regalixir previously (Including before New Game Plus)`
    }

    isOk() {
        return !State.variables.statistics.regalixir_completed_previous_games
    }
}
