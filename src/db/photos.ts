import { Platform } from "react-native";
import { Directory, File, Paths } from "expo-file-system";

// Image picker results live in the cache directory, which the OS may purge.
export async function persistPhoto(sourceUri: string, id: string): Promise<string> {
  if (Platform.OS === "web") return sourceUri;
  const dir = new Directory(Paths.document, "journal");
  if (!dir.exists) dir.create({ intermediates: true });
  const ext = sourceUri.split("?")[0].split(".").pop()?.toLowerCase() || "jpg";
  const dest = new File(dir, `${id}.${ext}`);
  await new File(sourceUri).copy(dest);
  return dest.uri;
}

export function deletePhotoFile(uri: string): void {
  if (Platform.OS === "web") return;
  const file = new File(uri);
  if (file.exists) file.delete();
}
