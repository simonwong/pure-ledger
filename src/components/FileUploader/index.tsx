import { Button } from "@easy-shadcn/react";
import { Loader2Icon, UploadIcon } from "lucide-react";
import * as React from "react";
import { ImageList } from "@/components/ImageList";
import { removeStorageFile, saveFileByLedgerId } from "@/lib/storageFile";

interface FileUploaderProps {
  ledgerId: string;
  value?: string[];
  onChange?: (filePaths: string[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  ledgerId,
  value,
  onChange,
}) => {
  const [loading, setLoading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClickUpload = async () => {
    fileInputRef.current?.click();
    // const selected = await open({
    //   multiple: true,
    //   filters: [
    //     {
    //       name: "Image",
    //       extensions: ["png", "jpeg", "jpg", "svg"],
    //     },
    //   ],
    // });
    // console.log("selected", selected);
    // if (Array.isArray(selected)) {
    //   // user selected multiple files
    // } else if (selected === null) {
    //   // user cancelled the selection
    // } else {
    //   // user selected a single file
    // }
  };

  const handleChangeFileUpload: React.ChangeEventHandler<
    HTMLInputElement
  > = async (e) => {
    if (e.target.files) {
      const file = e.target.files[0];

      setLoading(true);
      try {
        const path = await saveFileByLedgerId(file, ledgerId);
        onChange?.([...(value || []), path]);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemoveFile = (idx: number) => {
    const path = value?.[idx];
    let filePaths = value ? [...value] : [];
    filePaths.splice(idx, 1);
    onChange?.(filePaths);
    path && removeStorageFile(path);
  };

  return (
    <div>
      <Button
        disabled={loading}
        variant="outline"
        type="button"
        onClick={handleClickUpload}
      >
        {loading ? (
          <Loader2Icon className="mr-2 h-4 w-4" />
        ) : (
          <UploadIcon className="mr-2 h-4 w-4" />
        )}
        点击上传文件
      </Button>
      <input
        onChange={handleChangeFileUpload}
        hidden
        ref={fileInputRef}
        type="file"
      />
      {value && (
        <div className="pt-3">
          <ImageList data={value} showRemove onRemove={handleRemoveFile} />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
