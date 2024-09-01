import * as React from "react";
import { Button } from "@easy-shadcn/react";
import { UploadIcon } from "lucide-react";
import { open } from "@tauri-apps/plugin-dialog";
import { ImageList } from "@/components/ImageList";
import { copyFilesByLedgerId, removeStorageFile } from "@/lib/storageFile";

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
  const handleClickUpload = async () => {
    const files = await open({
      multiple: true,
      directory: false,
      filters: [
        { name: "image", extensions: ["svg", "png", "jpg", "jpeg", "webp"] },
      ],
    });
    if (files) {
      const filePaths = await copyFilesByLedgerId(
        files.map((file) => file.path),
        ledgerId
      );
      onChange?.([...(value || []), ...filePaths]);
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
      <Button variant="outline" type="button" onClick={handleClickUpload}>
        <UploadIcon className="mr-2 h-4 w-4" />
        点击上传文件
      </Button>
      {value && (
        <div className="pt-3">
          <ImageList data={value} showRemove onRemove={handleRemoveFile} />
        </div>
      )}
    </div>
  );
};

export default FileUploader;
