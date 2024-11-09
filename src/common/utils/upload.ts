import { BlobServiceClient, BlockBlobClient } from "@azure/storage-blob";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import sharp from "sharp";
import { ENVIRONMENT } from "../config/environment";

// Define allowed file types
const ALLOWED_FILE_TYPES = {
  IMAGE: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  VIDEO: ["video/mp4", "video/mpeg", "video/quicktime"],
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};

// Improved configuration object
const CONFIG = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50 MB
  IMAGE: {
    MAX_WIDTH: 1200,
    MAX_HEIGHT: 1200,
    QUALITY: 80,
    FORMAT: "webp",
  },
  UPLOAD_RETRY_ATTEMPTS: 3,
  UPLOAD_RETRY_DELAY: 1000, // 1 second
};

// Enhanced error handling
class FileUploadError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message);
    this.name = "FileUploadError";
  }
}

// Improved multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: CONFIG.MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const isAllowedType = [
      ...ALLOWED_FILE_TYPES.IMAGE,
      ...ALLOWED_FILE_TYPES.VIDEO,
      ...ALLOWED_FILE_TYPES.DOCUMENT,
    ].includes(file.mimetype);

    if (isAllowedType) {
      cb(null, true);
    } else {
      cb(
        new FileUploadError(
          "Invalid file type. Please upload an image, video, or document (PDF, DOC, DOCX).",
          "INVALID_FILE_TYPE",
        ),
      );
    }
  },
});

// Initialize Azure Blob Storage client with connection pooling
const blobServiceClient = BlobServiceClient.fromConnectionString(
  ENVIRONMENT.STORAGE.AZURE_STORAGE_CONNECTION_STRING,
  {
    retryOptions: {
      maxTries: CONFIG.UPLOAD_RETRY_ATTEMPTS,
      tryTimeoutInMs: 30000,
    },
    keepAliveOptions: {
      enable: true,
    },
  },
);

const containerClient = blobServiceClient.getContainerClient(
  ENVIRONMENT.STORAGE.AZURE_CONTAINER_NAME,
);

// Improved file name generation with type checking
const generateFileName = (originalName: string): string => {
  const fileExtension = path.extname(originalName).toLowerCase();
  const uniqueId = uuidv4();
  const timestamp = Date.now();
  return `${uniqueId}-${timestamp}${fileExtension}`;
};

// Generic upload function with retry logic
const uploadWithRetry = async (
  blockBlobClient: BlockBlobClient,
  buffer: Buffer,
  contentType: string,
): Promise<string> => {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= CONFIG.UPLOAD_RETRY_ATTEMPTS; attempt++) {
    try {
      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: {
          blobContentType: contentType,
        },
      });
      return blockBlobClient.url;
    } catch (error) {
      lastError = error as Error;
      if (attempt < CONFIG.UPLOAD_RETRY_ATTEMPTS) {
        await new Promise((resolve) =>
          setTimeout(resolve, CONFIG.UPLOAD_RETRY_DELAY),
        );
      }
    }
  }

  throw new FileUploadError(
    `Failed to upload file after ${CONFIG.UPLOAD_RETRY_ATTEMPTS} attempts: ${lastError?.message}`,
    "UPLOAD_FAILED",
  );
};

// Optimized image upload with better error handling
export const uploadImage = async (
  file: Express.Multer.File,
  maxWidth = CONFIG.IMAGE.MAX_WIDTH,
  maxHeight = CONFIG.IMAGE.MAX_HEIGHT,
  quality = CONFIG.IMAGE.QUALITY,
): Promise<string> => {
  try {
    const buffer = await sharp(file.buffer)
      .resize(maxWidth, maxHeight, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .webp({ quality })
      .toBuffer();

    const blobName = generateFileName(file.originalname).replace(
      /\.[^/.]+$/,
      ".webp",
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    return await uploadWithRetry(blockBlobClient, buffer, "image/webp");
  } catch (error) {
    throw new FileUploadError(
      `Image processing failed: ${(error as Error).message}`,
      "IMAGE_PROCESSING_FAILED",
    );
  }
};

// Enhanced delete function with existence check
export const deleteFile = async (fileUrl: string): Promise<void> => {
  try {
    const blobName = path.basename(fileUrl);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const exists = await blockBlobClient.exists();
    if (!exists) {
      throw new FileUploadError("File not found", "FILE_NOT_FOUND");
    }

    await blockBlobClient.delete();
  } catch (error) {
    if (error instanceof FileUploadError) throw error;
    throw new FileUploadError(
      `Failed to delete file: ${(error as Error).message}`,
      "DELETE_FAILED",
    );
  }
};

// Optimized video upload with type checking
export const uploadVideo = async (
  file: Express.Multer.File,
): Promise<string> => {
  if (!ALLOWED_FILE_TYPES.VIDEO.includes(file.mimetype)) {
    throw new FileUploadError("Invalid video format", "INVALID_VIDEO_FORMAT");
  }

  const blobName = generateFileName(file.originalname);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  return await uploadWithRetry(blockBlobClient, file.buffer, file.mimetype);
};

// Optimized document upload with type checking
export const uploadDocument = async (
  file: Express.Multer.File,
): Promise<string> => {
  if (!ALLOWED_FILE_TYPES.DOCUMENT.includes(file.mimetype)) {
    throw new FileUploadError(
      "Invalid document format",
      "INVALID_DOCUMENT_FORMAT",
    );
  }

  const blobName = generateFileName(file.originalname);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  return await uploadWithRetry(blockBlobClient, file.buffer, file.mimetype);
};

// Improved multiple file upload with parallel processing
export const uploadMultipleFiles = async (
  files: Express.Multer.File[],
): Promise<string[]> => {
  if (!files.length) {
    throw new FileUploadError("No files provided", "NO_FILES");
  }

  const uploadPromises = files.map((file) => {
    if (ALLOWED_FILE_TYPES.IMAGE.includes(file.mimetype)) {
      return uploadImage(file);
    } else if (ALLOWED_FILE_TYPES.VIDEO.includes(file.mimetype)) {
      return uploadVideo(file);
    } else if (ALLOWED_FILE_TYPES.DOCUMENT.includes(file.mimetype)) {
      return uploadDocument(file);
    } else {
      throw new FileUploadError(
        `Unsupported file type: ${file.mimetype}`,
        "UNSUPPORTED_FILE_TYPE",
      );
    }
  });

  return Promise.all(uploadPromises);
};

export { upload, FileUploadError, ALLOWED_FILE_TYPES, CONFIG };
