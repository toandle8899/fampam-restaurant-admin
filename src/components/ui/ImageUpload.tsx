import { useState, useRef } from "react";
import { Button } from "./button";
import { toast } from "sonner";
import { Loader2, UploadCloud } from "lucide-react";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Configure S3 Client for Cloudflare R2
const s3Client = new S3Client({
  region: "auto",
  endpoint: "https://d83aa50b333865f19404fbc1cf750a99.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: "994e5be9c6f2f4af8992ce454ea5122d",
    secretAccessKey: "cd3059fca8fd8def508541662ffc8ac3eee38cf09315f5dca8b9be97e4075f4a",
  },
});

export const BUCKET_NAME = "fampam-assets";
export const PUBLIC_DOMAIN = "https://pub-8cce0d5378724856b211904c1b1c0277.r2.dev";

export const uploadFileToR2 = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop() || "png";
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: filePath,
    Body: file,
    ContentType: file.type,
  });

  await s3Client.send(command);
  return `${PUBLIC_DOMAIN}/${filePath}`;
};

interface ImageUploadProps {
  onUpload: (url: string) => void;
  disabled?: boolean;
}

export function ImageUpload({ onUpload, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast.error("Please upload an image or video file");
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to R2
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: filePath,
        Body: file,
        ContentType: file.type,
      });

      await s3Client.send(command);

      const publicUrl = `${PUBLIC_DOMAIN}/${filePath}`;
      
      onUpload(publicUrl);
      toast.success("File uploaded successfully to Cloudflare R2!");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Failed to upload file. " + error.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="relative inline-block">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        className="hidden"
        disabled={disabled || isUploading}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || isUploading}
        onClick={() => fileInputRef.current?.click()}
        className="gap-2 shrink-0"
      >
        {isUploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <UploadCloud className="h-4 w-4" />
        )}
        {isUploading ? "Uploading..." : "Upload File"}
      </Button>
    </div>
  );
}
