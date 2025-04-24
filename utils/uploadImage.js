import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from 'react-native-uuid';

export const uploadImageAsync = async (uri) => {
  const blob = await (await fetch(uri)).blob();
  const filename = `${uuid.v4()}.jpg`;

  const storage = getStorage();
  const storageRef = ref(storage, `profilePics/${filename}`);

  await uploadBytes(storageRef, blob);
  return await getDownloadURL(storageRef);
};
