import type { Request, Response } from "express";
import { sendSuccess, sendError } from "../../utils/response.ts";

export const uploadFile = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      // Multer might populate req.file
      return sendError(res, 400, "Bad Request", "No file uploaded");
    }

    // Construct public URL
    // Assuming /uploads is served statically
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return sendSuccess(
      res,
      201,
      {
        file_url: fileUrl,
        file_name: req.file.originalname,
        file_size: req.file.size,
        file_mime_type: req.file.mimetype,
      },
      "File uploaded successfully",
    );
  } catch (error: any) {
    return sendError(res, 500, "Internal Server Error", error.message);
  }
};
