import { For, Show, createMemo, createSignal } from "solid-js"
import { Text, Button, Help, Link, Message, Textbox, ToggleSwitch } from "../../components/common"
import { MODS_DIR_NAME, MOD_PACKED_EXTENSION, MOD_UNPACKED_MANIFEST_FILE, ModManager, ModManagerClass } from "../../../util/modmanager"
import "../../menu/settings/settings.js"
import { openModsDir, openUnpackedModDir, resolveAsyncIterator, savePackedModFile } from "../../../util/files"

/** @type {Component} */
export const ModsManagement = () => {

  const [isLoading, setIsLoading] = createSignal(!!ModManager.reloading_promise)
  const [isDevMode, setIsDevMode] = createSignal(false)
  
  const [getNewName, setNewName] = createSignal('')

  const [getInstalledMods, setInstalledMods] = createSignal(setup.globalsettings.mods_installed || [])
  const [getInstalledModsInfo, setInstalledModsInfo] = createSignal(ModManager.mods)
  const [getEnabledMods, setEnabledMods] = createSignal(State.variables.mods || [])

  function onModsReloadFinished() {
    setInstalledModsInfo(ModManager.mods)
    setIsLoading(false)
  }

  if (ModManager.reloading_promise) {
    ModManager.reloading_promise.then(onModsReloadFinished)
  }
  
  function reloadModsInfo() {
    if (!ModManager.reloading_promise) {
      setIsLoading(true)
      ModManager.reloadMods().then(onModsReloadFinished)
    }
  }

  /**
   * @param {string} mod_path_raw
   */
  function installMod(mod_path_raw) {
    let mod_path = mod_path_raw.trim()
    const mods_dir_prefix = `${MODS_DIR_NAME}/`
    if (mod_path.startsWith(mods_dir_prefix))
      mod_path = mod_path.substring(mods_dir_prefix.length)
    if (mod_path) {
      if (!mod_path.endsWith(MOD_PACKED_EXTENSION))
        mod_path += MOD_PACKED_EXTENSION
      if (mod_path.endsWith('/'))
        mod_path = mod_path.substring(0, mod_path.length - 1)
      const mods_installed = setup.globalsettings.mods_installed || []
      if (!mods_installed.includes(mod_path)) {
        setup.globalsettings.mods_installed = [...mods_installed, mod_path]
        setInstalledMods(setup.globalsettings.mods_installed)
        reloadModsInfo()
      }
    }
  }

  /**
   * @param {string} mod_path
   */
  function uninstallMod(mod_path) {
    const mods_installed = (setup.globalsettings.mods_installed || [])
    setup.globalsettings.mods_installed = mods_installed.filter(a => a !== mod_path)
    setInstalledMods(setup.globalsettings.mods_installed)
  }

  function autoinstallMods() {
    return openModsDir().then((mods_dir_handle) => {
      if (!mods_dir_handle)
        return

      return resolveAsyncIterator(mods_dir_handle.entries()).then((entries) => {
        const mods_installed = [...(setup.globalsettings.mods_installed || [])]
        if (entries.some(([k, v]) => {
          if (v.kind === 'file' && v.name.endsWith(MOD_PACKED_EXTENSION) && !mods_installed.includes(v.name)) {
            mods_installed.push(v.name)
            return true
          }
          return false
        })) {
          setup.globalsettings.mods_installed = mods_installed
          setInstalledMods(mods_installed)
          reloadModsInfo()
        }
      })
    })
  }

  function installUnpackedMod() {
    return openUnpackedModDir().then((dir_handle) => {
      if (!dir_handle)
        return
  
      return dir_handle.getFileHandle(MOD_UNPACKED_MANIFEST_FILE)
        .then((manifest_handle) => {
          const mod_path = dir_handle.name
          ModManager.mods_unpacked[mod_path] = dir_handle

          const mods_installed = [...(setup.globalsettings.mods_installed || [])]
          if (!mods_installed.includes(mod_path)) {
            mods_installed.push(mod_path)
            setup.globalsettings.mods_installed = mods_installed
            setInstalledMods(mods_installed)
          }
          reloadModsInfo()
        })
        .catch(() => alert(`Directory ${dir_handle.name} does not contain a "${MOD_UNPACKED_MANIFEST_FILE}" file`))
    })
  }

  /**
   * @param {string} mod_path
   */
  function toggleMod(mod_path) {
    const mods_enabled = getEnabledMods()
    if (mods_enabled.includes(mod_path)) {
      State.variables.mods = mods_enabled.filter(p => p !== mod_path)
    } else {
      State.variables.mods = [...mods_enabled, mod_path]
    }
    ModManager.reapplyMods()
    setEnabledMods(State.variables.mods || [])
  }

  /**
   * 
   * @param {Exclude<ModManager['mods'][''], undefined>} mod 
   * @returns 
   */
  function generatePackedModCode(mod) {
    const { data, errors, ...definition } = mod
    return `FocMod(${JSON.stringify(definition)})`
  }

  /**
   * @param {string} mod_path
   */
  function packMod(mod_path) {
    const mod = ModManager.mods[mod_path]
    const dir_handle = ModManager.mods_unpacked[mod_path]
    if (mod) {
      const target_filename = `${dir_handle?.name ?? mod.key ?? 'unnamed_mod'}${MOD_PACKED_EXTENSION}`

      return savePackedModFile(target_filename, generatePackedModCode(mod))
        .then((res) => {
          if (res !== null) { // not cancelled by user
            alert(`Succesfully save packed mod as "${target_filename}"`)
          }
        }, (err) => {
          alert(`Failed to save the packed mod: ${String(err)}`)
        })
    }
  }

  return (
    <>
      <div>
        <b>Disclaimer: <b class="dangertextlite">mod support is experimental</b>, it might break the game</b>
      </div>
      <div>
        <small>
          The list below only shows mods which have been installed. Mods are installed globally, but can be enabled or disabled in a per-save basis.
        </small>
      </div>

      <div style={{ display: 'grid', "grid-template-columns": '1fr auto', "align-items": 'flex-start', gap: '1em'  }}>
        <p>
          <Message label="(install new mod)">
            <div class='helpcard'>
              <div>
                Enter the mod filename or url:{' '}
                <Help>
                  <p>
                    If the mod is not a URL, then put the mod in the
                    "{MODS_DIR_NAME}" directory. For example, you it should look like "{MODS_DIR_NAME}/mymod".
                    Then put "mymod" here.
                    As an example, try putting "example" below to load the example mod,
                    which should be located at "{MODS_DIR_NAME}/example" by default.
                  </p>

                  <p>
                    If it's a URL, then just put the entire URL.
                  </p>

                  <p>
                    <a target="_blank" href="https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/modding.md">
                      How to create a new mod
                    </a>
                  </p>
                </Help>
              </div>
              <div>
                <Textbox value={getNewName()} onChange={value => setNewName(value)} />
                <Button onClick={() => installMod(getNewName())}>
                  Add
                </Button>
              </div>

              <Show when={setup.FileUtil.supportsDirectoryPicker()}>
                <p>
                  Alternatively, you can click the following button and browse to the "mods" folder inside the game directory, to automatically detect and install (but not enable) all mods found there:{' '}
                  <Button onClick={() => autoinstallMods()}>
                    Select mods folder...
                  </Button>
                </p>
              </Show>
            </div>
          </Message>

          <Show when={isDevMode()}>
            <>
              {` · `}
              <Link onClick={() => installUnpackedMod()}>
                (load unpacked mod)
              </Link>
            </>
          </Show>

          {` · `}
          <Link onClick={() => reloadModsInfo()}>
            (reload)
          </Link>
        </p>

        <p style={{ display: 'grid', "grid-template-columns": '1fr auto', "align-items": 'center', gap: '0.5em' }}>
          <span>Dev mode</span>
          <ToggleSwitch
            value={isDevMode()}
            onChange={(value => setIsDevMode(value))} />
        </p>
      </div>

      <Show when={!isLoading()} fallback={
        <>
          <div>Loading mods info...</div>
          <progress />
        </>
      }>
        <div class="ModsManagement-cards">
          <For each={getInstalledMods()} fallback={
            <p>
              <small>No mods installed</small>
            </p>
          }>
            {(mod_path) => {
              const isActive = () => getEnabledMods().includes(mod_path)
              const mod = () => getInstalledModsInfo()[mod_path]
              const isOk = () => !mod()?.errors?.length
              const isUnpacked = () => !mod_path.includes('/') && !mod_path.includes('.')
              const getIconUrl = createMemo(() => {
                const files = mod()?.files
                if (files?.['icon.svg']) {
                  return `data:image/svg+xml;base64,` + btoa(files['icon.svg'])
                } else if (files?.['icon.png']) {
                  return `data:image/png;base64,` + btoa(files['icon.png'])
                } else {
                  return null
                }
              })
              const getStats = createMemo(() => {
                const stats = {
                  quests: { n: 0, label: ['quests', 'quest'] },
                  opportunities: { n: 0, label: ['opportunities', 'opportunity'] },
                  events: { n: 0, label: ['events', 'event'] },
                  interactions: { n: 0, label: ['interactions', 'interaction'] },
                  activities: { n: 0, label: ['activities', 'activity'] },
                  passages: { n: 0, label: ['passages', 'passage'] },
                }
                const data = mod()?.data
                if (data) {
                  stats.passages.n = Object.keys(data.passages).length
                  for (const [k, v] of Object.entries(data.setup)) {
                    if (v instanceof setup.QuestTemplate)
                      stats.quests.n += 1
                    if (v instanceof setup.OpportunityTemplate)
                      stats.opportunities.n += 1
                    if (v instanceof setup.Event)
                      stats.events.n += 1
                    if (v instanceof setup.Interaction)
                      stats.interactions.n += 1
                    if (v instanceof setup.ActivityTemplate)
                      stats.activities.n += 1
                  }
                }
                return Object.values(stats).filter(entry => entry.n > 0)
              })
              return (
                <div class={getEnabledMods().includes(mod_path) ? 'card activeimagepackcard' : 'card inactiveimagepackcard'}>
                  <div>
                    <header>
                      <Show when={mod()} fallback={Text.dangerlite('Unable to load mod')}>
                        <div class={"ModsManagement-modicon" + (getIconUrl() ? '' : ' default')} style={getIconUrl() ? { 'background-image': `url('${getIconUrl()}')`} : undefined} />
                        <span>
                          <b>{mod()?.name || 'Unnamed mod'}</b> (<b>{mod()?.version || 'unknown version'}</b>) by <i>{mod()?.author || 'unknown'}</i>
                          <Show when={isUnpacked()}>
                            <span style={{ "margin-left": '0.5em', color: 'khaki' }}>{` (unpacked)`}</span>
                          </Show>
                        </span>
                      </Show>
                    </header>
                    <div style={{ "padding-left": '1em' }}>
                      <Show when={mod()}>
                        <>
                          <div>{mod()?.description || '(no description)'}</div>
                          <div>
                            <small>
                              {'Includes: ' + (getStats().map((e) => `${e.n} ${e.label[e.n === 1 ? 1 : 0]}`).join(' · ') || 'unknown')}
                            </small>
                          </div>
                        </>
                      </Show>
                      <Show when={mod()?.errors?.length}>
                        <div>
                          {Text.danger(`${mod()?.errors?.length ?? 0} ${mod()?.errors?.length === 1 ? 'error' : 'errors'} loading the mod:`)}
                          <ul>
                            <For each={mod()?.errors ?? []}>{(errmsg) => (
                              <li>{Text.danger(errmsg ?? 'unknown error')}</li>
                            )}</For>
                          </ul>
                        </div>
                      </Show>
                      <div>
                        <small class="lightgraytext">
                          {'Located at: '}
                          <span style={{ color: "darkkhaki" }}>
                            {!mod_path.includes('/') ? `${MODS_DIR_NAME}/${mod_path}` : mod_path}
                          </span>
                        </small>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div style={{ "margin-bottom": '0.5em' }}>
                      <ToggleSwitch color="green"
                        value={isActive()}
                        onChange={(value => toggleMod(mod_path))}
                        disabled={!isOk()} />
                    </div>
                    <Link onClick={() => uninstallMod(mod_path)}>
                      (uninstall)
                    </Link>
                    <Show when={isDevMode() && isUnpacked()}>
                      <Link onClick={() => packMod(mod_path)}>
                        (pack mod)
                      </Link>
                    </Show>
                  </div>
                </div>
              )
            }}
          </For>
        </div>
      </Show>
    </>

  )
}
