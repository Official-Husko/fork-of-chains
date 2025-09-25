import { For, Show, createMemo, createSignal } from "solid-js";
import {
  Button,
  Help,
  Link,
  Message,
  Text,
  Textbox,
  ToggleSwitch,
} from "../common";
import "./ImagepacksManagement.css";

export const ImagepacksManagement: Component = () => {
  const [getNewName, setNewName] = createSignal("");

  const [getExampleImagesReroll, setExampleImagesReroll] = createSignal(0);

  const [isLoading, setIsLoading] = createSignal(
    !!setup.UnitImage.loading_promise,
  );

  const [getCurrentPacks, setCurrentPacks] = createSignal(
    setup.globalsettings.imagepacks || [],
  );

  const getAllPacks = () =>
    setup.UnitImage.DEFAULT_IMAGE_PACKS_SHOWN.concat(
      getCurrentPacks().filter(
        (it) => !setup.UnitImage.DEFAULT_IMAGE_PACKS_SHOWN.includes(it),
      ),
    );

  function onImagepacksReloadFinished() {
    setCurrentPacks(setup.globalsettings.imagepacks || []);
    setIsLoading(false);
  }

  function reloadImagepacks() {
    setIsLoading(true);
    const promise = setup.UnitImage.initializeImageTable();
    setup.UnitImage.loading_promise = promise;
    promise.then(onImagepacksReloadFinished);
  }

  function setImagePackEnabled(imagepack: string, enabled: boolean) {
    if (!enabled) {
      setup.globalsettings.imagepacks = (
        setup.globalsettings.imagepacks || []
      ).filter((a) => a !== imagepack);
    } else {
      setup.globalsettings.imagepacks = (
        setup.globalsettings.imagepacks || []
      ).concat([imagepack]);
    }
    reloadImagepacks();
  }

  if (setup.UnitImage.loading_promise) {
    setup.UnitImage.loading_promise.then(onImagepacksReloadFinished);
  }

  return (
    <>
      <div>
        Image packs provide <b>portraits or full-body images for units</b>. Here
        you can select which ones you want to use, which applies to all saves.
      </div>

      <p>
        <small>
          The list below only shows image packs that come shipped with the game,
          and image packs that have been installed. If you have a custom image
          pack and it is {Text.danger("not installed")}, you have to manually
          add it by clicking (add image pack).
        </small>
      </p>

      <div class="ImagepacksManagement-subheader">
        <Message label="(add image pack)">
          <div class="helpcard">
            <div>
              Enter the image pack name or url:{" "}
              <Help>
                <p>
                  If the image pack is not a URL, then put the image pack in the
                  "imagepack" directory. For example, you it should look like
                  "imagepack/myimagepack". Then put "myimagepack" here. As an
                  example, try putting "example" below to load the example
                  imagepack, which should be located at "imagepack/example" by
                  default.
                </p>

                <p>If it's a URL, then just put the entire URL.</p>

                <p>
                  <a
                    target="_blank"
                    href={`${setup.REPO_URL}/-/blob/master/docs/images.md#creating-your-own-image-pack`}
                  >
                    How to create a new image pack
                  </a>
                </p>
              </Help>
            </div>
            <p>
              <Textbox
                value={getNewName()}
                onChange={(value) => setNewName(value)}
              />
              <Button
                onClick={() => {
                  let trimmed = getNewName().trim();
                  if (trimmed) {
                    if (!setup.isAbsoluteUrl(trimmed)) {
                      trimmed = `${setup.UnitImage.IMAGEPACK_DIR_NAME}/${trimmed}`;
                    }
                    setup.globalsettings.imagepacks = [
                      ...(setup.globalsettings.imagepacks || []),
                      trimmed,
                    ];
                  }
                  reloadImagepacks();
                }}
              >
                Add
              </Button>
            </p>

            <Show when={setup.FileUtil.supportsDirectoryPicker()}>
              <p>
                Alternatively, you can click the following button and browse to
                the "imagepacks" folder inside the game directory, to
                automatically detect and add all image packs found there:{" "}
                <Button
                  onClick={() => {
                    setup.FileUtil.autodetectImagePacks().then(() =>
                      setup.DOM.Nav.goto(),
                    );
                  }}
                >
                  Select imagepacks folder...
                </Button>
              </p>
            </Show>
          </div>
        </Message>
        <Link
          onClick={() => {
            setExampleImagesReroll(getExampleImagesReroll() + 1);
          }}
        >
          (reroll sample images)
        </Link>
        <Show when={isLoading()}>
          <span>
            {` Reloading image packs  `}
            <progress />
          </span>
        </Show>
      </div>

      <br />

      <div class="ImagepacksManagement-cards">
        <For
          each={getAllPacks()}
          fallback={
            <p>
              <small>No packs installed</small>
            </p>
          }
        >
          {(imagepack) => {
            const isActive = () => getCurrentPacks().includes(imagepack);
            const meta = () => setup.UnitImage.getImagePackMetadata(imagepack);

            const stats = createMemo(() => {
              getExampleImagesReroll(); // subscribe to this signal
              let males = 0;
              let females = 0;
              let images: ImageObject[] = [];
              const imagepack_url = meta()?.url;
              if (imagepack_url) {
                images = Object.values(setup.UnitImage.UNIT_IMAGES).filter(
                  (it) => {
                    if (it.path.startsWith(imagepack_url)) {
                      if (it.path.includes("gender_male")) males += 1;
                      else if (it.path.includes("gender_female")) females += 1;
                      return true;
                    }
                    return false;
                  },
                );
              }
              return { males, females, images };
            });
            const exampleImages = createMemo(() => {
              const imgs = [...stats().images];

              setup.rng.shuffleArray(imgs);
              return imgs.slice(0, 6);
            });

            return (
              <div
                class={
                  getCurrentPacks().includes(imagepack)
                    ? "card activeimagepackcard"
                    : "card inactiveimagepackcard"
                }
              >
                <header>
                  <div>
                    <Show
                      when={meta()}
                      fallback={Text.dangerlite("Unable to load image pack")}
                    >
                      <span>
                        <b>{meta()?.title || "Unnamed pack"}</b> by{" "}
                        <i>{meta()?.author || "unknown"}</i>
                      </span>
                    </Show>
                  </div>

                  <div>
                    <Show
                      when={
                        !setup.UnitImage.DEFAULT_IMAGE_PACKS_SHOWN.includes(
                          imagepack,
                        )
                      }
                      fallback={
                        <ToggleSwitch
                          color="green"
                          value={isActive()}
                          onChange={(value) =>
                            setImagePackEnabled(imagepack, value)
                          }
                          disabled={isLoading()}
                        />
                      }
                    >
                      <Link
                        onClick={() => setImagePackEnabled(imagepack, false)}
                        disabled={isLoading()}
                      >
                        (remove)
                      </Link>
                    </Show>
                  </div>
                </header>
                <div>
                  <div>
                    <div>
                      <span class="lightgraytext">
                        {meta()?.numimages} images · {stats().males} male ·{" "}
                        {stats().females} female
                      </span>
                    </div>
                    <Show when={meta()}>
                      <div class="lightgraytext">
                        {meta()?.description || ""}
                      </div>
                    </Show>
                  </div>
                  <div>
                    <small class="lightgraytext">
                      {"Located at: "}
                      <span style={{ color: "darkkhaki" }}>{imagepack}</span>
                    </small>
                  </div>
                  <aside class="ImagepacksManagement-exampleimgs">
                    <For each={exampleImages()}>
                      {(imgobj) => (
                        <img
                          src={imgobj.path}
                          onClick={(ev) => {
                            ev.currentTarget.classList.toggle("img-fullscreen");
                            //setup.Dialogs.openImage(
                            //  imgobj,
                            //  imgobj.info.title || "Unknown Title",
                            //);
                          }}
                        />
                      )}
                    </For>
                  </aside>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </>
  );
};

/**
 * Used by prologue
 */
export default function () {
  return setup.DOM.renderComponent(ImagepacksManagement);
}
