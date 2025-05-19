import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '@/src/configs/firebase';

export const deleteFromFirebase = async (fileUrl: string): Promise<boolean> => {
    try {
        const fileRef = ref(storage, fileUrl);
        await deleteObject(fileRef);
        return true;
    } catch (error) {
        console.warn('Firebase remove error:', error);
        return false;
    }
};

export const uploadImageToFirebase = async (image: any, folderPath: string): Promise<string | boolean> => {
    try {
        const response = await fetch(image.uri);
        const blob = await response.blob();

        const filename = image.fileName || `image_${Date.now()}`;
        const imageRef = ref(storage, `${folderPath}/${filename}`);

        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);

        return downloadURL;
    } catch (error) {
        console.error('Firebase upload error:', error);
        return false;
    }
};