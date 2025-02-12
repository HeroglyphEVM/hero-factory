import { ImageIcon, X } from "lucide-react"
import { useState, useCallback } from "react"
import { Label } from "../ui/label"

const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
// const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png'];


export const ImageUploader = ({ onChange }: { onChange: (file: File | null) => void }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageUpload = useCallback((file: File) => {
    // if (file !== null && !ALLOWED_FILE_TYPES.includes(file.type)) {
    //   setError('Invalid image format. Only JPG or PNG is allowed.');
    //   return;
    // }
  
    if (file !== null && file?.size > MAX_IMAGE_SIZE) {
      setError('File size exceeds the 2MB limit.');
      return;
    }
  
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    setError(null);
    onChange(file);
  }, [onChange])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }, [handleImageUpload])

  const handleRemoveImage = useCallback(() => {
    onChange(null);
    setImagePreview(null)
  }, [onChange])
  
  return (
    <div>
      <div className="space-y-2">
        <Label htmlFor="imageUpload">Token Image</Label>
        <div
          className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${isDragging ? 'border-blue-500 bg-blue-500 bg-opacity-10' : 'border-gray-600 hover:border-gray-500'
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('imageUpload')?.click()}
        >
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
            className="hidden"
          />
          <div className="flex items-center justify-center space-x-4 cursor-pointer">
            <div className="relative w-24 h-24 flex-shrink-0">
              {imagePreview ? (
                <img src={imagePreview} alt="Token preview" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
                  <ImageIcon className="h-12 w-12" />
                </div>
              )}
              {imagePreview && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveImage()
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex-1 text-center">
              <p className="text-lg font-semibold mb-2">
                Upload Image
              </p>
              <p className="text-sm text-gray-400">
                Click or drag and drop your image here
              </p>
            </div>
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}