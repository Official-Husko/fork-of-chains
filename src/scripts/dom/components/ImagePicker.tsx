import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import type { TraitKey } from "../../classes/trait/Trait";
import {
  openUnitCustomImagesDir,
  resolveAsyncIterator,
} from "../../util/files";

const MODES = [
  { text: "Use image from packs", value: "packs" },
  { text: "Use custom image", value: "custom" },
] as const;

const FILTER_STATES = [
  { text: "Enabled", value: false },
  { text: "Disabled", value: true },
  { text: "All", value: null },
];

type ImageRef =
  | (ImageObject & { custom?: false; url?: string })
  | { custom: true; url?: string; path: string };

const ImageCredits: Component<{ imageInfo: ImageObject["info"] }> = (props) => {
  let divRef: HTMLDivElement | undefined;

  createEffect(() => {
    const info = props.imageInfo;
    if (divRef) {
      while (divRef.firstChild) {
        divRef.removeChild(divRef.firstChild);
      }
      const node = setup.DOM.Util.Image.credits(info);
      if (node) {
        divRef.appendChild(node);
      }
    }
  });

  return <div ref={divRef} />;
};

export const ImagePicker: Component<{ unit: Unit }> = (props) => {
  const unit_pack_images = State.variables.unitimage.getImagesByTraitSet(
    props.unit,
    true,
  );
  const [getAllCustomImages, setAllCustomImages] = createSignal<
    ImageRef[] | null | undefined
  >(undefined);

  const [getMode, setMode] = createSignal<(typeof MODES)[number]["value"]>(
    props.unit.custom_image_name ? "custom" : "packs",
  );

  const [getPackImagePath, setPackImagePath] = createSignal(
    (props.unit && State.variables.unitimage.getImagePath(props.unit)) || null,
  );
  const [getCustomImagePath, setCustomImagePath] = createSignal(
    props.unit.custom_image_name || "",
  );

  const [getCustomImageIsInvalid, setCustomImageIsInvalid] =
    createSignal(false);

  // reset valid state after changing the custom image path
  createEffect(() => (getCustomImagePath(), setCustomImageIsInvalid(false)));

  const randomizeVisitedPackImages = createSignal<Record<string, true>>({});
  const randomizeVisitedCustomImages = createSignal<Record<string, true>>({});

  const [getFilterString, setFilterString] = createSignal("");
  const [getFilterState, setFilterState] = createSignal<boolean | null>(false);

  let thumbnailsRef: HTMLDivElement | undefined;

  const scrollSelectedThumbnailIntoView = () => {
    const path =
      getMode() === "custom" ? getCustomImagePath() : getPackImagePath();
    if (path && thumbnailsRef) {
      const thumbnail = [...thumbnailsRef.children].find(
        (it) => it.getAttribute("data-path") === path,
      );
      if (thumbnail) {
        thumbnail.scrollIntoView();
      }
    }
  };

  const getSelectedImageInfo = createMemo(() => {
    if (getMode() === "packs") {
      const image_path = getPackImagePath();
      if (image_path) {
        return setup.UnitImage.getImageObject(image_path)?.info;
      }
    }
    return undefined;
  });

  const [getDisabledImagesModified, setDisabledImagesModified] =
    createSignal(true);

  const isImageDisabled = (image_path: string) => {
    getDisabledImagesModified();
    return State.variables.unitimage.isImageIgnored(image_path);
  };

  const setImageDisabled = (image_path: string, value: boolean) => {
    State.variables.unitimage.setImageIgnored(image_path, value);
    setDisabledImagesModified(!getDisabledImagesModified());
  };

  const getFilterStateCounts = createMemo(() => {
    const counts = new Array(FILTER_STATES.length).fill(0);
    for (const group of unit_pack_images) {
      counts[2] += group.images.length;
      for (const image_object of group.images) {
        const state = isImageDisabled(image_object.path);
        counts[state ? 1 : 0] += 1;
      }
    }
    return counts;
  });

  //let filter_string = unit_identity.replace(/\|/g, ' ').replace(/_/g, ':')

  //const filter_strings = filter_string.trim().split(/\s+/).map(s => s.toLowerCase().replace(/:/g, '_'))
  //if (!filter_strings[0])
  //filter_strings.length = 0

  const getSelectedImageUrl = () => {
    if (getMode() === "custom") {
      const customImagePath = getCustomImagePath();
      const url = setup.isAbsoluteUrl(customImagePath)
        ? customImagePath
        : "img/customunit/" + customImagePath;
      return url;
    } else {
      return getPackImagePath() ?? undefined;
    }
  };

  function getCssImageFallbacks(url: string | null | undefined) {
    if (!url) return undefined;
    const png_fallback = url.replace(/\.[^/]+$/, ".png");
    return `url(${JSON.stringify(setup.escapeHtml(url))}), url(${JSON.stringify(setup.escapeHtml(png_fallback))})`;
  }

  const getVisibleThumbnails = createMemo(
    (): Array<{ title: string | null; images: ImageRef[] }> => {
      if (getMode() == "packs") {
        const filter_state = getFilterState();
        return unit_pack_images
          .map((group) => {
            return {
              title: group.traits
                .map((trait_key) =>
                  setup.capitalizeWords(
                    setup.trait[trait_key as TraitKey]?.name ?? trait_key,
                  ),
                )
                .join(" • "),
              traits: group.traits,
              images: group.images.filter((image_object) => {
                if (
                  filter_state !== null &&
                  isImageDisabled(image_object.path) !== filter_state
                )
                  return false;
                return true;
              }),
            };
          })
          .filter((group) => group.images.length)
          .sort((a, b) => {
            if (a.traits.length != b.traits.length)
              return b.traits.length - a.traits.length;
            return a.title.localeCompare(b.title);
          });
      } else {
        let images = getAllCustomImages() ?? [];
        const filter_string = getFilterString().toLowerCase();
        if (filter_string) {
          images = images.filter((entry) => {
            if (
              filter_string &&
              entry.path.toLowerCase().indexOf(filter_string) === -1
            )
              return false;
            return true;
          });
        }
        return [
          {
            title: null,
            images,
          },
        ];
      }
    },
  );

  const isSelected = (image_ref: ImageRef) => {
    switch (getMode()) {
      case "custom":
        return image_ref.custom && image_ref.path === getCustomImagePath();
      case "packs":
        return !image_ref.custom && image_ref.path === getPackImagePath();
    }
  };

  const refreshCustomImagesList = (silently: boolean) => {
    openUnitCustomImagesDir(silently).then((rootDirHandle) => {
      if (!rootDirHandle) {
        setAllCustomImages(null);
        return;
      }

      const promises: Promise<unknown>[] = [];
      const custom_images: ImageRef[] = [];

      function processDir(
        dirHandle: FileSystemDirectoryHandle,
        basePath?: string,
      ) {
        return resolveAsyncIterator(dirHandle.entries()).then((entries) => {
          for (const [key, entry] of entries) {
            const entryPath = (basePath ? basePath + "/" : "") + entry.name;
            if (entry.kind == "directory") {
              promises.push(
                processDir(entry as FileSystemDirectoryHandle, entryPath),
              );
            } else if (entry.name !== "putyourimageshere") {
              custom_images.push({
                custom: true,
                path: entryPath,
                url: setup.isAbsoluteUrl(entryPath)
                  ? entryPath
                  : "img/customunit/" + entryPath,
              });
            }
          }
        });
      }

      promises.push(processDir(rootDirHandle));

      Promise.all(promises).then(() => {
        setAllCustomImages(
          custom_images.sort((a, b) =>
            (a.path ?? "").localeCompare(b.path ?? ""),
          ),
        );
      });
    });
  };

  refreshCustomImagesList(true);

  // Note: use CSS background-image instead of <img>, because when hidden,
  // background-image is not loaded until shown, whereas for img it is
  // And with hundreds of images, this does matter

  return (
    <div class="dialog-imagepicker-container">
      <header style="display: flex">
        <span class="dialog-imagepicker-filters">
          <Show when={getMode() == "packs"}>
            Show: &nbsp;
            <For each={FILTER_STATES}>
              {(entry, getIndex) => (
                <button
                  class={getFilterState() === entry.value ? "selected" : ""}
                  onClick={() => setFilterState(entry.value)}
                >
                  {entry.text + " (" + getFilterStateCounts()[getIndex()] + ")"}
                </button>
              )}
            </For>
          </Show>
        </span>
        <div style="flex-grow: 1"></div>
        Source: &nbsp;
        <span class="dialog-imagepicker-modes">
          <For each={MODES}>
            {(mode) => (
              <button
                class={getMode() === mode.value ? "selected" : ""}
                onClick={() => setMode(mode.value)}
              >
                {mode.text}
              </button>
            )}
          </For>
        </span>
      </header>

      <div class="dialog-imagepicker-leftpane">
        <header>
          <Show when={getMode() == "custom"}>
            <div>
              <span>Custom image path:</span>
              <input
                type="text"
                value={getCustomImagePath()}
                style={{
                  width: "100%",
                  "box-sizing": "border-box",
                }}
                onInput={(ev) => {
                  if (getMode() !== "custom") setMode("custom");
                  setCustomImagePath(ev.target.value);
                }}
              />
            </div>

            <Show when={getAllCustomImages() === null}>
              <div
                style={{
                  margin: "1em",
                  "margin-top": "3em",
                }}
              >
                <div
                  style={{
                    "font-size": "smaller",
                  }}
                >
                  To see the list of your custom images here, you need to give
                  permission to the browser by click the following button and
                  picking the{" "}
                  <span class="successtextlite">dist/img/customunit</span>{" "}
                  folder.
                </div>

                <button onClick={() => refreshCustomImagesList(false)}>
                  Open "customunit" folder...
                </button>
              </div>
            </Show>
          </Show>
        </header>

        <div class="thumbnails" ref={thumbnailsRef}>
          <For
            each={getVisibleThumbnails()}
            fallback={
              <Show when={getMode() !== "custom" || !!getAllCustomImages()}>
                <small style={{ "margin-top": "1em" }}>No images found</small>
              </Show>
            }
          >
            {(group) => (
              <>
                <Show when={group.title}>
                  <header>{group.title}</header>
                </Show>
                <For each={group.images}>
                  {(entry) => (
                    <div
                      data-path={entry.path}
                      classList={{
                        selected: isSelected(entry),
                        disabled: !entry.custom
                          ? isImageDisabled(entry.path)
                          : undefined,
                      }}
                      style={{
                        "background-image": getCssImageFallbacks(
                          entry.url ?? entry.path,
                        ),
                      }}
                      onClick={() => {
                        if (entry.custom) {
                          setCustomImagePath(entry.path);
                        } else {
                          setPackImagePath(entry.path);
                        }
                      }}
                    />
                  )}
                </For>
              </>
            )}
          </For>
        </div>

        <Show when={getMode() === "custom"}>
          <footer>
            <Show when={getAllCustomImages()}>
              <div
                style={{
                  display: "grid",
                  "grid-template-columns": "1fr auto",
                  gap: "1em",
                }}
              >
                <div>
                  <input
                    type="text"
                    placeholder="Search in custom images..."
                    value={getFilterString()}
                    onInput={(ev) => setFilterString(ev.target.value)}
                  />
                </div>

                <button onClick={() => refreshCustomImagesList(false)}>
                  Refresh list
                </button>
              </div>
            </Show>
          </footer>
        </Show>
      </div>

      <aside class="dialog-imagepicker-preview">
        <figure>
          <Show when={getPackImagePath()}>
            <div
              class={
                getMode() === "custom" && getCustomImageIsInvalid()
                  ? "error"
                  : undefined
              }
              style={{
                "background-image":
                  getMode() !== "custom"
                    ? getCssImageFallbacks(getSelectedImageUrl())
                    : getCustomImageIsInvalid()
                      ? `url(${JSON.stringify(setup.UnitImage.DEFAULT_IMAGE.path)})`
                      : undefined,
              }}
            >
              <Show when={getMode() === "custom"}>
                <Show
                  when={getCustomImagePath()}
                  fallback={
                    <div>
                      <div>No custom image selected</div>

                      <footer
                        style={{
                          "font-size": "smaller",
                          "text-align": "left",
                          padding: "0 2em",
                        }}
                      >
                        <b>How to use a custom image:</b>

                        <p>
                          Put your image in the{" "}
                          <span class="successtext">dist/img/customunit</span>{" "}
                          folder. Then, enter the filename in the text box on
                          the left. For example, if you have an image located at{" "}
                          <span class="successtextlite">
                            dist/img/customunit/girl.png
                          </span>{" "}
                          file, then write{" "}
                          <span class="successtextlite">girl.png</span>.
                        </p>

                        <p>
                          Alternatively, you can also drag and drop the image
                          into this dialog, or also directly to the unit details
                          screen. However, the image must still be located in
                          the{" "}
                          <span class="successtextlite">
                            dist/img/customunit
                          </span>{" "}
                          folder.
                        </p>
                      </footer>
                    </div>
                  }
                >
                  <img
                    src={getSelectedImageUrl()}
                    onError={(ev) => setCustomImageIsInvalid(true)}
                  />
                </Show>
                <Show when={getCustomImageIsInvalid()}>
                  <div>
                    <div>
                      <div>Failed to load custom image:</div>
                      <div>{getSelectedImageUrl()}</div>
                    </div>
                  </div>
                </Show>
              </Show>
            </div>

            <figcaption>
              <Show when={getSelectedImageInfo() != null}>
                <ImageCredits imageInfo={getSelectedImageInfo() ?? {}} />
              </Show>
              <Show when={State.variables.gDebug}>
                <div class="graytext" style={{ "word-break": "break-all" }}>
                  {getSelectedImageUrl()}
                </div>
              </Show>
            </figcaption>
          </Show>
        </figure>

        <footer class="dialog-buttons">
          <div class="dialog-imagepicker-ignorebtn">
            <Show when={getMode() === "packs" && getPackImagePath()}>
              <button
                onClick={() => {
                  const image_path = getPackImagePath()!;
                  //console.log("PRE", isImageDisabled(image_path), image_path);
                  setImageDisabled(image_path, !isImageDisabled(image_path));
                  //console.log("POST", isImageDisabled(image_path), image_path);
                  setup.DOM.refresh(".dialog-imagepicker-ignorebtn");
                }}
              >
                <i
                  class={`sfa ${isImageDisabled(getPackImagePath()!) ? "sfa-times-circle" : "sfa-check-circle"}`}
                />
                Eligible in generation
              </button>
            </Show>
          </div>
          <div style="flex-grow: 1"></div>
          <button
            onClick={() => {
              const mode = getMode();

              const eligible_images =
                mode === "custom"
                  ? (getAllCustomImages() ?? [])
                  : unit_pack_images.flatMap((x) =>
                      x.images.filter((x) => !isImageDisabled(x.path)),
                    );
              if (!eligible_images.length) return;

              const [getVisitedImagePaths, setVisitedImagePaths] =
                mode === "custom"
                  ? randomizeVisitedCustomImages
                  : randomizeVisitedPackImages;

              let visited_images = { ...getVisitedImagePaths() };
              let unvisited_images = eligible_images.filter(
                (x) => !visited_images[x.path],
              );
              if (!unvisited_images.length) {
                visited_images = {};
                unvisited_images = eligible_images;
              }

              const image_path = setup.rng.choice(unvisited_images).path;
              visited_images[image_path] = true;
              setVisitedImagePaths(visited_images);
              if (mode === "custom") {
                setCustomImagePath(image_path);
              } else {
                setPackImagePath(image_path);
              }
              setTimeout(scrollSelectedThumbnailIntoView, 1);
            }}
          >
            Randomize
          </button>
          &nbsp;
          <button
            disabled={getMode() === "custom" && !getCustomImagePath()}
            onClick={() => {
              if (getMode() === "custom" && getCustomImagePath()) {
                props.unit.custom_image_name =
                  getCustomImagePath() || undefined;
              } else {
                props.unit.custom_image_name = undefined;
                State.variables.unitimage.setImage(
                  props.unit,
                  getPackImagePath()!,
                );
              }
              Dialog.close();
            }}
          >
            OK
          </button>
          <button
            onClick={() => {
              Dialog.close();
            }}
          >
            Cancel
          </button>
        </footer>
      </aside>
    </div>
  );
};
