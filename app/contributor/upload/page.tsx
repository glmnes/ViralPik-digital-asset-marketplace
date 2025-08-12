'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  X, 
  Plus, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  Package,
  BarChart3,
  DollarSign,
  TrendingUp,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { platformConfig } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useFileUpload } from '@/hooks/useFileUpload';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import TagSelector from '@/components/TagSelector';

// Helper function to check if file is an image
const isImageFile = (file: File): boolean => {
  const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  return imageTypes.includes(file.type) || file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) !== null;
};

// Helper function to get actual image dimensions
const getImageDimensions = (file: File): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!isImageFile(file)) {
      resolve(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve(`${img.width}x${img.height}`);
      };
      img.onerror = () => {
        resolve(null);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      resolve(null);
    };
    reader.readAsDataURL(file);
  });
};

export default function ContributorUploadPage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { uploadFile, isUploading, progress } = useFileUpload();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    platform: '',
    assetType: '',
    tags: [] as string[],
    file: null as File | null,
    preview: null as File | null,
    price: 0,
    isFree: true,
    isPack: false,
    packPrice: 10,
    packItems: [] as File[]
  });
  
  const [dragActive, setDragActive] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/signin');
      return;
    }

    if (user && profile && !profile.is_creator) {
      toast.error('You need to be a verified creator to upload assets');
      router.push('/');
    }
  }, [user, profile, loading, router]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file type is allowed
    const fileName = file.name.toLowerCase();
    const fileExt = fileName.split('.').pop();
    
    // Allowed file types: PSD, SVG, MP4, ZIP only
    const allowedTypes = ['psd', 'svg', 'mp4', 'zip'];
    
    if (!allowedTypes.includes(fileExt || '')) {
      toast.error('Only PSD, SVG, MP4, and ZIP files are allowed. Use ZIP for image packs.');
      return;
    }
    
    setFormData({ ...formData, file, isPack: fileExt === 'zip' });
    
    // Auto-generate preview for SVG
    if (fileExt === 'svg') {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    
    // Make preview required for PSD files
    if (fileExt === 'psd' && !formData.preview) {
      toast.info('Preview image is required for PSD files');
    }
  };

  const handleTagsChange = (newTags: string[]) => {
    setFormData({
      ...formData,
      tags: newTags
    });
  };

  const handleSubmit = async () => {
    if (!user) {
      toast.error('Please sign in to upload assets');
      return;
    }

    if (!formData.file) {
      toast.error('Please select a file to upload');
      return;
    }

    if (!formData.title || !formData.platform || !formData.assetType) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.tags.length < 5) {
      toast.error('Please select at least 5 tags');
      return;
    }

    // Check if PSD requires preview
    const fileExt = formData.file.name.toLowerCase().split('.').pop();
    if (fileExt === 'psd' && !formData.preview) {
      toast.error('Preview image is required for PSD files');
      return;
    }

    // Validate pack pricing
    if (formData.isPack && !formData.isFree) {
      if (formData.packPrice < 4 || formData.packPrice > 50) {
        toast.error('Pack price must be between $4 and $50');
        return;
      }
    }

    try {
      // Upload main asset file to R2
      toast.loading('Uploading asset...');
      const assetResult = await uploadFile(formData.file);
      
      if (!assetResult) {
        throw new Error('Asset upload failed');
      }

      // Upload preview if provided
      let previewUrl = assetResult.thumbnailUrl;
      if (formData.preview) {
        toast.dismiss();
        toast.loading('Uploading preview...');
        const previewResult = await uploadFile(formData.preview);
        if (previewResult) {
          previewUrl = previewResult.assetUrl;
        }
      }

      toast.dismiss();
      toast.loading('Creating asset...');

      // Get actual dimensions from the preview image or use platform defaults
      let dimensions = null;
      
      // Wait for actual image dimensions if we have a preview
      if (formData.preview || (formData.file && isImageFile(formData.file))) {
        dimensions = await getImageDimensions(formData.preview || formData.file!);
      }
      
      // Fallback to platform dimensions if no actual dimensions
      if (!dimensions) {
        const platformData = platformConfig[formData.platform as keyof typeof platformConfig];
        if (platformData?.dimensions) {
          const dim = (platformData.dimensions as any)[formData.assetType];
          if (dim && typeof dim === 'object' && 'width' in dim && 'height' in dim) {
            dimensions = `${dim.width}x${dim.height}`;
          }
        }
      }

      // Create asset in database
      const { data, error } = await supabase
        .from('assets')
        .insert({
          title: formData.title,
          description: formData.description,
          platform: formData.platform,
          asset_type: formData.assetType,
          tags: formData.tags,
          creator_id: user.id,
          file_url: assetResult.assetUrl,
          preview_url: previewUrl,
          file_size: formData.file.size,
          format: formData.file.name.split('.').pop()?.toUpperCase() || 'PNG',
          dimensions: dimensions,
          status: profile?.is_admin ? 'approved' : 'pending',
          download_count: 0,
          view_count: 0,
          like_count: 0,
          is_trending: false,
          price: formData.isFree ? 0 : formData.price,
          is_premium: !formData.isFree
        })
        .select()
        .single();

      if (error) throw error;

      // Fire-and-forget enrichment (does not block UX)
      try {
        fetch('/api/enrich', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ assetId: data.id })
        }).catch(() => {});
      } catch {}

      toast.dismiss();
      toast.success('Asset uploaded successfully!');
      router.push('/contributor/assets');
    } catch (error) {
      console.error('Upload error:', error);
      toast.dismiss();
      toast.error('Failed to upload asset');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-zinc-900 min-h-screen border-r border-zinc-800">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {profile?.username?.[0]?.toUpperCase() || 'C'}
                </span>
              </div>
              <div>
                <h3 className="text-zinc-100 font-semibold">{profile?.username}</h3>
                <p className="text-zinc-400 text-sm">Contributor</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link href="/contributor" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <BarChart3 className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              <Link href="/contributor/assets" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <Package className="w-5 h-5" />
                <span>My Assets</span>
              </Link>
              <Link href="/contributor/upload" className="flex items-center gap-3 px-3 py-2 bg-zinc-800 text-zinc-100 rounded-lg">
                <Upload className="w-5 h-5" />
                <span>Upload</span>
              </Link>
              <Link href="/contributor/earnings" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <DollarSign className="w-5 h-5" />
                <span>Earnings</span>
              </Link>
              <Link href="/contributor/analytics" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <TrendingUp className="w-5 h-5" />
                <span>Analytics</span>
              </Link>
              <Link href="/contributor/settings" className="flex items-center gap-3 px-3 py-2 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="bg-zinc-900 border-b border-zinc-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-100">Upload New Asset</h1>
                <p className="text-zinc-400 mt-1">Add new content to your portfolio</p>
              </div>
              <Link 
                href="/contributor/assets"
                className="px-4 py-2 text-zinc-400 hover:text-zinc-100 transition-colors flex items-center gap-2"
              >
                <ChevronLeft className="w-5 h-5" />
                Back to Assets
              </Link>
            </div>
          </div>

          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              {/* Upload Tips */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-8 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                <div className="text-sm text-blue-400">
                  <p className="font-medium mb-1">Upload Guidelines:</p>
                  <ul className="list-disc list-inside space-y-1 text-blue-400/80">
                    <li><strong>PSD files:</strong> Preview image required</li>
                    <li><strong>SVG files:</strong> Auto-generated preview</li>
                    <li><strong>ZIP files:</strong> Treated as asset packs ($4-$50 range)</li>
                    <li><strong>Individual JPG/PNG:</strong> Not allowed - use ZIP packs</li>
                    <li>Files must be under 50MB</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* File Upload Section */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-lg font-semibold text-zinc-100 mb-4">File Upload</h2>
                  
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                      dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700 hover:border-zinc-600'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    {formData.file ? (
                      <div>
                        {filePreview && (
                          <img src={filePreview} alt="Preview" className="w-32 h-32 mx-auto mb-4 rounded-lg object-cover" />
                        )}
                        <p className="text-zinc-100 font-medium mb-2">{formData.file.name}</p>
                        <p className="text-zinc-400 text-sm mb-4">
                          {(formData.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <button
                          onClick={() => {
                            setFormData({ ...formData, file: null });
                            setFilePreview(null);
                          }}
                          className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                        >
                          Remove File
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 text-zinc-500 mx-auto mb-4" />
                        <p className="text-zinc-100 font-medium mb-2">Drag and drop your file here</p>
                        <p className="text-zinc-400 text-sm mb-4">or</p>
                        <label className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer inline-block">
                          Browse Files
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                            accept=".psd,.svg,.mp4,.zip"
                          />
                        </label>
                        <p className="text-zinc-500 text-xs mt-4">
                          Allowed: PSD, SVG, MP4, ZIP (Max 50MB)
                        </p>
                        <p className="text-zinc-500 text-xs mt-1">
                          Use ZIP for image packs (JPG/PNG collections)
                        </p>
                      </>
                    )}
                  </div>

                  {/* Preview Upload */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                      Preview Image {formData.file?.name.toLowerCase().endsWith('.psd') ? '(Required for PSD)' : '(Optional)'}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, preview: e.target.files?.[0] || null })}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-zinc-700 file:text-zinc-300 hover:file:bg-zinc-600"
                    />
                    {formData.preview && (
                      <p className="text-sm text-zinc-400 mt-2">
                        Preview: {formData.preview.name}
                      </p>
                    )}
                    {formData.file?.name.toLowerCase().endsWith('.svg') && (
                      <p className="text-xs text-green-400 mt-2">
                        SVG files generate automatic previews
                      </p>
                    )}
                  </div>

                  {/* Pack Info */}
                  {formData.isPack && (
                    <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                      <p className="text-sm font-medium text-yellow-400 mb-2">📦 Asset Pack Detected</p>
                      <p className="text-xs text-yellow-400/80">
                        ZIP files are treated as asset packs. Individual items inside will be available separately.
                      </p>
                    </div>
                  )}
                </div>

                {/* Asset Details */}
                <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800">
                  <h2 className="text-lg font-semibold text-zinc-100 mb-4">Asset Details</h2>
                  
                  <div className="space-y-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter asset title"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Describe your asset"
                      />
                    </div>

                    {/* Platform */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Platform *
                      </label>
                      <select
                        value={formData.platform}
                        onChange={(e) => setFormData({ ...formData, platform: e.target.value, assetType: '' })}
                        className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select platform</option>
                        {Object.entries(platformConfig).map(([key, config]) => (
                          <option key={key} value={key}>
                            {config.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Asset Type */}
                    {formData.platform && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Asset Type *
                        </label>
                        <select
                          value={formData.assetType}
                          onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select asset type</option>
                          {platformConfig[formData.platform as keyof typeof platformConfig]?.assetTypes.map((type) => (
                            <option key={type} value={type}>
                              {type.replace('-', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Tags * (Required: 5-10 tags)
                      </label>
                      <TagSelector
                        selectedTags={formData.tags}
                        onTagsChange={handleTagsChange}
                        minTags={5}
                        maxTags={10}
                      />
                    </div>

                    {/* Pricing */}
                    {profile?.can_earn && (
                      <div>
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                          Pricing
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={formData.isFree}
                              onChange={() => setFormData({ ...formData, isFree: true, price: 0 })}
                              className="text-blue-500"
                            />
                            <span className="text-zinc-300">Free</span>
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={!formData.isFree}
                              onChange={() => setFormData({ ...formData, isFree: false })}
                              className="text-blue-500"
                            />
                            <span className="text-zinc-300">Premium</span>
                          </label>
                          {!formData.isFree && (
                            <>
                              {formData.isPack ? (
                                <div className="space-y-2">
                                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                                    <p className="text-xs text-yellow-400 mb-2">
                                      🎮 <strong>Pack Pricing:</strong> Users can buy individual items or the full pack
                                    </p>
                                    <input
                                      type="number"
                                      value={formData.packPrice}
                                      onChange={(e) => setFormData({ ...formData, packPrice: parseFloat(e.target.value) || 0 })}
                                      className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                      placeholder="Pack price ($4-$50)"
                                      min="4"
                                      max="50"
                                      step="1"
                                    />
                                    <p className="text-xs text-zinc-500 mt-1">
                                      Individual items will be priced automatically based on pack size
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <input
                                  type="number"
                                  value={formData.price}
                                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                  placeholder="Price in USD"
                                  min="0.99"
                                  step="0.01"
                                />
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={() => router.push('/contributor/assets')}
                  className="px-6 py-3 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isUploading || !formData.file || !formData.title || !formData.platform || !formData.assetType}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Uploading... {progress.percentage}%
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Publish Asset
                    </>
                  )}
                </button>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="mt-4">
                  <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
                    <div className="flex items-center justify-between text-sm text-zinc-400 mb-2">
                      <span>Uploading to Cloudflare R2...</span>
                      <span>{progress.percentage}%</span>
                    </div>
                    <div className="w-full bg-zinc-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
