import { FormEvent, useEffect, useRef, useState } from 'react';
import { BsCamera } from 'react-icons/bs';
import {
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { storage } from '../../utilities/storage';
import { useUser } from '../../store/User/UserContext';
import { updateUser } from '../../store/User/UserActions';
import { Circle } from 'rc-progress';

type Props = {
    imageURL: string;
};

export default function ProfilePicture({ imageURL }: Props) {
    const [preview, setPreview] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    const {
        dispatch,
        state: { user },
    } = useUser();

    useEffect(() => {
        if (!uploadProgress) return;

        if (uploadProgress === 100) setUploadProgress(0);
    }, [uploadProgress]);

    // rerender once the preview state changes
    useEffect(() => {}, [preview]);

    const handleChange = (e: FormEvent) => {
        const target = e.target as HTMLInputElement;

        const file = target.files![0];
        const fileType = file.type.split('/')[1];

        removeImage(fileType);

        storeImage(fileType, file);

        const reader = new FileReader();

        reader.onload = () => {
            setPreview(reader.result as string);
        };

        reader.readAsDataURL(file);
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const storeImage = async (type: string, file: File) => {
        const storageRef = ref(
            storage,
            `images/${user?.username}-${user?.id}-profile.${type}`
        );

        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            snapshot => {
                const progress =
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            error => {
                console.error(error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
                    updateUser(dispatch, { imageURL: downloadURL });
                });
            }
        );
    };

    const removeImage = (type: string) => {
        const storageRef = ref(
            storage,
            `images/${user?.username}-${user?.id}-profile.${type}`
        );

        deleteObject(storageRef)
            .then(() => {})
            .catch(err => {
                console.error(err.message);
            });
    };

    return (
        <>
            {uploadProgress !== 0 && <ProgressModal percent={uploadProgress} />}
            <div className="">
                <div
                    className="relative inline-block cursor-pointer"
                    onClick={handleClick}
                >
                    <img
                        src={
                            preview ||
                            imageURL ||
                            'assets/images/default-avatar.png'
                        }
                        className="rounded-full w-[60px] h-[60px]"
                        alt="profile"
                    />
                    <span className="absolute -top-1 left-9 p-1 bg-[#A5A4A4] rounded-full text-white">
                        <BsCamera className="text-sm" />
                    </span>
                </div>
                <input
                    type="file"
                    onChange={handleChange}
                    accept=".jpg,.png"
                    multiple={false}
                    className="hidden"
                    ref={inputRef}
                />
            </div>
        </>
    );
}

function ProgressModal({ percent }: { percent: number }) {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50 text-white z-10">
            <div className="w-[80px] h-[80px]">
                <Circle
                    percent={percent}
                    strokeWidth={6}
                    strokeColor="#00FF00"
                />
                <span>Uploading...</span>
                <span className="text-center block">
                    {Math.round(percent)}%
                </span>
            </div>
        </div>
    );
}
