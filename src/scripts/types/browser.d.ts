export {}

//
// Types for browser APIs or JS stuff that is not included in the default lib (yet)
//
declare global {

  interface Window {

    showDirectoryPicker: (options?: { id?: string, mode?: 'read'|'readwrite', startIn?: string }) => Promise<FileSystemDirectoryHandle>
    showSaveFilePicker: (options?: any) => Promise<FileSystemFileHandle>

  }


  interface FileSystemDirectoryHandle {
    entries(): AsyncIterator<[key: string, value: FileSystemHandle]>
  }

}
