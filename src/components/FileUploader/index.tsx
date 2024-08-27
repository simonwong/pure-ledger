import { Button } from "@easy-shadcn/react";
import { UploadIcon } from "lucide-react";
import * as React from "react";
import { ImageList } from "@/components/ImageList";

interface FileUploaderProps {
  value?: File[];
  onChange?: (files: File[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ value, onChange }) => {
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

  const handleChangeFileUpload: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    if (e.target.files) {
      const file = e.target.files[0];
      onChange?.([...(value || []), file]);
    }
  };

  const handleRemoveFile = (idx: number) => {
    let files = value ? [...value] : [];
    files.splice(idx, 1);
    onChange?.(files);
  };

  return (
    <div>
      <Button variant="outline" type="button" onClick={handleClickUpload}>
        <UploadIcon className="mr-2 h-4 w-4" />
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
