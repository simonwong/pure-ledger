import React, { useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { getStorageFilePath } from '@/lib/storageFile';
import ImagePreview from './ImagePreview';
import { convertFileSrc } from '@tauri-apps/api/core';
import { UploadFileData } from '../FileUploader/type';
import { cn } from '@easy-shadcn/utils';

interface ImageListProps {
  data?: (string | UploadFileData)[];
  showRemove?: boolean;
  onRemove?: (idx: number) => void;
  size?: 'default' | 'sm';
}

const getUrlStringList = async (files?: (string | UploadFileData)[]) => {
  if (!files || files.length === 0) {
    return [];
  }

  let res: string[] = [];

  for await (const item of files) {
    if (typeof item === 'string') {
      const path = await getStorageFilePath(item);
      res.push(path);
    } else {
      res.push(convertFileSrc(item.path));
    }
  }

  return res;
};

const ImageList: React.FC<ImageListProps> = ({ data, showRemove, onRemove, size }) => {
  const [urlStringList, setUrlStringList] = React.useState<string[]>([]);

  useEffect(() => {
    getUrlStringList(data).then((res) => {
      setUrlStringList(res);
    });
  }, [data]);

  if (!urlStringList || urlStringList.length == 0) {
    return null;
  }

  const sizeMap = {
    default: 'w-12 h-12',
    sm: 'w-10 h-10',
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {urlStringList.map((url, idx) => (
        <div key={idx} className="relative group">
          <ImagePreview urls={urlStringList} currentIdx={idx}>
            <img
              className={cn(sizeMap[size || 'default'], 'object-cover rounded-sm cursor-pointer')}
              src={url}
              alt=""
            />
          </ImagePreview>
          {showRemove && (
            <span
              onClick={() => onRemove?.(idx)}
              className="absolute bg-gray-500 rounded-full right-[-4px] top-[-4px] p-1 hidden group-hover:block cursor-pointer"
            >
              <XIcon className="w-3 h-3 text-white" />
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageList;
