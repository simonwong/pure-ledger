import React, { useImperativeHandle, useState } from 'react';
import { Button } from '@easy-shadcn/react';
import { UploadIcon } from 'lucide-react';
import { open } from '@tauri-apps/plugin-dialog';
import { ImageList } from '@/components/ImageList';
import { copyFileByLedgerId, removeStorageFile } from '@/lib/storageFile';
import { UploadFileData } from './type';

// UploadFileData 表示被上传的本地文件，string 表示已经存到app中的文件路径
type FileType = UploadFileData | string;

interface FileUploaderProps {
  ledgerId: number;
  value?: FileType[];
  onChange?: (filePaths: FileType[]) => void;
}

export type FileUploaderAction = {
  fileChanged: () => Promise<string[]>;
};

/**
 * 目前方案：
 * 新增更新：
 * 调用 ref fileChanged 来删除文件&文件move
 *
 * bill和ledger 的删除
 * 由各自的 api 去删除
 */
const FileUploader = React.forwardRef<FileUploaderAction, FileUploaderProps>(
  ({ ledgerId, value, onChange }, ref) => {
    const [removeFilePaths, setRemoveFilePaths] = useState<string[]>([]);

    useImperativeHandle(
      ref,
      () => ({
        fileChanged: async () => {
          await Promise.all(removeFilePaths.map((path) => removeStorageFile(path)));

          let resFilePaths: string[] = [];
          for (const file of value || []) {
            if (typeof file === 'string') {
              resFilePaths.push(file);
            } else {
              const filePath = await copyFileByLedgerId(file.path, String(ledgerId));
              resFilePaths.push(filePath);
            }
          }
          return resFilePaths;
        },
      }),
      [ledgerId, removeFilePaths, value]
    );

    const handleClickUpload = async () => {
      const files = await open({
        multiple: true,
        directory: false,
        filters: [{ name: 'image', extensions: ['svg', 'png', 'jpg', 'jpeg', 'webp'] }],
      });
      if (files) {
        const innerFiles = files.map((url) => ({
          inner: true,
          path: url,
        }));
        onChange?.([...(value || []), ...innerFiles]);
      }
    };

    const handleRemoveFile = (idx: number) => {
      const path = value?.[idx];
      let filePaths = value ? [...value] : [];
      filePaths.splice(idx, 1);
      onChange?.(filePaths);

      if (typeof path === 'string') {
        setRemoveFilePaths((p) => [...p, path]);
      }
    };

    return (
      <div>
        <Button icon={<UploadIcon />} variant="outline" type="button" onClick={handleClickUpload}>
          点击上传文件
        </Button>
        {value && (
          <div className="pt-3">
            <ImageList data={value} showRemove onRemove={handleRemoveFile} />
          </div>
        )}
      </div>
    );
  }
);

export default FileUploader;
