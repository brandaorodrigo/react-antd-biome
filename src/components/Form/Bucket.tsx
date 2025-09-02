import { App, type GetProp, Upload, type UploadProps } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import axiosOriginal, { type Axios } from 'axios';
import dayjs from 'dayjs';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { AiOutlineAudio } from 'react-icons/ai';
import { BsTextLeft } from 'react-icons/bs';
import { MdAttachFile, MdOutlinePhoto } from 'react-icons/md';

type bucketImageProps = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type BucketProps = Omit<UploadProps, 'onChange' | 'customRequest'> & {
    action?: string;
    allow?: 'image' | 'text' | 'audio' | 'all';
    axios?: Axios;
    block?: boolean;
    customRequest?: (file: File) => Promise<string>;
    hideWhenMaxCount?: boolean;
    onChange?: (files?: string | string[]) => void;
    useFilename?: boolean;
    value?: string[] | string;
};

const bucketImage = (file: bucketImageProps): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(String(error));
    });

const audio = ['mp3', 'wav', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'];
const image = ['jpg', 'jpeg', 'gif', 'png', 'svg', 'webp', 'heic'];
const text = ['txt', 'doc', 'docx', 'pdf', 'rtf', 'odt'];

type BucketIconProps = {
    file?: string;
    size?: number;
    style?: React.CSSProperties;
};

const BucketIcon: React.FC<BucketIconProps> = ({ file, size = 28, style }) => {
    if (!file) {
        return <MdAttachFile size={size} />;
    }
    const split = file?.split('.');
    const ext = split.length === 1 ? split.shift() : split.pop();
    if (!ext) {
        return <MdAttachFile size={size} style={style} />;
    }
    if (image.includes(ext)) {
        return <MdOutlinePhoto size={size} style={style} />;
    }
    if (audio.includes(ext)) {
        return <AiOutlineAudio size={size} style={style} />;
    }
    if (text.includes(ext)) {
        return <BsTextLeft size={size} style={style} />;
    }
    return <MdAttachFile size={size} style={style} />;
};

const Bucket: React.FC<BucketProps> = ({
    action,
    allow = 'all',
    axios = axiosOriginal,
    customRequest,
    block = false,
    children,
    className,
    hideWhenMaxCount = true,
    listType = 'picture-card',
    maxCount,
    multiple,
    onChange,
    showUploadList,
    useFilename,
    value,
    ...props
}) => {
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [loaded, setLoaded] = useState(false);
    const { notification } = App.useApp();

    useEffect(() => {
        if (!value || loaded) {
            return;
        }
        const original = typeof value === 'string' ? [value] : value;
        const fileList = [] as UploadFile<any>[];
        original.forEach((each, index) => {
            fileList.push({
                uid: String(index),
                name: each,
                status: 'done',
                url: each,
            });
        });
        setFileList(fileList);
        setLoaded(true);
    }, [value]);

    const actionPreSigned = async (file: any, url: string): Promise<string> => {
        const temporary = await axios.post(url, {
            fileName: file.name,
            fileType: file.type,
        });
        const preSigned = temporary?.data?.url;
        if (!preSigned) {
            const message = t('Erro ao ler o arquivo');
            notification.error({ message });
            throw message;
        }
        try {
            await fetch(preSigned, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file,
            });
            return preSigned.split('?')?.[0];
        } catch (_error: any) {
            const message = t('Ocorreu um erro inesperado');
            notification.error({ message });
            throw message;
        }
    };

    const customRequestInternal = async ({ file, onSuccess, onError }: any): Promise<void> => {
        const split = file?.name?.split('.');
        const extension = split?.pop()?.toLowerCase() || 'txt';
        const random = (Math.floor(Math.random() * 1000) + 1000).toString().substring(1);
        if (
            (allow === 'image' && !image.includes(extension)) ||
            (allow === 'audio' && !audio.includes(extension)) ||
            (allow === 'text' && !text.includes(extension)) ||
            (allow === 'all' && ![...image, ...audio, ...text].includes(extension))
        ) {
            const content = t('Tipo de arquivo não autorizado');
            notification.error({ message: content });
            onError(content);
            return;
        }
        const newFileName =
            !image.includes(extension) && useFilename
                ? `${split.join('.')}__${random}.${extension}`
                : `${dayjs().unix()}${random}.${extension}`;

        const renamedFile = new File([file], newFileName, { type: file.type });

        if (customRequest) {
            customRequest(renamedFile)
                .then((url) => onSuccess({ url }))
                .catch((error) => onError(error));
            return;
        }

        if (action) {
            actionPreSigned(renamedFile, action)
                .then((url) => onSuccess({ url }))
                .catch((error) => onError(error));
            return;
        }
    };

    return (
        <Upload
            className={block ? `block ${className || ''}` : className}
            customRequest={customRequestInternal}
            fileList={fileList}
            iconRender={(file) => <BucketIcon file={file.url} />}
            listType={listType}
            maxCount={maxCount}
            multiple={multiple}
            onChange={(info) => {
                setFileList(info.fileList);
                const files = [] as string[];
                for (const file of info.fileList) {
                    if (file?.response?.url) {
                        files.push(file.response.url);
                    }
                    if (file?.url) {
                        files.push(file.url);
                    }
                }
                if (onChange) {
                    onChange(multiple ? files : files.shift());
                }
            }}
            showUploadList={showUploadList || { showPreviewIcon: false }}
            {...props}
        >
            {hideWhenMaxCount && maxCount && fileList?.length >= maxCount ? null : children}
        </Upload>
    );
};

export default Bucket;

export { BucketIcon, bucketImage, type bucketImageProps, type BucketProps };
