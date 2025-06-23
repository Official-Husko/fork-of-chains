import { For, Show, createSignal } from "solid-js"
import { Text, Button, Help, Link, Message, Textbox, ToggleSwitch } from "../../components/common"

/** @type {Component} */
export const ImagepacksManagement = () => {

  const [getNewName, setNewName] = createSignal('')

  const [isLoading, setIsLoading] = createSignal(!!setup.UnitImage.loading_promise)

  const [getCurrentPacks, setCurrentPacks] = createSignal(setup.globalsettings.imagepacks || [])
  
  const getAllPacks = () => (
    setup.UnitImage.DEFAULT_IMAGE_PACKS_SHOWN
      .concat(getCurrentPacks().filter(it => !setup.UnitImage.DEFAULT_IMAGE_PACKS_SHOWN.includes(it)))
  )

  function onImagepacksReloadFinished() {
    setCurrentPacks(setup.globalsettings.imagepacks || [])
    setIsLoading(false)
  }

  function reloadImagepacks() {
    setIsLoading(true)
    const promise = setup.UnitImage.initializeImageTable()
    setup.UnitImage.loading_promise = promise
    promise.then(onImagepacksReloadFinished)
  }

  /**
   * @param {string} imagepack
   * @param {boolean} enabled
   */
  function setImagePackEnabled(imagepack, enabled) {
    if (!enabled) {
      setup.globalsettings.imagepacks = (setup.globalsettings.imagepacks || []).filter(a => a !== imagepack)
    } else {
      setup.globalsettings.imagepacks = (setup.globalsettings.imagepacks || []).concat([imagepack])
    }
    reloadImagepacks()
  }

  if (setup.UnitImage.loading_promise) {
    setup.UnitImage.loading_promise.then(onImagepacksReloadFinished)
  }

  return (
    <>
      <div>
        <b>Note:</b> image pack settings are shared by all saves
      </div>
    
      <p>
        <small>
          The list below only shows image packs that comes shipped with the game,
          and image packs that have been added. If you have a custom image pack
          and it is {Text.danger('not installed')}, you have to manually add it by clicking (add image pack).
        </small>
      </p>

      <div style={{ display: 'grid', "grid-template-columns": '1fr auto' }}>
        <Message label="(add image pack)">
          <div class='helpcard'>
            <div>
              Enter the image pack name or url:{' '}
              <Help>
                <p>
                  If the image pack is not a URL, then put the image pack in the
                  "imagepack" directory. For example, you it should look like "imagepack/myimagepack".
                  Then put "myimagepack" here.
                  As an example, try putting "example" below to load the example imagepack,
                  which should be located at "imagepack/example" by default.
                </p>

                <p>
                  If it's a URL, then just put the entire URL.
                </p>

                <p>
                  <a target="_blank" href="https://gitgud.io/darkofocdarko/fort-of-chains/-/blob/master/docs/images.md#creating-your-own-image-pack">
                    How to create a new image pack
                  </a>
                </p>
              </Help>
            </div>
            <p>
              <Textbox value={getNewName()} onChange={value => setNewName(value)} />
              <Button onClick={() => {
                let trimmed = getNewName().trim()
                if (trimmed) {
                  if (!setup.isAbsoluteUrl(trimmed)) {
                    trimmed = `${setup.UnitImage.IMAGEPACK_DIR_NAME}/${trimmed}`
                  }
                  setup.globalsettings.imagepacks = [
                    ...(setup.globalsettings.imagepacks || []), trimmed
                  ]
                }
                reloadImagepacks()

              }}>
                Add
              </Button>
            </p>

            <Show when={setup.FileUtil.supportsDirectoryPicker()}>
              <p>
                Alternatively, you can click the following button and browse to the "imagepacks" folder inside the game directory, to automatically detect and add all image packs found there:{' '}
                <Button onClick={() => {
                  setup.FileUtil.autodetectImagePacks().then(
                    () => setup.DOM.Nav.goto()
                  )
                }}>
                  Select imagepacks folder...
                </Button>
              </p>
            </Show>
          </div>
        </Message>
        <Show when={isLoading()}>
          <span>
            {` Reloading image packs  `}
            <progress />
          </span>
        </Show>
      </div>

      <br/>

      <div class="ImagepacksManagement-cards">
        <For each={getAllPacks()} fallback={
          <p>
            <small>No packs installed</small>
          </p>
        }>
          {(imagepack) => {
            const isActive = () => getCurrentPacks().includes(imagepack)
            const meta = () => setup.UnitImage.getImagePackMetadata(imagepack)
            return (
              <div class={getCurrentPacks().includes(imagepack) ? 'card activeimagepackcard' : 'card inactiveimagepackcard'}>
                <div>
                  <header>
                    <Show when={meta()} fallback={Text.dangerlite('Unable to load image pack')}>
                      <span>
                        <b>{meta()?.title || 'Unnamed pack'}</b> by <i>{meta()?.author || 'unknown'}</i>
                      </span>
                    </Show>
                  </header>
                  <div style={{ "padding-left": '1em' }}>
                    <Show when={meta()}>
                      <div class="lightgraytext">
                        {meta()?.description || ''}
                      </div>
                    </Show>
                    <div>
                      <small class="lightgraytext">
                        {'Located at: '}
                        <span style={{ color: "darkkhaki" }}>{imagepack}</span>
                      </small>
                    </div>
                  </div>
                </div>
                <div>
                  <Show when={!setup.UnitImage.DEFAULT_IMAGE_PACKS_SHOWN.includes(imagepack)} fallback={
                    <ToggleSwitch color="green"
                      value={isActive()}
                      onChange={(value => setImagePackEnabled(imagepack, value))}
                      disabled={isLoading()} />
                  }>
                    <Link onClick={() => setImagePackEnabled(imagepack, false)} disabled={isLoading()}>
                      (remove)
                    </Link>
                  </Show>
                  <div>
                    <span class="lightgraytext">{meta()?.numimages} images</span>
                  </div>
                </div>
              </div>
            )
          }}
        </For>
      </div>
    </>
  )
}

/**
 * Used by prologue
 * @returns {setup.DOM.Node}
 */
setup.DOM.Menu.Settings.imagepacks = function () {
  return setup.DOM.renderComponent(ImagepacksManagement)
}
